"""Helpers for optional RAG backends and retrieval components."""

from __future__ import annotations

import hashlib
import json
import math
import os
import threading
from dataclasses import dataclass
from importlib.util import find_spec
from typing import Any

from nanobot.config.schema import ClusterRagConfig

_TOKEN_RE = __import__("re").compile(r"[A-Za-z0-9_]+|[\u4e00-\u9fff]{1,}")
_NUMBER_RE = __import__("re").compile(r"\d+(?:\.\d+)?")
_ANSWER_HINT_RE = __import__("re").compile(
    r"(每月|每年|每季度|扣费|续费|超过|低于|高于|提醒|优先|需要|应该|如果|日期|时间|费用|金额|元|天|日)"
)
_QUESTION_BANK_RE = __import__("re").compile(
    r"(可用于演示的问题|演示预期|可以在\s*RAG\s*检索框|可以在.*主聊天框中提问|以下问题|示例问题)"
)
_RRF_K = 60.0
_DEFAULT_MODEL = "all-MiniLM-L6-v2"
_VECTOR_LIMIT_MULTIPLIER = 4
_COLLECTION_LIMIT = 10_000
_KEYWORDS_MAX_BYTES = 7_900
_VECTOR_DIMENSIONS = {
    "all-MiniLM-L6-v2": 384,
}
_LOCAL_HASH_EMBEDDING = "local-hash-embedding"
_QUERY_STOPWORDS = {
    "告诉我",
    "根据",
    "知识库",
    "一下",
    "这个",
    "那个",
    "什么",
    "多少",
    "怎么",
    "如何",
    "请问",
}
_QUERY_EXPANSIONS = {
    "宽带": ["网络", "网费", "费用", "扣费", "续费", "提醒"],
    "网费": ["宽带", "网络", "账单", "费用", "扣费", "提醒"],
    "会员": ["订阅", "续费", "扣费", "到期", "提醒"],
    "账单": ["费用", "金额", "扣费", "付款", "缴费"],
    "提醒": ["提前", "日期", "时间", "日程", "通知"],
    "素材": ["文案", "图片", "视频", "发布", "账号"],
    "账号": ["平台", "渠道", "用户", "发布"],
}


@dataclass(frozen=True)
class RagLibraryInfo:
    """Metadata for an optional RAG component."""

    name: str
    import_name: str
    purpose: str
    install_group: str = "rag"

    @property
    def available(self) -> bool:
        return find_spec(self.import_name) is not None


def get_rag_library_catalog() -> list[RagLibraryInfo]:
    """Return the optional RAG stack supported by this project."""

    return [
        RagLibraryInfo(
            name="Milvus",
            import_name="pymilvus",
            purpose="向量与知识元数据统一存储，负责 RAG 文档、chunk 与向量检索。",
        ),
        RagLibraryInfo(
            name="sentence-transformers",
            import_name="sentence_transformers",
            purpose="文本向量化与语义召回基础能力。",
        ),
        RagLibraryInfo(
            name="rank-bm25",
            import_name="rank_bm25",
            purpose="关键词稀疏检索，可与向量检索组合成 Hybrid RAG。",
        ),
    ]


def get_available_rag_libraries() -> list[dict[str, str | bool]]:
    """Return JSON-friendly RAG library availability information."""

    items: list[dict[str, str | bool]] = []
    for item in get_rag_library_catalog():
        items.append(
            {
                "name": item.name,
                "importName": item.import_name,
                "purpose": item.purpose,
                "installGroup": item.install_group,
                "available": item.available,
            }
        )
    return items


def tokenize_rag_text(text: str) -> list[str]:
    """Tokenize mixed Chinese / ASCII text for sparse retrieval."""

    seen: list[str] = []
    for token in _TOKEN_RE.findall((text or "").lower()):
        normalized = token.strip()
        if not normalized:
            continue
        if normalized not in seen:
            seen.append(normalized)
        if normalized.isascii():
            continue
        if all("\u4e00" <= char <= "\u9fff" for char in normalized):
            for size in (2, 3):
                if len(normalized) < size:
                    continue
                for index in range(0, len(normalized) - size + 1):
                    piece = normalized[index:index + size]
                    if piece not in seen:
                        seen.append(piece)
    return seen


