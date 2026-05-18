[CmdletBinding()]
param(
    [switch]$SkipMilvus,
    [switch]$WebOnly,
    [switch]$InstallDeps,
    [switch]$NoBrowser,
    [switch]$NoLogTail
)

$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

function Write-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-RunLogDirectory {
    $logDir = Join-Path $repoRoot ".logs\run"
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    return $logDir
}

function Start-NanobotProcess {
    param(
        [string]$Name,
        [string]$FilePath,
        [string[]]$Arguments
    )

    $logDir = Get-RunLogDirectory
    $stdoutPath = Join-Path $logDir "$Name.stdout.log"
    $stderrPath = Join-Path $logDir "$Name.stderr.log"

    foreach ($path in @($stdoutPath, $stderrPath)) {
        if (Test-Path $path) {
            Remove-Item $path -Force
        }
        New-Item -ItemType File -Path $path -Force | Out-Null
    }

    $process = Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $repoRoot `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -WindowStyle Hidden `
        -PassThru

    return [PSCustomObject]@{
        Name = $Name
        ProcessId = $process.Id
        StdoutPath = $stdoutPath
        StderrPath = $stderrPath
    }
}

function Start-LogTailJob {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][string]$Path
    )

    return Start-Job -Name "tail-$Label" -ArgumentList $Label, $Path -ScriptBlock {
        param($label, $path)
        Get-Content -Path $path -Wait -Tail 20 | ForEach-Object {
            "[{0}] {1}" -f $label, $_
        }
    }
}

function Stream-NanobotLogs {
    param(
        [Parameter(Mandatory = $true)][object[]]$Sources
    )

    $jobs = @()
    try {
        foreach ($source in $Sources) {
            $jobs += Start-LogTailJob -Label $source.Label -Path $source.Path
        }

        while ($true) {
            foreach ($job in $jobs) {
                $output = @(Receive-Job -Job $job)
                foreach ($line in $output) {
                    Write-Host $line
                }
            }
            Start-Sleep -Milliseconds 250
        }
    } finally {
        foreach ($job in $jobs) {
            try {
                Stop-Job -Job $job -ErrorAction SilentlyContinue | Out-Null
            } catch {
            }
            try {
                Remove-Job -Job $job -Force -ErrorAction SilentlyContinue | Out-Null
            } catch {
            }
        }
    }
}

function Get-NanobotPython {
    $venvPython = Join-Path $repoRoot ".venv\Scripts\python.exe"
    if (Test-Path $venvPython) {
        return $venvPython
    }
    if (Test-CommandExists "python") {
        return "python"
    }
    throw "No Python interpreter was found for nanobot startup."
}

function Get-NanobotStartupState {
    $python = @'
import json

from nanobot.config.loader import get_config_path, load_config
from nanobot.providers.registry import PROVIDERS, find_by_name

path = get_config_path()
config = load_config(path)
model = config.agents.defaults.model
provider_name = config.get_provider_name(model)
provider = config.get_provider(model)
spec = find_by_name(provider_name) if provider_name else None

api_ready = False
api_reason = ""
if spec is None or provider is None:
    api_reason = "no_provider"
elif spec.is_oauth or spec.is_direct:
    api_ready = True
elif spec.is_local:
    api_ready = bool(config.get_api_base(model))
    if not api_ready:
        api_reason = "missing_local_api_base"
elif spec.backend == "azure_openai":
    api_ready = bool(provider.api_key and config.get_api_base(model))
    if not api_ready:
        api_reason = "missing_api_key_or_api_base"
else:
    api_ready = bool(provider.api_key)
    if not api_ready:
        api_reason = "missing_api_key"

configured_providers = []
for provider_spec in PROVIDERS:
    provider_config = getattr(config.providers, provider_spec.name, None)
    if provider_config is None or provider_spec.is_oauth:
        continue
    if getattr(provider_config, "api_key", "") or getattr(provider_config, "api_base", ""):
        configured_providers.append(provider_spec.name)

print(json.dumps({
    "config_path": str(path),
    "config_exists": path.exists(),
    "api_ready": api_ready,
    "api_reason": api_reason,
    "provider_name": provider_name or "",
    "model": model,
    "configured_providers": configured_providers,
}, ensure_ascii=False))
'@

    $raw = $python | uv run python -
    if (-not $raw) {
        throw "Unable to read nanobot startup state."
    }
    return $raw | ConvertFrom-Json
}

