from nanobot.cluster.rag import get_available_rag_libraries, get_rag_library_catalog


def test_rag_catalog_contains_common_libraries() -> None:
    catalog = get_rag_library_catalog()
    names = {item.name for item in catalog}
    assert {"Milvus", "sentence-transformers", "rank-bm25"} <= names


def test_rag_availability_payload_is_json_friendly() -> None:
    items = get_available_rag_libraries()
    assert items
    assert all("name" in item for item in items)
    assert all("available" in item for item in items)