def _build_keywords(text: str, *, max_bytes: int = _KEYWORDS_MAX_BYTES) -> str:
    """Build a Milvus-safe sparse keyword string for BM25/fallback recall."""

    selected: list[str] = []
    total = 0
    for token in tokenize_rag_text(text):
        token_bytes = len(token.encode("utf-8"))
        separator = 1 if selected else 0
        if total + separator + token_bytes > max_bytes:
            break
        selected.append(token)
        total += separator + token_bytes
    return " ".join(selected)

#   执行 query 改写，把用户口语化问题扩展成更适合检索的关键词。例如“网费”扩展为“宽带、网络、账单、费用、扣费、提醒”。
def build_rag_query_plan(query: str) -> dict[str, Any]:
    """Rewrite a user query into lexical terms and a compact semantic query."""

    original = (query or "").strip()
    raw_tokens = tokenize_rag_text(original)
    core_terms: list[str] = []
    for token in raw_tokens:
        if len(token) < 2 or token in _QUERY_STOPWORDS:
            continue
        if token not in core_terms:
            core_terms.append(token)
    #   同义词扩展
    expanded_terms = list(core_terms)
    rewrite_terms: list[str] = []
    lowered = original.lower()
    for key, values in _QUERY_EXPANSIONS.items():
        if key not in lowered and key not in core_terms:
            continue
        for value in values:
            if value not in expanded_terms:
                expanded_terms.append(value)
            if value not in core_terms and value not in rewrite_terms and value not in lowered:
                rewrite_terms.append(value)
    #    生成双版本查询
    rewritten_query = " ".join([original, *rewrite_terms]).strip()
    semantic_query = "；".join([original, " ".join(expanded_terms[:16])]).strip("；")
    return {
        "original_query": original,
        "rewritten_query": rewritten_query or original,
        "semantic_query": semantic_query or original,
        "core_terms": core_terms,
        "expanded_terms": expanded_terms,
        "rewrite_terms": rewrite_terms,
    }


def _split_evidence_sentences(content: str) -> list[str]:
    return [
        item.replace("\u3000", " ").strip(" -\t")
        for item in __import__("re").split(r"(?<=[。！？!?；;])\s*|\n+|(?:^|\n)\s*[-*]\s+", content or "")
        if item.replace("\u3000", " ").strip(" -\t")
    ]


def _rank_evidence_sentences(query_plan: dict[str, Any], content: str) -> list[dict[str, Any]]:
    terms = [str(term).lower() for term in query_plan.get("expanded_terms", []) if len(str(term)) >= 2]
    core_terms = [str(term).lower() for term in query_plan.get("core_terms", []) if len(str(term)) >= 2]
    sentences = _split_evidence_sentences(content)
    ranked: list[dict[str, Any]] = []
    for index, sentence in enumerate(sentences):
        lowered = sentence.lower()
        matched_core = [term for term in core_terms if term in lowered]
        matched_terms = [term for term in terms if term in lowered]
        if not matched_terms:
            continue
        score = len(matched_core) * 4.0 + len(matched_terms) * 1.4
        if _NUMBER_RE.search(sentence) and any(term in lowered for term in ("费用", "金额", "扣费", "续费", "超过", "提醒", "每月", "每年")):
            score += 3.0
        if _ANSWER_HINT_RE.search(sentence):
            score += 1.0
        score += max(0.0, 1.5 - index * 0.05)
        ranked.append(
            {
                "sentence": sentence,
                "index": index,
                "score": score,
                "matched_terms": matched_terms,
            }
        )
    ranked.sort(key=lambda item: (item["score"], -item["index"]), reverse=True)
    return ranked