function Get-NanobotMcpCatalog {
    param(
        [Parameter(Mandatory = $true)][string]$PythonPath
    )

    $python = @'
import json

from nanobot.config.loader import load_config
from nanobot.cluster.runtime import AssistantCluster

cfg = load_config()
cluster = AssistantCluster(cfg, include_channels=False)
print(json.dumps(cluster.list_mcp_servers(), ensure_ascii=False))
'@

    $raw = $python | & $PythonPath -
    if (-not $raw) {
        return @()
    }
    return @($raw | ConvertFrom-Json)
}

function Ensure-NanobotConfig {
    $state = Get-NanobotStartupState
    if ($state.config_exists) {
        Write-Step "Using config file: $($state.config_path)"
        return $state
    }

    Write-Step "No config file found. Initializing default nanobot config."
    uv run nanobot onboard | Out-Null

    $state = Get-NanobotStartupState
    if (-not $state.config_exists) {
        throw "Config initialization failed. Missing file: $($state.config_path)"
    }
    Write-Step "Created default config: $($state.config_path)"
    return $state
}

function Clear-NanobotWebSessions {
    param(
        [Parameter(Mandatory = $true)][string]$ConfigPath
    )

    Write-Step "Clearing persisted web sessions"

    $python = @'
import json
import sqlite3
from pathlib import Path

from nanobot.config.loader import load_config, set_config_path

config_path = Path(r"__CONFIG_PATH__").expanduser().resolve()
set_config_path(config_path)
config = load_config(config_path)
db_path = Path(config.cluster.data_root).expanduser() / "control_plane.sqlite3"

payload = {"db_path": str(db_path), "cleared": 0, "db_exists": db_path.exists()}
if db_path.exists():
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.execute("DELETE FROM auth_sessions")
        conn.commit()
        payload["cleared"] = int(cursor.rowcount or 0)
    finally:
        conn.close()

print(json.dumps(payload, ensure_ascii=False))
'@

    $script = $python.Replace("__CONFIG_PATH__", $ConfigPath.Replace("\", "\\"))
    $result = $script | uv run python -
    if (-not $result) {
        Write-Warning "Could not confirm web session cleanup."
        return
    }

    $payload = $result | ConvertFrom-Json
    if (-not $payload.db_exists) {
        Write-Host "Control-plane database not found yet. No sessions needed clearing."
        return
    }

    Write-Host "Cleared $($payload.cleared) persisted web session(s)."
}

function Stop-StaleNanobotProcesses {
    Write-Step "Cleaning stale nanobot processes"

    $candidatePorts = @(8711, 8900)
    $pids = New-Object System.Collections.Generic.HashSet[int]

    foreach ($port in $candidatePorts) {
        $listeners = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
        foreach ($listener in $listeners) {
            [void]$pids.Add([int]$listener.OwningProcess)
        }
    }

    $nanobotProcesses = @(Get-CimInstance Win32_Process | Where-Object {
        $_.Name -match '^python(\.exe)?$' -and
        $_.CommandLine -and
        (
            $_.CommandLine -match 'nanobot\.exe' -or
            $_.CommandLine -match '(?:^|\\s)-m\\s+nanobot(?:\\s|$)'
        ) -and
        (
            $_.CommandLine -match '\bcluster serve\b' -or
            $_.CommandLine -match '\bserve\b'
        )
    })

    foreach ($proc in $nanobotProcesses) {
        [void]$pids.Add([int]$proc.ProcessId)
    }

    foreach ($targetPid in $pids) {
        if ($targetPid -eq $PID) {
            continue
        }
        try {
            Stop-Process -Id $targetPid -Force -ErrorAction Stop
        } catch {
            Write-Warning "Failed to stop stale process $targetPid. Continuing."
        }
    }
}

function Wait-PortsReleased {
    param(
        [int[]]$Ports,
        [int]$TimeoutSeconds = 20
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        $busyPorts = @()
        foreach ($port in $Ports) {
            $listeners = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
            if ($listeners.Count -gt 0) {
                $busyPorts += $port
            }
        }
        if ($busyPorts.Count -eq 0) {
            return
        }
        Start-Sleep -Seconds 1
    }

    $remaining = @()
    foreach ($port in $Ports) {
        $listeners = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
        if ($listeners.Count -gt 0) {
            $remaining += $port
        }
    }
    if ($remaining.Count -gt 0) {
        throw "Ports still busy after cleanup: $($remaining -join ', '). Please close the owning process and retry."
    }
}

function Start-MilvusIfAvailable {
    if (-not (Test-CommandExists "docker")) {
        Write-Warning "Docker not found. Skipping Milvus startup."
        return
    }

    if (-not (Test-DockerReady)) {
        Write-Warning "Docker daemon is not ready right now. Skipping Milvus startup."
        return
    }

    try {
        $runningNames = @(docker ps --format "{{.Names}}" 2>$null)
    } catch {
        Write-Warning "Failed to inspect running Docker containers. Skipping Milvus startup."
        return
    }
    if ($runningNames -contains "milvus-standalone") {
        Write-Step "Milvus is already running."
        return
    }

    try {
        $allNames = @(docker ps -a --format "{{.Names}}" 2>$null)
    } catch {
        Write-Warning "Failed to inspect Docker containers. Skipping Milvus startup."
        return
    }
    $knownContainers = @("milvus-etcd", "milvus-minio", "milvus-standalone", "attu")
    $existing = $knownContainers | Where-Object { $allNames -contains $_ }

    if ($existing.Count -gt 0) {
        Write-Step "Found existing Milvus containers. Starting: $($existing -join ', ')"
        docker start $existing | Out-Null
        return
    }

    Write-Warning "No existing Milvus containers were found. Start Milvus manually first if needed."
}

function Get-DockerDesktopExecutable {
    $candidates = @(
        "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
        "$Env:LocalAppData\Programs\Docker\Docker\Docker Desktop.exe"
    ) | Select-Object -Unique

    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path $candidate)) {
            return $candidate
        }
    }
    return $null
}

