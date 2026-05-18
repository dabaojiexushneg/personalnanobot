"""Helpers for cluster-oriented CLI commands."""

from __future__ import annotations

import asyncio
import os
from pathlib import Path


def run_cluster_serve(*, loaded, config_path: Path, with_channels: bool) -> None:
    import uvicorn

    from nanobot.cluster import AssistantCluster, create_cluster_app

    cluster = AssistantCluster(
        loaded,
        config_path=config_path,
        include_channels=with_channels,
    )
    uvicorn.run(
        create_cluster_app(cluster),
        host=loaded.cluster.web.host,
        port=loaded.cluster.web.port,
    )


def run_cluster_only(*, loaded, config_path: Path, include_channels: bool = True) -> None:
    from nanobot.cluster import AssistantCluster

    cluster = AssistantCluster(
        loaded,
        config_path=config_path,
        include_channels=include_channels,
    )

    async def _run() -> None:
        await cluster.start()
        try:
            while True:
                await asyncio.sleep(3600)
        finally:
            await cluster.stop()

    asyncio.run(_run())


def run_cluster_worker(
    *,
    loaded,
    config_path: Path,
    poll_interval: int,
    lease_seconds: int,
    with_channels: bool,
) -> None:
    from nanobot.cluster import AssistantCluster

    cluster = AssistantCluster(
        loaded,
        config_path=config_path,
        include_channels=with_channels,
    )

    async def _run() -> None:
        await cluster.start()
        try:
            while True:
                await cluster.run_due_tasks(
                    worker_id=f"worker:{os.getpid()}",
                    lease_seconds=lease_seconds,
                )
                await asyncio.sleep(poll_interval)
        finally:
            await cluster.stop()

    asyncio.run(_run())