#   从命中的 chunk 中抽取最相关证据句，生成高亮词、引用来源和 chunk 编号。
def build_rag_evidence(query_plan: dict[str, Any], content: str, *, limit: int = 3) -> dict[str, Any]:
    """Select concise answer evidence instead of returning a full chunk dump."""

    sentences = _split_evidence_sentences(content)
    ranked = _rank_evidence_sentences(query_plan, content)
    selected = sorted(ranked[:limit], key=lambda item: item["index"])
    evidence_sentences = [item["sentence"] for item in selected]
    if not evidence_sentences:
        evidence_sentences = sentences[:limit] or [(content or "")[:240]]
    matched_terms: list[str] = []
    for item in selected:
        for term in item["matched_terms"]:
            if term not in matched_terms:
                matched_terms.append(term)
    return {
        "evidence_sentences": evidence_sentences,
        "matched_terms": matched_terms[:12],
        "evidence_score": float(sum(item["score"] for item in selected)),
        "context_excerpt": " ".join(evidence_sentences)[:600],
    }

#   对 BM25 和向量召回结果做二次排序，优先选择包含日期、金额、规则和动作建议的答案片段。
def _rerank_score(query_plan: dict[str, Any], row: dict[str, Any]) -> float:
    """Lightweight local reranker used after BM25 + vector recall."""

    content = str(row.get("content") or "")
    title = str(row.get("title") or "")
    text = f"{title}\n{content}".lower()
    core_terms = [term for term in query_plan.get("core_terms", []) if len(str(term)) >= 2]
    expanded_terms = [term for term in query_plan.get("expanded_terms", []) if len(str(term)) >= 2]
    if not core_terms and not expanded_terms:
        return 0.0

    matched_core = [term for term in core_terms if str(term).lower() in text]
    matched_expanded = [term for term in expanded_terms if str(term).lower() in text]
    coverage = len(set(matched_core)) / max(len(set(core_terms)), 1)
    score = coverage * 0.12 + min(len(set(matched_expanded)), 8) * 0.008

    original = str(query_plan.get("original_query") or "").lower()
    if original and original in content.lower():
        score += 0.04
    if any(str(term).lower() in title.lower() for term in core_terms):
        score += 0.025
    if _NUMBER_RE.search(content) and any(term in original for term in ("多少", "多少钱", "费用", "金额", "扣费", "续费", "超过")):
        score += 0.035
    if _QUESTION_BANK_RE.search(content):
        score -= 0.14
    return score


def build_chunk_id(document_id: str, chunk_index: int) -> str:
    return f"{document_id}:{chunk_index}"


def _answerability_score(query: str, content: str) -> float:
    """Estimate whether a chunk contains facts that can answer the query."""
    query_text = (query or "").strip()
    content_text = (content or "").strip()
    if not query_text or not content_text:
        return 0.0

    query_tokens = set(tokenize_rag_text(query_text))
    content_tokens = set(tokenize_rag_text(content_text))
    overlap = len(query_tokens & content_tokens) / max(len(query_tokens), 1)

    score = min(overlap, 1.0) * 0.01
    if _ANSWER_HINT_RE.search(content_text):
        score += 0.008
    if _NUMBER_RE.search(content_text) and any(term in query_text for term in ("哪天", "几号", "多少", "多少钱", "超过", "费用", "金额", "扣费", "续费")):
        score += 0.014
    if "：" in content_text or ":" in content_text:
        score += 0.003
    if _QUESTION_BANK_RE.search(content_text):
        score -= 0.02
    return score

#   Milvus 知识库核心类。
class MilvusKnowledgeStore:
    """Milvus-backed hybrid knowledge store for RAG."""

    def __init__(
        self,
        rag_config: ClusterRagConfig | None = None,
        *,
        client: Any | None = None,
        embedding_model: str | None = None,
    ):
        self.config = rag_config or ClusterRagConfig()
        self.collection_name = self.config.collection_name
        self.embedding_model = embedding_model or self.config.embedding_model or _DEFAULT_MODEL
        self._client = client
        self._embedder = None
        self._embedding_backend = ""
        self._embedding_error = ""
        self._collection_ready = client is not None
        self._lock = threading.RLock()
        self._bm25_available = find_spec("rank_bm25") is not None

    @property
    def available(self) -> bool:
        return (
            self._client is not None
            or find_spec("pymilvus") is not None
        )

    @property
    def bm25_available(self) -> bool:
        return self._bm25_available

    def _require_dependencies(self) -> None:
        missing: list[str] = []
        if self._client is None and find_spec("pymilvus") is None:
            missing.append("pymilvus")
        if missing:
            raise RuntimeError(f"Milvus RAG 依赖缺失: {', '.join(missing)}")