function Test-DockerReady {
    if (-not (Test-CommandExists "docker")) {
        return $false
    }
    cmd /c "docker version >nul 2>nul"
    return ($LASTEXITCODE -eq 0)
}

function Ensure-DockerReady {
    if (-not (Test-CommandExists "docker")) {
        Write-Warning "Docker CLI not found. Skipping Docker/Milvus startup."
        return
    }

    if (Test-DockerReady) {
        Write-Step "Docker daemon is ready."
        return
    }

    $dockerDesktopExe = Get-DockerDesktopExecutable
    if (-not $dockerDesktopExe) {
        Write-Warning "Docker CLI is present, but Docker Desktop.exe was not found. Cannot auto-start Docker daemon."
        return
    }

    Write-Step "Starting Docker Desktop"
    Start-Process -FilePath $dockerDesktopExe | Out-Null

    $timeoutSeconds = 120
    $deadline = (Get-Date).AddSeconds($timeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-DockerReady) {
            Write-Step "Docker daemon is ready."
            return
        }
        Start-Sleep -Seconds 2
    }

    Write-Warning "Docker Desktop was not ready in time. Milvus auto-start may fail."
}

function Ensure-WslReady {
    if (-not (Test-CommandExists "wsl")) {
        throw "wsl.exe was not found. Cannot ensure WSL2 is ready."
    }

    Write-Step "Checking WSL status"

    $statusOutput = ""
    try {
        $statusOutput = ((wsl --status 2>&1 | Out-String) -replace "`0", "")
    } catch {
        Write-Warning "Failed to read WSL status. Trying to wake a distro directly."
    }

    if ($statusOutput -and $statusOutput -match "Default Version:\s*1") {
        Write-Warning "WSL default version looks like WSL1. Please confirm your distro is using WSL2."
    }

    $listOutput = ""
    try {
        $listOutput = ((wsl -l -v 2>&1 | Out-String) -replace "`0", "")
    } catch {
        Write-Warning "Failed to list WSL distros. Trying the default distro directly."
    }

    Write-Step "Waking default WSL distro"
    cmd /c "wsl -- echo ready >nul 2>nul"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to wake the default WSL distro. Continuing because WSL may already be usable."
    }

    $distros = @()
    foreach ($line in ($listOutput -split "`r?`n")) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed -match "^NAME\s+STATE\s+VERSION$") {
            continue
        }
        $normalized = $trimmed.TrimStart("*").Trim()
        $parts = $normalized -split "\s{2,}"
        if ($parts.Count -ge 3) {
            $distros += [PSCustomObject]@{
                Name = $parts[0].Trim()
                State = $parts[1].Trim()
                Version = $parts[2].Trim()
            }
        }
    }

    $targets = @()
    $defaultLine = ($listOutput -split "`r?`n" | Where-Object { $_.TrimStart().StartsWith("*") } | Select-Object -First 1)
    if ($defaultLine) {
        $defaultName = (($defaultLine.TrimStart() -replace '^\*', '').Trim() -split "\s{2,}")[0]
        if ($defaultName) {
            $targets += $defaultName
        }
    }
    if (($listOutput -match "docker-desktop" -or $distros.Name -contains "docker-desktop") -and -not ($targets -contains "docker-desktop")) {
        $targets += "docker-desktop"
    }

    foreach ($target in $targets) {
        if (-not $target -or $target -eq $defaultName) {
            continue
        }
        Write-Step "Waking WSL distro: $target"
        cmd /c "wsl -d $target -- echo ready >nul 2>nul"
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to start WSL distro $target. Continuing."
        }
    }
}

