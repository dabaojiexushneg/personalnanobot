[CmdletBinding()]
param(
    [switch]$SkipMilvus,
    [switch]$StopDockerDesktop
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

function Clear-NanobotWebSessions {
    Write-Step "Clearing persisted web sessions"

    if (-not (Test-CommandExists "uv")) {
        Write-Warning "uv was not found. Skipping web session cleanup."
        return
    }

    $python = @'
import json
import sqlite3
from pathlib import Path

from nanobot.config.loader import get_config_path, load_config, set_config_path

config_path = get_config_path()
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

    $result = $python | uv run python -
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

function Get-NanobotProcessIds {
    $processIds = New-Object System.Collections.Generic.HashSet[int]
    $servicePorts = @(8711, 8900)

    foreach ($port in $servicePorts) {
        $connections = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
        foreach ($connection in $connections) {
            $owningProcess = [int]$connection.OwningProcess
            if ($owningProcess -le 0) {
                continue
            }
            [void]$processIds.Add($owningProcess)
        }
    }

    $serviceProcesses = @(Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and (
            (
                ($_.Name -match '^python(\.exe)?$' -or $_.Name -match '^nanobot(\.exe)?$') -and
                (
                    $_.CommandLine -match 'nanobot\.exe' -or
                    $_.CommandLine -match '(?:^|\s)-m\s+nanobot(?:\s|$)'
                ) -and
                (
                    $_.CommandLine -match '\bcluster serve\b' -or
                    $_.CommandLine -match '\bserve\b'
                )
            ) -or (
                $_.Name -match '^powershell(\.exe)?$' -and
                (
                    $_.CommandLine -match "WindowTitle = 'nanobot-cluster'" -or
                    $_.CommandLine -match "WindowTitle = 'nanobot-api'"
                )
            )
        )
    })

    foreach ($proc in $serviceProcesses) {
        [void]$processIds.Add([int]$proc.ProcessId)
    }

    return @($processIds)
}

function Stop-NanobotProcesses {
    Write-Step "Stopping nanobot services"
    $processIds = @(Get-NanobotProcessIds)
    $stopped = @()

    if ($processIds.Count -eq 0) {
        Write-Host "No running nanobot cluster/API processes were found."
        return @()
    }

    foreach ($targetPid in $processIds) {
        if ($targetPid -le 0 -or $targetPid -eq $PID) {
            continue
        }
        $existing = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
        if (-not $existing) {
            continue
        }
        $name = $existing.ProcessName
        try {
            Stop-Process -Id $targetPid -Force -ErrorAction Stop
            $stopped += [PSCustomObject]@{
                ProcessId = $targetPid
                Name = $name
            }
        } catch {
            $stillExists = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
            if ($stillExists) {
                Write-Warning "Failed to stop process $targetPid. Continuing."
            }
        }
    }

    return $stopped
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
            $connections = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
            if ($connections.Count -gt 0) {
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
        $connections = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
        if ($connections.Count -gt 0) {
            $remaining += $port
        }
    }
    if ($remaining.Count -gt 0) {
        Write-Warning "Some service ports are still busy: $($remaining -join ', ')"
    }
}

function Test-DockerReady {
    if (-not (Test-CommandExists "docker")) {
        return $false
    }
    cmd /c "docker version >nul 2>nul"
    return ($LASTEXITCODE -eq 0)
}

function Stop-MilvusContainers {
    if (-not (Test-CommandExists "docker")) {
        Write-Warning "Docker CLI not found. Skipping Milvus shutdown."
        return
    }
    if (-not (Test-DockerReady)) {
        Write-Warning "Docker daemon is not ready. Skipping Milvus shutdown."
        return
    }

    $knownContainers = @("attu", "milvus-standalone", "milvus-minio", "milvus-etcd")
    $runningNames = @(docker ps --format "{{.Names}}" 2>$null)
    $targets = $knownContainers | Where-Object { $runningNames -contains $_ }

    if ($targets.Count -eq 0) {
        Write-Host "No running Milvus containers were found."
        return
    }

    Write-Step "Stopping Milvus containers: $($targets -join ', ')"
    docker stop $targets | Out-Null
}

function Get-DockerDesktopProcesses {
    return @(Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and (
            $_.Name -match '^Docker Desktop\.exe$' -or
            $_.ExecutablePath -match 'Docker Desktop\.exe$'
        )
    })
}

function Stop-DockerDesktopProcesses {
    Write-Step "Stopping Docker Desktop"
    $processes = @(Get-DockerDesktopProcesses)
    if ($processes.Count -eq 0) {
        Write-Host "Docker Desktop is not running."
        return
    }

    foreach ($proc in $processes) {
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
        } catch {
            Write-Warning "Failed to stop Docker Desktop process $($proc.ProcessId). Continuing."
        }
    }
}

$stoppedProcesses = @(Stop-NanobotProcesses)
Wait-PortsReleased -Ports @(8711, 8900)
Clear-NanobotWebSessions

if (-not $SkipMilvus) {
    Stop-MilvusContainers
}

if ($StopDockerDesktop) {
    Stop-DockerDesktopProcesses
}

Write-Host ""
Write-Host "Shutdown complete." -ForegroundColor Green
if ($stoppedProcesses.Count -gt 0) {
    Write-Host "Stopped processes:" -ForegroundColor Green
    foreach ($proc in $stoppedProcesses) {
        Write-Host "  - PID $($proc.ProcessId): $($proc.Name)"
    }
} else {
    Write-Host "Stopped processes: none"
}
Write-Host "Web console: stopped"
Write-Host "OpenAI-style API: stopped"
if ($SkipMilvus) {
    Write-Host "Milvus: left running by request"
} else {
    Write-Host "Milvus: stopped if matching containers were running"
}
if ($StopDockerDesktop) {
    Write-Host "Docker Desktop: stopped by request"
}
