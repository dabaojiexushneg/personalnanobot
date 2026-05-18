from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib import error, request


def load_cases(dataset_path: Path) -> list[dict[str, Any]]:
    cases: list[dict[str, Any]] = []
    for line in dataset_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        cases.append(json.loads(line))
    return cases


def call_chat_api(base_url: str, case: dict[str, Any], session_prefix: str) -> dict[str, Any]:
    payload = {
        "assistant_id": case.get("assistant_id"),
        "content": case["input"],
        "session_id": f"{session_prefix}:{case['id']}",
        "channel": "web",
        "chat_id": "eval-runner",
        "uploaded_paths": [],
        "sync_enabled": False,
        "sync_channel": "",
    }
    req = request.Request(
        f"{base_url.rstrip('/')}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=120) as resp:  # noqa: S310
        return json.loads(resp.read().decode("utf-8"))


def evaluate_case(response_text: str, case: dict[str, Any]) -> tuple[bool, list[str]]:
    failures: list[str] = []
    normalized = response_text or ""
    for token in case.get("expect_contains", []):
        if token not in normalized:
            failures.append(f"missing: {token}")
    for token in case.get("forbid_contains", []):
        if token and token in normalized:
            failures.append(f"forbidden: {token}")
    return not failures, failures


def write_json_report(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_markdown_report(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Eval Report",
        "",
        f"- Suite: `{payload.get('suite', 'evals')}`",
        f"- Generated At: `{payload.get('generated_at', '-')}`",
        f"- Dataset: `{payload.get('dataset', '-')}`",
        f"- Result: `{payload.get('passed', 0)} / {payload.get('total', 0)} passed ({payload.get('pass_rate', 0.0):.1f}%)`",
        "",
        "## Cases",
        "",
    ]
    for item in payload.get("cases", []):
        status = "PASS" if item.get("ok") else "FAIL"
        lines.append(f"- `{item.get('id', '-')}`: {status}")
        preview = str(item.get("preview") or "").strip()
        if preview:
            lines.append(f"  preview: {preview}")
        failures = item.get("failures") or []
        if failures:
            lines.append(f"  failures: {'; '.join(map(str, failures))}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run basic Nanobot eval cases against the web chat API.")
    parser.add_argument("--dataset", default="evals/datasets/basic_eval_cases.jsonl")
    parser.add_argument("--base-url", default="http://127.0.0.1:8711")
    parser.add_argument("--session-prefix", default="eval")
    parser.add_argument("--suite", default="basic_eval_cases")
    parser.add_argument("--json-out", default="")
    parser.add_argument("--md-out", default="")
    args = parser.parse_args()

    dataset_path = Path(args.dataset).expanduser().resolve()
    cases = load_cases(dataset_path)
    passed = 0
    case_results: list[dict[str, Any]] = []

    for case in cases:
        try:
            response = call_chat_api(args.base_url, case, args.session_prefix)
            content = str(response.get("content") or "")
            ok, failures = evaluate_case(content, case)
        except error.HTTPError as exc:
            ok = False
            failures = [f"http {exc.code}"]
            content = exc.read().decode("utf-8", errors="ignore")
        except Exception as exc:  # noqa: BLE001
            ok = False
            failures = [str(exc)]
            content = ""

        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {case['id']}")
        if failures:
            print(f"  failures: {'; '.join(failures)}")
        if content:
            preview = content.strip().replace("\n", " ")
            print(f"  preview: {preview[:160]}")
        else:
            preview = ""
        if ok:
            passed += 1
        case_results.append(
            {
                "id": case["id"],
                "assistant_id": case.get("assistant_id"),
                "ok": ok,
                "failures": failures,
                "preview": preview[:160],
            }
        )

    total = len(cases)
    rate = (passed / total * 100) if total else 0.0
    print(f"\nSummary: {passed}/{total} passed ({rate:.1f}%)")
    report = {
        "suite": args.suite,
        "generated_at": datetime.now().astimezone().isoformat(),
        "dataset": str(dataset_path),
        "base_url": args.base_url,
        "passed": passed,
        "total": total,
        "pass_rate": rate,
        "cases": case_results,
    }
    if args.json_out:
        write_json_report(Path(args.json_out).expanduser().resolve(), report)
    if args.md_out:
        write_markdown_report(Path(args.md_out).expanduser().resolve(), report)
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