function Wait-HttpReady {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][string]$PythonPath,
        [int]$TimeoutSeconds = 90
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $script = @"
import sys
import urllib.request

url = sys.argv[1]
try:
    with urllib.request.urlopen(url, timeout=3) as response:
        raise SystemExit(0 if 200 <= response.status < 300 else 1)
except Exception:
    raise SystemExit(1)
"@
            $null = $script | & $PythonPath - $Url
            if ($LASTEXITCODE -eq 0) {
                return $true
            }
        } catch {
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Show-RecentServiceLogs {
    param(
        [Parameter(Mandatory = $true)][string[]]$Paths,
        [int]$TailLines = 40
    )

    foreach ($path in $Paths) {
        if (-not (Test-Path $path)) {
            continue
        }
        Write-Host ""
        Write-Host "--- $(Split-Path -Leaf $path) ---" -ForegroundColor Yellow
        try {
            Get-Content -Path $path -Tail $TailLines
        } catch {
        }
    }
}

if (-not (Test-CommandExists "uv")) {
    throw "uv was not found. Install uv before running start-all.ps1."
}

if ($InstallDeps -or -not (Test-Path (Join-Path $repoRoot ".venv"))) {
    Write-Step "Installing project dependencies"
    uv sync --all-extras
}

$startupState = Ensure-NanobotConfig
$nanobotPython = Get-NanobotPython
Ensure-WslReady
Ensure-DockerReady
Stop-StaleNanobotProcesses
Wait-PortsReleased -Ports @(8711, 8900)
Clear-NanobotWebSessions -ConfigPath $startupState.config_path

if (-not $SkipMilvus) {
    Start-MilvusIfAvailable
}

$clusterArgs = @("-m", "nanobot", "cluster", "serve")
if ($WebOnly) {
    $clusterArgs += "--web-only"
}

Write-Step "Starting cluster service"
$clusterProcess = Start-NanobotProcess -Name "nanobot-cluster" -FilePath $nanobotPython -Arguments $clusterArgs

Write-Step "Waiting for web console"
if (-not (Wait-HttpReady -Url "http://127.0.0.1:8711/api/health" -PythonPath $nanobotPython)) {
    Show-RecentServiceLogs -Paths @($clusterProcess.StdoutPath, $clusterProcess.StderrPath)
    throw "Web console was not ready in time on http://127.0.0.1:8711."
}

$apiStarted = $false
$apiProcess = $null
if ($startupState.api_ready) {
    Write-Step "Starting OpenAI-style API"
    $apiProcess = Start-NanobotProcess -Name "nanobot-api" -FilePath $nanobotPython -Arguments @("-m", "nanobot", "serve")
    $apiStarted = $true
    Write-Step "Waiting for OpenAI-style API"
    if (-not (Wait-HttpReady -Url "http://127.0.0.1:8900/health" -PythonPath $nanobotPython)) {
        Show-RecentServiceLogs -Paths @($apiProcess.StdoutPath, $apiProcess.StderrPath)
        throw "OpenAI-style API was not ready in time on http://127.0.0.1:8900."
    }
} else {
    Write-Warning "No usable model credentials were found. Skipping OpenAI-style API startup."
    Write-Warning "Config file: $($startupState.config_path)"
    Write-Warning "Current model: $($startupState.model)"
}

if (-not $NoBrowser) {
    Start-Process "http://127.0.0.1:8711/"
}

Write-Host ""
Write-Host "Startup launched." -ForegroundColor Green
Write-Host "Web console: http://127.0.0.1:8711"
if ($apiStarted) {
    Write-Host "OpenAI-style API: http://127.0.0.1:8900"
} else {
    Write-Host "OpenAI-style API: skipped (configure a provider API key in $($startupState.config_path) first)"
}
if ($WebOnly) {
    Write-Host "Cluster is running in web-only mode. QQ/WeChat channels were not started."
}
if ($NoBrowser) {
    Write-Host "Browser auto-open was skipped by request."
}
Write-Host "Log directory: $(Get-RunLogDirectory)"

$mcpCatalog = @(Get-NanobotMcpCatalog -PythonPath $nanobotPython)
if ($mcpCatalog.Count -gt 0) {
    Write-Host "Loaded MCP servers:" -ForegroundColor Green
    foreach ($item in $mcpCatalog) {
        $status = if ($item.valid) { "ok" } else { "invalid" }
        $sources = @($item.sources) -join ", "
        $detail = @($item.transport, $item.endpoint, $sources) | Where-Object { $_ } | Join-String -Separator " | "
        Write-Host "  - [$status] $($item.name): $detail"
    }
} else {
    Write-Host "Loaded MCP servers: none"
}

if (-not $NoLogTail) {
    $logSources = @(
        [PSCustomObject]@{ Label = "cluster"; Path = $clusterProcess.StdoutPath },
        [PSCustomObject]@{ Label = "cluster"; Path = $clusterProcess.StderrPath }
    )
    if ($apiProcess) {
        $logSources += @(
            [PSCustomObject]@{ Label = "api"; Path = $apiProcess.StdoutPath },
            [PSCustomObject]@{ Label = "api"; Path = $apiProcess.StderrPath }
        )
    }

    Write-Host ""
    Write-Step "Streaming service logs. Press Ctrl+C to stop viewing; services will keep running."
    Stream-NanobotLogs -Sources $logSources
}