#   创建或复用 MilvusClient。
    def _get_client(self):
        self._require_dependencies()
        with self._lock:
            if self._client is not None:
                return self._client
            from pymilvus import MilvusClient

            kwargs: dict[str, Any] = {"uri": self.config.uri}
            if self.config.token:
                kwargs["token"] = self.config.token
            self._client = MilvusClient(**kwargs)
            return self._client

    def _vector_dimension(self) -> int:
        return _VECTOR_DIMENSIONS.get(self.embedding_model, 384)

    def _get_embedder(self):
        if find_spec("sentence_transformers") is None:
            self._embedding_backend = _LOCAL_HASH_EMBEDDING
            self._embedding_error = "sentence-transformers 未安装，已使用本地 hash embedding。"
            return None
        with self._lock:
            if self._embedder is not None:
                return self._embedder
            from sentence_transformers import SentenceTransformer

            try:
                if os.environ.get("NANOBOT_RAG_ALLOW_MODEL_DOWNLOAD", "").strip().lower() in {"1", "true", "yes"}:
                    self._embedder = SentenceTransformer(self.embedding_model)
                else:
                    self._embedder = SentenceTransformer(self.embedding_model, local_files_only=True)
                self._embedding_backend = "sentence-transformers"
                self._embedding_error = ""
                return self._embedder
            except Exception as exc:
                self._embedding_backend = _LOCAL_HASH_EMBEDDING
                self._embedding_error = (
                    f"无法加载本地 embedding 模型 {self.embedding_model}，"
                    f"已降级为本地 hash embedding: {exc}"
                )
                return None

    def _hash_encode_one(self, text: str) -> list[float]:
        dimension = self._vector_dimension()
        vector = [0.0] * dimension
        tokens = tokenize_rag_text(text)
        if not tokens:
            tokens = [text.strip() or "empty"]
        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            first = int.from_bytes(digest[:8], "big")
            second = int.from_bytes(digest[8:16], "big")
            vector[first % dimension] += 1.0 if second % 2 == 0 else -1.0
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]

    def _hash_encode(self, texts: list[str]) -> list[list[float]]:
        return [self._hash_encode_one(text) for text in texts]

