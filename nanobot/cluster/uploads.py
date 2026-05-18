"""Upload validation and extraction helpers for the cluster web console."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import io
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET
import zipfile

from fastapi import HTTPException, UploadFile

from nanobot.config.schema import ClusterWebConfig


@dataclass(frozen=True)
class BufferedUpload:
    name: str
    path: Path
    content_type: str
    size_bytes: int
    raw: bytes


def _normalize_exts(values: list[str]) -> set[str]:
    return {
        item.lower() if item.startswith(".") else f".{item.lower()}"
        for item in values
        if str(item).strip()
    }

#   校验上传扩展名，普通附件支持 *。
def _validate_extension(filename: str, allowed_extensions: set[str]) -> None:
    # 普通附件支持 "*"，表示把文件当二进制附件保存；知识库上传仍使用独立白名单。
    if not allowed_extensions or "*" in allowed_extensions or ".*" in allowed_extensions:
        return
    suffix = Path(filename).suffix.lower()
    if suffix not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型: {suffix or '无扩展名'}",
        )


def _byte_limit_mb(value: int) -> int:
    return max(int(value), 1) * 1024 * 1024

#   保存 Web 上传文件到受控目录。
async def persist_uploads(
    files: list[UploadFile],
    *,
    save_root: Path,
    web_config: ClusterWebConfig,
    allowed_extensions: list[str],
) -> list[BufferedUpload]:
    """Persist uploaded files in chunks while enforcing size and extension limits."""

    save_root.mkdir(parents=True, exist_ok=True)
    chunk_size = max(int(web_config.upload_chunk_size_kb), 32) * 1024
    max_file_bytes = _byte_limit_mb(web_config.upload_max_file_mb)
    max_total_bytes = _byte_limit_mb(web_config.upload_max_total_mb)
    allowed = _normalize_exts(allowed_extensions)

    buffered: list[BufferedUpload] = []
    total_bytes = 0

    try:
        for upload in files:
            safe_name = Path(upload.filename or "upload.bin").name
            _validate_extension(safe_name, allowed)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            target = save_root / f"{timestamp}_{safe_name}"
            content = bytearray()
            size_bytes = 0
            with target.open("wb") as handle:
                # 按 chunk 落盘，避免大附件一次性读入内存；同时累计单文件和总大小。
                while True:
                    chunk = await upload.read(chunk_size)
                    if not chunk:
                        break
                    size_bytes += len(chunk)
                    total_bytes += len(chunk)
                    if size_bytes > max_file_bytes:
                        target.unlink(missing_ok=True)
                        raise HTTPException(
                            status_code=413,
                            detail=f"文件 {safe_name} 超过单文件大小限制 {web_config.upload_max_file_mb} MB",
                        )
                    if total_bytes > max_total_bytes:
                        target.unlink(missing_ok=True)
                        raise HTTPException(
                            status_code=413,
                            detail=f"本次上传超过总大小限制 {web_config.upload_max_total_mb} MB",
                        )
                    handle.write(chunk)
                    content.extend(chunk)
            await upload.close()
            buffered.append(
                BufferedUpload(
                    name=safe_name,
                    path=target,
                    content_type=upload.content_type or "application/octet-stream",
                    size_bytes=size_bytes,
                    raw=bytes(content),
                )
            )
    except Exception:
        for item in buffered:
            item.path.unlink(missing_ok=True)
        raise

    return buffered

#   从知识库文件中抽取文本。
def extract_text_from_bytes(filename: str, raw: bytes) -> str:
    """Extract text from a supported knowledge-base file."""

    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf":
        try:
            import fitz  # pymupdf
        except ImportError as exc:  # pragma: no cover
            raise ValueError("PDF 解析需要安装 pymupdf") from exc
        doc = fitz.open(stream=raw, filetype="pdf") # 直接从字节流打开文件，不需要写入磁盘
        try:
            return "\n\n".join(page.get_text().strip() for page in doc if page.get_text().strip()).strip()
        finally:
            doc.close()
    #   DOCX 文件不是二进制文件，而是一个ZIP 压缩包，里面包含了多个 XML 文件，其中 word/document.xml 存储了文档的所有文本内容。
    if suffix == ".docx":
        try:
            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                document_xml = archive.read("word/document.xml")
        except Exception as exc:
            raise ValueError("DOCX 文档解析失败，请确认文件未损坏") from exc

        root = ET.fromstring(document_xml)
        ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        paragraphs: list[str] = []
        for paragraph in root.findall(".//w:p", ns):
            texts = [node.text or "" for node in paragraph.findall(".//w:t", ns)]
            line = "".join(texts).strip()
            if line:
                paragraphs.append(line)
        return "\n\n".join(paragraphs).strip()
    #   采用编码探测降级策略，依次尝试三种最常见的中文文本编码
    for encoding in ("utf-8", "utf-8-sig", "gb18030"):
        try:
            return raw.decode(encoding).strip()
        except UnicodeDecodeError:
            continue
    raise ValueError("暂不支持该文档编码，请上传 UTF-8 / GB18030 文本或 PDF")

#   限制知识文档最大文本长度。
def enforce_knowledge_text_limit(text: str, web_config: ClusterWebConfig) -> None:
    if len(text) > web_config.max_knowledge_chars:
        raise HTTPException(
            status_code=413,
            detail=f"知识文档提取文本超过限制 {web_config.max_knowledge_chars} 字符",
        )
