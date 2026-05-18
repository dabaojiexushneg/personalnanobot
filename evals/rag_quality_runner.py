from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib import request
from http.cookiejar import CookieJar


def load_cases(path: Path) -> list[dict[str, Any]]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def login(base_url: str, username: str, password: str) -> request.OpenerDirector:
    cookie_jar = CookieJar()
    opener = request.build_opener(request.HTTPCookieProcessor(cookie_jar))
    payload = {"username": username, "password": password}
    req = request.Request(
        f"{base_url.rstrip('/')}/api/auth/login",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    opener.open(req, timeout=30).read()  # noqa: S310
    for cookie in cookie_jar:
        cookie.secure = False
    return opener


def call_search_api(
    base_url: str,
    case: dict[str, Any],
    *,
    limit: int,
    opener: request.OpenerDirector | None = None,
) -> list[dict[str, Any]]:
    payload = {
        "query": case["query"],
        "assistant_id": case.get("assistant_id"),
        "limit": limit,
    }
    req = request.Request(
        f"{base_url.rstrip('/')}/api/knowledge/search",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    http_open = opener.open if opener else request.urlopen
    with http_open(req, timeout=60) as response:  # noqa: S310
        data = json.loads(response.read().decode("utf-8"))
    return list(data.get("items") or [])


def evaluate_case(case: dict[str, Any], items: list[dict[str, Any]]) -> tuple[bool, list[str]]:
    failures: list[str] = []
    if not items:
        return False, ["no retrieval result"]

    top = items[0]
    joined = "\n".join(
        [
            str(top.get("title") or ""),
            str(top.get("filename") or ""),
            str(top.get("content") or ""),
            "\n".join(map(str, top.get("evidence_sentences") or [])),
            json.dumps(top.get("citation") or {}, ensure_ascii=False),
        ]
    )
    for token in case.get("expect_contains", []):
        if token not in joined:
            failures.append(f"missing token in top result: {token}")
    title_expect = str(case.get("expect_title_contains") or "")
    if title_expect and title_expect not in str(top.get("title") or ""):
        failures.append(f"title mismatch: expected contains {title_expect}")
    if len(top.get("evidence_sentences") or []) < int(case.get("min_evidence") or 0):
        failures.append("evidence sentence missing")
    if not top.get("citation"):
        failures.append("citation missing")
    if top.get("rerank_score") is None:
        failures.append("rerank_score missing")
    return not failures, failures


def write_report(path: Path, report: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Evaluate Nanobot RAG retrieval quality and evidence fields.")
    parser.add_argument("--dataset", default="evals/datasets/rag_quality_eval_cases.jsonl")
    parser.add_argument("--base-url", default="http://127.0.0.1:8711")
    parser.add_argument("--limit", type=int, default=4)
    parser.add_argument("--json-out", default="evals/reports/rag_quality_report.json")
    parser.add_argument("--username", default=os.environ.get("NANOBOT_EVAL_USERNAME", ""))
    parser.add_argument("--password", default=os.environ.get("NANOBOT_EVAL_PASSWORD", ""))
    args = parser.parse_args()

    dataset_path = Path(args.dataset).resolve()
    cases = load_cases(dataset_path)
    results: list[dict[str, Any]] = []
    passed = 0
    opener = login(args.base_url, args.username, args.password) if args.username and args.password else None

    for case in cases:
        try:
            items = call_search_api(args.base_url, case, limit=args.limit, opener=opener)
            ok, failures = evaluate_case(case, items)
        except Exception as exc:  # noqa: BLE001
            items = []
            ok = False
            failures = [str(exc)]
        if ok:
            passed += 1
        top = items[0] if items else {}
        print(f"[{'PASS' if ok else 'FAIL'}] {case['id']} -> {top.get('title', '-')}")
        if failures:
            print(f"  failures: {'; '.join(failures)}")
        results.append(
            {
                "id": case["id"],
                "ok": ok,
                "failures": failures,
                "top_title": top.get("title", ""),
                "top_chunk_id": top.get("chunk_id", ""),
                "score": top.get("score", 0),
                "rerank_score": top.get("rerank_score", 0),
                "evidence_sentences": top.get("evidence_sentences", []),
                "citation": top.get("citation", {}),
            }
        )

    total = len(cases)
    report = {
        "suite": "rag_quality",
        "generated_at": datetime.now().astimezone().isoformat(),
        "dataset": str(dataset_path),
        "passed": passed,
        "total": total,
        "pass_rate": (passed / total * 100) if total else 0.0,
        "cases": results,
    }
    write_report(Path(args.json_out).resolve(), report)
    print(f"\nSummary: {passed}/{total} passed ({report['pass_rate']:.1f}%)")
    print(f"Report: {Path(args.json_out).resolve()}")
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