#   使用 embedding 模型把文本转向量。
    def _encode(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        embedder = self._get_embedder()
        #   自动降级为哈希编码,保证系统基本可用,至少能进行关键词级别的检索，而不是完全无法使用
        if embedder is None:
            return self._hash_encode(texts)
        vectors = embedder.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        return vectors.tolist()

    def _ensure_collection(self) -> None:
        client = self._get_client()
        with self._lock:
            if self._collection_ready:
                return
            if client.has_collection(collection_name=self.collection_name):
                if hasattr(client, "load_collection"):
                    client.load_collection(collection_name=self.collection_name)
                self._collection_ready = True
                return

            from pymilvus import DataType

            schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
            schema.add_field(field_name="chunk_id", datatype=DataType.VARCHAR, is_primary=True, max_length=256)
            schema.add_field(field_name="document_id", datatype=DataType.VARCHAR, max_length=128)
            schema.add_field(field_name="chunk_index", datatype=DataType.INT64)
            schema.add_field(field_name="is_document", datatype=DataType.INT8)
            schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=1024)
            schema.add_field(field_name="filename", datatype=DataType.VARCHAR, max_length=4096)
            schema.add_field(field_name="content_type", datatype=DataType.VARCHAR, max_length=255)
            schema.add_field(field_name="assistant_scope", datatype=DataType.JSON)
            schema.add_field(field_name="content", datatype=DataType.VARCHAR, max_length=16384)
            schema.add_field(field_name="keywords", datatype=DataType.VARCHAR, max_length=8192)
            schema.add_field(field_name="created_by", datatype=DataType.VARCHAR, max_length=255)
            schema.add_field(field_name="created_at", datatype=DataType.VARCHAR, max_length=64)
            schema.add_field(field_name="updated_at", datatype=DataType.VARCHAR, max_length=64)
            schema.add_field(field_name="chunk_count", datatype=DataType.INT64)
            schema.add_field(field_name="content_hash", datatype=DataType.VARCHAR, max_length=128)
            schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=self._vector_dimension())

            index_params = client.prepare_index_params()
            index_params.add_index(
                field_name="vector",
                index_type="AUTOINDEX",
                metric_type="COSINE",
            )

            client.create_collection(
                collection_name=self.collection_name,
                schema=schema,
                index_params=index_params,
            )
            if hasattr(client, "load_collection"):
                client.load_collection(collection_name=self.collection_name)
            self._collection_ready = True

    @staticmethod
    def _escape_filter_value(value: str) -> str:
        return json.dumps(value, ensure_ascii=False)

    @staticmethod
    def _normalize_scope(value: Any) -> list[str]:
        if isinstance(value, list):
            return [str(item) for item in value if str(item).strip()]
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            try:
                payload = json.loads(stripped)
            except json.JSONDecodeError:
                return [item.strip() for item in stripped.split(",") if item.strip()]
            if isinstance(payload, list):
                return [str(item) for item in payload if str(item).strip()]
        return []

    def _query_rows(
        self,
        *,
        filter_expr: str,
        output_fields: list[str],
        limit: int = _COLLECTION_LIMIT,
    ) -> list[dict[str, Any]]:
        self._ensure_collection()
        rows = self._get_client().query(
            collection_name=self.collection_name,
            filter=filter_expr,
            output_fields=output_fields,
            limit=limit,
        )
        return [dict(row) for row in rows]

    def _flush_collection(self) -> None:
        client = self._get_client()
        client.flush(collection_name=self.collection_name)
        if hasattr(client, "refresh_load"):
            client.refresh_load(collection_name=self.collection_name)

    def _document_row_to_dict(self, row: dict[str, Any]) -> dict[str, Any]:
        document_id = str(row["document_id"])
        return {
            "id": document_id,
            "document_id": document_id,
            "title": str(row["title"]),
            "filename": str(row["filename"]),
            "content_type": str(row["content_type"]),
            "assistant_scope": self._normalize_scope(row.get("assistant_scope")),
            "chunk_count": int(row.get("chunk_count") or 0),
            "content_hash": str(row.get("content_hash") or ""),
            "created_by": str(row.get("created_by") or ""),
            "created_at": str(row.get("created_at") or ""),
            "updated_at": str(row.get("updated_at") or ""),
        }

    def create_document(
        self,
        *,
        document_id: str,
        title: str,
        filename: str,
        content_type: str,
        text_content: str,
        assistant_scope: list[str],
        created_by: str,
        created_at: str,
        updated_at: str,
        chunks: list[str],
    ) -> dict[str, Any]:
        self._ensure_collection()
        keywords = [_build_keywords(chunk) for chunk in chunks]
        embeddings = self._encode([""] + chunks)
        content_hash = hashlib.sha256(text_content.encode("utf-8")).hexdigest()

        rows: list[dict[str, Any]] = [
            {
                "chunk_id": build_chunk_id(document_id, -1),
                "document_id": document_id,
                "chunk_index": -1,
                "is_document": 1,
                "title": title,
                "filename": filename,
                "content_type": content_type,
                "assistant_scope": assistant_scope,
                "content": "",
                "keywords": "",
                "created_by": created_by,
                "created_at": created_at,
                "updated_at": updated_at,
                "chunk_count": len(chunks),
                "content_hash": content_hash,
                "vector": embeddings[0],
            }
        ]

        for index, chunk in enumerate(chunks):
            rows.append(
                {
                    "chunk_id": build_chunk_id(document_id, index),
                    "document_id": document_id,
                    "chunk_index": index,
                    "is_document": 0,
                    "title": title,
                    "filename": filename,
                    "content_type": content_type,
                    "assistant_scope": assistant_scope,
                    "content": chunk,
                    "keywords": keywords[index],
                    "created_by": created_by,
                    "created_at": created_at,
                    "updated_at": updated_at,
                    "chunk_count": len(chunks),
                    "content_hash": content_hash,
                    "vector": embeddings[index + 1],
                }
            )

        client = self._get_client()
        client.upsert(collection_name=self.collection_name, data=rows)
        self._flush_collection()
        return self.get_document(document_id) or self._document_row_to_dict(rows[0])

    def list_documents(self) -> list[dict[str, Any]]:
        rows = self._query_rows(
            filter_expr="is_document == 1",
            output_fields=[
                "document_id",
                "title",
                "filename",
                "content_type",
                "assistant_scope",
                "chunk_count",
                "content_hash",
                "created_by",
                "created_at",
                "updated_at",
            ],
        )
        items = [self._document_row_to_dict(row) for row in rows]
        items.sort(key=lambda item: item["updated_at"], reverse=True)
        return items

    def get_document(self, document_id: str) -> dict[str, Any] | None:
        rows = self._query_rows(
            filter_expr=(
                f"is_document == 1 and document_id == {self._escape_filter_value(document_id)}"
            ),
            output_fields=[
                "document_id",
                "title",
                "filename",
                "content_type",
                "assistant_scope",
                "chunk_count",
                "content_hash",
                "created_by",
                "created_at",
                "updated_at",
            ],
            limit=1,
        )
        return self._document_row_to_dict(rows[0]) if rows else None

