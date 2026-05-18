"""Lightweight in-process metrics for the cluster web console."""

from __future__ import annotations

from collections import Counter
from threading import Lock


class ClusterMetrics:
    """Collect coarse-grained counters without adding an external dependency."""

    def __init__(self) -> None:
        self._counters: Counter[str] = Counter()
        self._lock = Lock()

    def inc(self, name: str, value: int = 1) -> None:
        with self._lock:
            self._counters[name] += value

    def snapshot(self) -> dict[str, int]:
        with self._lock:
            return dict(self._counters)

    def render_prometheus(self) -> str:
        payload = []
        for name, value in sorted(self.snapshot().items()):
            metric_name = f"nanobot_{name}".replace(".", "_").replace("-", "_")
            payload.append(f"# TYPE {metric_name} counter")
            payload.append(f"{metric_name} {value}")
        return "\n".join(payload) + ("\n" if payload else "")
