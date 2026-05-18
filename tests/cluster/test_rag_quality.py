from nanobot.cluster.rag import _build_keywords, _rerank_score, build_rag_evidence, build_rag_query_plan


def test_query_plan_expands_domain_terms() -> None:
    plan = build_rag_query_plan("家庭宽带每月哪天扣费，超过多少钱提醒我？")

    assert "宽带" in plan["rewritten_query"]
    assert "扣费" in plan["expanded_terms"]
    assert "提醒" in plan["expanded_terms"]


def test_evidence_prefers_query_related_sentence() -> None:
    plan = build_rag_query_plan("宽带超过多少钱提醒")
    evidence = build_rag_evidence(
        plan,
        "这是普通背景说明。家庭宽带每月18日扣费，超过200元需要提醒。其他账号资料。",
    )

    assert evidence["evidence_sentences"]
    assert "超过200元" in evidence["evidence_sentences"][0]
    assert "宽带" in evidence["matched_terms"]


def test_reranker_prefers_answer_chunk_over_question_bank() -> None:
    plan = build_rag_query_plan("会员续费提前多久提醒")
    answer_score = _rerank_score(
        plan,
        {
            "title": "个人生活账号助手演示知识库",
            "content": "云盘会员每年6月12日续费，需要提前14天提醒用户。",
        },
    )
    question_bank_score = _rerank_score(
        plan,
        {
            "title": "个人生活账号助手演示知识库",
            "content": "可用于演示的问题：会员续费提前多久提醒？",
        },
    )

    assert answer_score > question_bank_score


def test_keywords_are_truncated_to_milvus_safe_length() -> None:
    long_text = " ".join(f"生活指南{i} 家庭宽带扣费提醒健康作息出行学习素材附件" for i in range(1200))

    keywords = _build_keywords(long_text)

    assert len(keywords.encode("utf-8")) <= 7900
    assert "家庭宽带" in keywords
