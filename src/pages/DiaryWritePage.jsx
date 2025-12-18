import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function save(e) {
    e.preventDefault();

    if (title.trim().length === 0) return setMsg("제목을 입력해주세요.");
    if (content.trim().length === 0) return setMsg("내용을 입력해주세요.");

    setMsg("저장 중...");

    const now = new Date();
    const Time =
      now.getFullYear() * 100000000 +
      (now.getMonth() + 1) * 1000000 +
      now.getDate() * 10000 +
      now.getHours() * 100 +
      now.getMinutes();

    const body = {
      title: title.trim(),
      Content: content.trim(),
      Name: userName,
      Time: Time,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("저장 실패");

      navigate("/diary");
    } catch (e2) {
      setMsg("저장 실패");
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "min(760px, 100%)" }}>
        <div className="card-title">새 일기</div>
        <div className="hint">작성자: {userName}</div>

        <form onSubmit={save} className="form" style={{ marginTop: 10 }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />
          <textarea
            className="input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            style={{ minHeight: 180, resize: "vertical" }}
          />

          {msg && <div className="hint">{msg}</div>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit">
              저장
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigate("/diary")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