#   获取文档 chunk，用于预览。
    def get_document_chunks(self, document_id: str, *, limit: int = 50) -> list[dict[str, Any]]:
        rows = self._query_rows(
            filter_expr=(
                "is_document == 0 and "
                f"document_id == {self._escape_filter_value(document_id)}"
            ),
            output_fields=[
                "chunk_id",
                "chunk_index",
                "content",
                "keywords",
                "assistant_scope",
                "updated_at",
            ],
            limit=max(1, limit),
        )
        items = [
            {
                "chunk_id": str(row["chunk_id"]),
                "chunk_index": int(row["chunk_index"]),
                "content": str(row.get("content") or ""),
                "keywords": str(row.get("keywords") or ""),
                "assistant_scope": self._normalize_scope(row.get("assistant_scope")),
                "updated_at": str(row.get("updated_at") or ""),
            }
            for row in rows
        ]
        items.sort(key=lambda item: item["chunk_index"])
        return items

#   删除文档及其 chunk。
    def delete_document(self, document_id: str) -> None:
        self._ensure_collection()
        self._get_client().delete(
            collection_name=self.collection_name,
            filter=f"document_id == {self._escape_filter_value(document_id)}",
        )
        self._flush_collection()

    def stats(self) -> dict[str, int]:
        if not self.available:
            return {"knowledge_docs": 0, "knowledge_chunks": 0}
        try:
            docs = self._query_rows(
                filter_expr="is_document == 1",
                output_fields=["document_id"],
            )
            chunks = self._query_rows(
                filter_expr="is_document == 0",
                output_fields=["chunk_id"],
            )
        except Exception:
            return {"knowledge_docs": 0, "knowledge_chunks": 0}
        return {"knowledge_docs": len(docs), "knowledge_chunks": len(chunks)}

    def backend_status(self) -> dict[str, Any]:
        status: dict[str, Any] = {
            "backend": "milvus",
            "available": self.available,
            "connected": False,
            "collection_name": self.collection_name,
            "embedding_model": self.embedding_model,
            "embedding_backend": self._embedding_backend or "",
            "embedding_error": self._embedding_error,
            "vector_dimension": self._vector_dimension(),
            "bm25_available": self.bm25_available,
            "uri": self.config.uri,
            "libraries": get_available_rag_libraries(),
            "knowledge_docs": 0,
            "knowledge_chunks": 0,
            "last_error": "",
        }
        if not self.available:
            status["last_error"] = "Milvus RAG 依赖未安装完整。"
            return status
        try:
            client = self._get_client()
            status["collection_exists"] = bool(
                client.has_collection(collection_name=self.collection_name)
            )
            self._ensure_collection()
            status["connected"] = True
            status.update(self.stats())
        except Exception as exc:
            status["last_error"] = str(exc)
            status.setdefault("collection_exists", False)
        return status

    def _load_chunk_rows(self) -> list[dict[str, Any]]:
        rows = self._query_rows(
            filter_expr="is_document == 0",
            output_fields=[
                "chunk_id",
                "document_id",
                "chunk_index",
                "title",
                "filename",
                "content",
                "assistant_scope",
                "keywords",
            ],
        )
        normalized_rows: list[dict[str, Any]] = []
        for row in rows:
            normalized_rows.append(
                {
                    "chunk_id": str(row["chunk_id"]),
                    "chunk_index": int(row["chunk_index"]),
                    "document_id": str(row["document_id"]),
                    "title": str(row["title"]),
                    "filename": str(row["filename"]),
                    "content": str(row["content"]),
                    "assistant_scope": self._normalize_scope(row.get("assistant_scope")),
                    "keywords_list": str(row.get("keywords") or "").split(),
                }
            )
        return normalized_rows

