"""Configuration and workspace helpers for the assistant cluster."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from nanobot.agent.skills import SkillsLoader
from nanobot.config.loader import save_config
from nanobot.config.schema import AssistantClusterMemberConfig, Config
from nanobot.utils.helpers import ensure_dir

REQUIRED_ASSISTANT_IDS = {
    "image",
    "consult",
    "developer",
    "investment",
    "community",
    "writer",
    "expert",
}


class ClusterConfigService:
    """Manage cluster configuration, workspaces, and persistent channel bindings."""

    def __init__(self, config: Config, config_path: Path | None = None):
        self.config = config
        self.config_path = config_path
        self.cluster_root = ensure_dir(Path(config.cluster.data_root).expanduser())
        self.bindings_path = self.cluster_root / "bindings.json"
        self.versions_path = self.cluster_root / "assistant_versions.json"
        self._bindings = self._load_bindings()

    def _load_bindings(self) -> dict[str, str]:
        if not self.bindings_path.exists():
            return {}
        try:
            return json.loads(self.bindings_path.read_text(encoding="utf-8"))
        except Exception:
            return {}

    def _save_bindings(self) -> None:
        self.bindings_path.write_text(
            json.dumps(self._bindings, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    def _load_versions(self) -> dict[str, list[dict[str, Any]]]:
        if not self.versions_path.exists():
            return {}
        try:
            payload = json.loads(self.versions_path.read_text(encoding="utf-8"))
        except Exception:
            return {}
        return payload if isinstance(payload, dict) else {}

    def _save_versions(self, payload: dict[str, list[dict[str, Any]]]) -> None:
        self.versions_path.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    @staticmethod
    def _meta_key(name: str) -> str:
        return f"__meta__:{name}"

    def _persist_config(self) -> None:
        if self.config_path is not None:
            save_config(self.config, self.config_path)

    def list_assistants(self) -> list[AssistantClusterMemberConfig]:
        return list(self.config.cluster.assistants)

    def required_assistant_ids(self) -> set[str]:
        return set(REQUIRED_ASSISTANT_IDS)

    def get_assistant(self, assistant_id: str) -> AssistantClusterMemberConfig | None:
        return next((a for a in self.config.cluster.assistants if a.id == assistant_id), None)

    def get_enabled_assistants(self) -> list[AssistantClusterMemberConfig]:
        return [assistant for assistant in self.list_assistants() if assistant.enabled]

    def get_default_assistant_id(self) -> str:
        configured = self.config.cluster.default_assistant_id
        if self.get_assistant(configured):
            return configured
        enabled = self.get_enabled_assistants()
        return enabled[0].id if enabled else "consult"

    def assistant_root(self, assistant_id: str) -> Path:
        return ensure_dir(self.cluster_root / "assistants" / assistant_id)

    def assistant_workspace(self, assistant: AssistantClusterMemberConfig) -> Path:
        if assistant.workspace:
            return ensure_dir(Path(assistant.workspace).expanduser())
        return ensure_dir(self.assistant_root(assistant.id) / "workspace")

    def assistant_database(self, assistant_id: str) -> Path:
        return self.assistant_root(assistant_id) / "assistant.sqlite3"

    def ensure_workspace_files(self, assistant: AssistantClusterMemberConfig) -> Path:
        workspace = self.assistant_workspace(assistant)
        tool_list = "\n".join(f"- {tool}" for tool in assistant.tool_names) or "- no tools configured"
        enabled_skills = "\n".join(f"- {skill}" for skill in assistant.enabled_skills) or "- no skills enabled"
        (workspace / "AGENTS.md").write_text(
            (
                f"# {assistant.name}\n\n"
                f"{assistant.persona_prompt.strip()}\n\n"
                f"## 职责\n{assistant.description.strip()}\n"
            ).strip()
            + "\n",
            encoding="utf-8",
        )
        (workspace / "SOUL.md").write_text(
            (
                f"# Assistant Identity\n\n"
                f"- ID: {assistant.id}\n"
                f"- Name: {assistant.name}\n"
                f"- Tone: {assistant.persona_prompt.strip()}\n"
            ),
            encoding="utf-8",
        )
        user_file = workspace / "USER.md"
        if not user_file.exists():
            user_file.write_text(
                "# User Preferences\n\n- 本文件由集群运行时初始化，长期偏好会同步回 SQLite。\n",
                encoding="utf-8",
            )
        (workspace / "TOOLS.md").write_text(
            (
                "# Allowed Tools\n\n"
                f"{tool_list}\n\n"
                "# Enabled Skills\n\n"
                f"{enabled_skills}\n"
            ),
            encoding="utf-8",
        )
        ensure_dir(workspace / "memory")
        ensure_dir(workspace / "generated_images")
        return workspace

    def assistant_to_dict(self, assistant: AssistantClusterMemberConfig) -> dict[str, Any]:
        workspace = self.assistant_workspace(assistant)
        source_files = {
            "config": str(self.config_path) if self.config_path is not None else "",
            "workspace": str(workspace),
            "agent_prompt": str(workspace / "AGENTS.md"),
            "identity": str(workspace / "SOUL.md"),
            "tools": str(workspace / "TOOLS.md"),
            "versions": str(self.versions_path),
        }
        return {
            "id": assistant.id,
            "name": assistant.name,
            "enabled": assistant.enabled,
            "description": assistant.description,
            "persona_prompt": assistant.persona_prompt,
            "provider": assistant.provider,
            "model": assistant.model,
            "image_provider": assistant.image_provider,
            "image_model": assistant.image_model,
            "workspace": str(workspace),
            "source_files": source_files,
            "tool_names": assistant.tool_names,
            "enabled_skills": assistant.enabled_skills,
            "disabled_skills": assistant.disabled_skills,
            "mcp_servers": {
                name: server.model_dump(by_alias=True)
                for name, server in assistant.mcp_servers.items()
            },
            "routing": assistant.routing.model_dump(by_alias=True),
            "max_tokens": assistant.max_tokens,
            "temperature": assistant.temperature,
            "reasoning_effort": assistant.reasoning_effort,
            "max_tool_iterations": assistant.max_tool_iterations,
            "context_window_tokens": assistant.context_window_tokens,
            "max_tool_result_chars": assistant.max_tool_result_chars,
            "provider_retry_mode": assistant.provider_retry_mode,
            "prompt_version": assistant.prompt_version,
            "prompt_updated_at": assistant.prompt_updated_at,
            "prompt_change_note": assistant.prompt_change_note,
            "daily_token_limit": assistant.daily_token_limit,
            "required": assistant.id in REQUIRED_ASSISTANT_IDS,
        }

    def list_assistant_versions(self, assistant_id: str) -> list[dict[str, Any]]:
        payload = self._load_versions()
        return list(payload.get(assistant_id, []))

    def _record_assistant_version(
        self,
        assistant: AssistantClusterMemberConfig,
        *,
        changed_by: str = "system",
    ) -> None:
        payload = self._load_versions()
        history = payload.setdefault(assistant.id, [])
        history.append(
            {
                "assistant_id": assistant.id,
                "version": assistant.prompt_version,
                "changed_at": assistant.prompt_updated_at,
                "changed_by": changed_by,
                "change_note": assistant.prompt_change_note,
                "persona_prompt": assistant.persona_prompt,
                "model": assistant.model,
                "provider": assistant.provider,
                "tool_names": list(assistant.tool_names),
            }
        )
        payload[assistant.id] = history[-20:]
        self._save_versions(payload)

    def upsert_assistant(self, payload: dict[str, Any], *, changed_by: str = "system") -> AssistantClusterMemberConfig:
        now = datetime.now().astimezone().isoformat()
        current = self.get_assistant(str(payload.get("id") or "").strip())
        payload = dict(payload)
        if current is None:
            payload["prompt_version"] = int(payload.get("prompt_version") or 1)
            payload["prompt_updated_at"] = payload.get("prompt_updated_at") or now
        else:
            prompt_changed = str(payload.get("persona_prompt", current.persona_prompt)) != current.persona_prompt
            if prompt_changed and "prompt_version" not in payload:
                payload["prompt_version"] = int(current.prompt_version or 1) + 1
                payload["prompt_updated_at"] = now
            else:
                payload["prompt_version"] = int(payload.get("prompt_version") or current.prompt_version or 1)
                payload["prompt_updated_at"] = payload.get("prompt_updated_at") or current.prompt_updated_at or now
            if "prompt_change_note" not in payload:
                payload["prompt_change_note"] = current.prompt_change_note
        assistant = AssistantClusterMemberConfig.model_validate(payload)
        current = self.get_assistant(assistant.id)
        if current is None:
            self.config.cluster.assistants.append(assistant)
        else:
            idx = next(index for index, item in enumerate(self.config.cluster.assistants) if item.id == assistant.id)
            self.config.cluster.assistants[idx] = assistant
        self.ensure_workspace_files(assistant)
        self._persist_config()
        if current is None or current.prompt_version != assistant.prompt_version or current.persona_prompt != assistant.persona_prompt:
            self._record_assistant_version(assistant, changed_by=changed_by)
        return assistant

    def delete_assistant(self, assistant_id: str) -> None:
        if assistant_id in REQUIRED_ASSISTANT_IDS:
            raise ValueError("固定七个助手不能删除，只能编辑或禁用。")
        self.config.cluster.assistants = [
            assistant
            for assistant in self.config.cluster.assistants
            if assistant.id != assistant_id
        ]
        self._persist_config()

    def set_binding(self, channel: str, chat_id: str, assistant_id: str) -> None:
        self._bindings[f"{channel}:{chat_id}"] = assistant_id
        self._bindings[self._meta_key("last_active_assistant")] = assistant_id
        self._save_bindings()

    def clear_binding(self, channel: str, chat_id: str) -> None:
        self._bindings.pop(f"{channel}:{chat_id}", None)
        self._save_bindings()

    def get_binding(self, channel: str, chat_id: str) -> str | None:
        return self._bindings.get(f"{channel}:{chat_id}")

    def get_last_active_assistant_id(self) -> str | None:
        assistant_id = self._bindings.get(self._meta_key("last_active_assistant"))
        if not isinstance(assistant_id, str) or not assistant_id.strip():
            return None
        if self.get_assistant(assistant_id) is None:
            return None
        return assistant_id

    def available_skills(self, assistant: AssistantClusterMemberConfig | None = None) -> list[dict[str, str]]:
        workspace = self.assistant_workspace(assistant) if assistant else self.cluster_root
        loader = SkillsLoader(workspace)
        return loader.list_skills(filter_unavailable=False)