#   执行 BM25 关键词检索。
    def _bm25_hits(self, query: str, rows: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
        query_tokens = tokenize_rag_text(query)
        if not query_tokens:
            return []
        if self.bm25_available:
            try:
                from rank_bm25 import BM25Okapi

                corpus = [row.get("keywords_list") or tokenize_rag_text(row["content"]) for row in rows]
                scores = BM25Okapi(corpus).get_scores(query_tokens)
                ordered = sorted(
                    zip(rows, scores, strict=False),
                    key=lambda item: float(item[1]),
                    reverse=True,
                )
                hits = []
                for row, score in ordered:
                    lexical_score = float(score)
                    if lexical_score <= 0:
                        continue
                    hits.append({"chunk_id": row["chunk_id"], "lexical_score": lexical_score})
                    if len(hits) >= limit:
                        break
                return hits
            except Exception:
                pass

        query_set = set(query_tokens)
        hits = []
        for row in rows:
            overlap = query_set & set(row.get("keywords_list") or [])
            if not overlap:
                continue
            hits.append(
                {
                    "chunk_id": row["chunk_id"],
                    "lexical_score": float(len(overlap)),
                }
            )
        hits.sort(key=lambda item: item["lexical_score"], reverse=True)
        return hits[:limit]

    @staticmethod
    def _extract_search_hit_fields(hit: dict[str, Any]) -> dict[str, Any]:
        fields: dict[str, Any] = {}
        entity = hit.get("entity")
        if isinstance(entity, dict):
            fields.update(entity)
        for key, value in hit.items():
            if key == "entity":
                continue
            fields.setdefault(key, value)
        return fields

#   执行 Milvus 向量检索。
    def _vector_hits(self, query: str, assistant_id: str | None, limit: int) -> list[dict[str, Any]]:
        self._ensure_collection()
        query_embedding = self._encode([query])
        results = self._get_client().search(
            collection_name=self.collection_name,
            data=query_embedding,
            anns_field="vector",
            filter="is_document == 0",
            limit=max(limit, 1),
            output_fields=[
                "chunk_id",
                "document_id",
                "chunk_index",
                "title",
                "filename",
                "content",
                "assistant_scope",
            ],
            search_params={"metric_type": "COSINE"},
        )
        hits: list[dict[str, Any]] = []
        for raw_hit in (results[0] if results else []):
            fields = self._extract_search_hit_fields(dict(raw_hit))
            scope = self._normalize_scope(fields.get("assistant_scope"))
            if scope and assistant_id and assistant_id not in scope:
                continue
            raw_score = fields.get("distance")
            if raw_score is None:
                raw_score = fields.get("score")
            if raw_score is None:
                raw_score = fields.get("similarity")
            hits.append(
                {
                    "chunk_id": str(fields.get("chunk_id") or fields.get("id") or ""),
                    "vector_score": float(raw_score or 0.0),
                }
            )
        return [hit for hit in hits if hit["chunk_id"]]

    @staticmethod
    def _row_allowed_for_assistant(row: dict[str, Any], assistant_id: str | None) -> bool:
        scope = row.get("assistant_scope") or []
        if scope and assistant_id and assistant_id not in scope:
            return False
        return True

#   串联 query 改写、BM25 召回、Milvus 向量召回、RRF 融合、rerank 和证据抽取，完成完整 RAG 检索链路。
    def search(
        self,
        query: str,
        *,
        assistant_id: str | None = None,
        limit: int = 4,
    ) -> list[dict[str, Any]]:
        if not query.strip():
            return []
        query_plan = build_rag_query_plan(query)
        #   候选分块加载与权限过滤
        rows = self._load_chunk_rows()
        filtered_rows = [
            row
            for row in rows
            if self._row_allowed_for_assistant(row, assistant_id)
        ]
        if not filtered_rows:
            return []

        row_map = {row["chunk_id"]: row for row in filtered_rows}
        #   双路召回（全文检索 + 语义检索）
        lexical_hits = self._bm25_hits(
            query_plan["rewritten_query"],
            filtered_rows,
            limit * _VECTOR_LIMIT_MULTIPLIER,
        )
        vector_hits = self._vector_hits(
            query_plan["semantic_query"],
            assistant_id,
            limit * _VECTOR_LIMIT_MULTIPLIER,
        )
        #   RRF 结果融合
        fused: dict[str, dict[str, Any]] = {}

        def touch(chunk_id: str) -> dict[str, Any]:
            row = row_map.get(chunk_id)
            if row is None:
                return {}
            if chunk_id not in fused:
                fused[chunk_id] = {
                    "chunk_id": chunk_id,
                    "document_id": row["document_id"],
                    "title": row["title"],
                    "filename": row["filename"],
                    "content": row["content"],
                    "chunk_index": row["chunk_index"],
                    "score": 0.0,
                    "lexical_score": 0.0,
                    "vector_score": 0.0,
                    "retrieval": [],
                }
            return fused[chunk_id]
        #   处理BM25结果
        for rank, hit in enumerate(lexical_hits, start=1):
            entry = touch(hit["chunk_id"])
            if not entry:
                continue
            entry["score"] += 1.0 / (_RRF_K + rank)
            entry["lexical_score"] = max(entry["lexical_score"], hit["lexical_score"])
            if "bm25" not in entry["retrieval"]:
                entry["retrieval"].append("bm25")
        #   处理向量结果
        for rank, hit in enumerate(vector_hits, start=1):
            entry = touch(hit["chunk_id"])
            if not entry:
                continue
            entry["score"] += 1.0 / (_RRF_K + rank)
            entry["vector_score"] = max(entry["vector_score"], hit["vector_score"])
            if "vector" not in entry["retrieval"]:
                entry["retrieval"].append("vector")
        #   多维度智能重排序
        results = list(fused.values())
        for item in results:
            evidence = build_rag_evidence(query_plan, item["content"])
            item["answerability_score"] = _answerability_score(query, item["content"])
            item["rerank_score"] = _rerank_score(query_plan, item)
            item["evidence_sentences"] = evidence["evidence_sentences"]
            item["matched_terms"] = evidence["matched_terms"]
            item["evidence_score"] = evidence["evidence_score"]
            item["context_excerpt"] = evidence["context_excerpt"]
            item["citation"] = {
                "title": item["title"],
                "filename": item["filename"],
                "document_id": item["document_id"],
                "chunk_id": item["chunk_id"],
                "chunk_index": item["chunk_index"],
                "retrieval": item["retrieval"],
            }
            item["query_plan"] = {
                "original_query": query_plan["original_query"],
                "rewritten_query": query_plan["rewritten_query"],
                "core_terms": query_plan["core_terms"][:12],
                "expanded_terms": query_plan["expanded_terms"][:20],
                "rewrite_terms": query_plan["rewrite_terms"][:12],
            }
            item["score"] += item["answerability_score"]
            item["score"] += item["rerank_score"]
        results.sort(
            key=lambda item: (
                item["score"],
                item["rerank_score"],
                item["evidence_score"],
                item["answerability_score"],
                item["vector_score"],
                item["lexical_score"],
                -item["chunk_index"],
            ),
            reverse=True,
        )
        return results[:limit]
