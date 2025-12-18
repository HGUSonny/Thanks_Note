import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function DiaryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("불러오는 중...");

  useEffect(() => {
    async function loadOne() {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("불러오기 실패");
        const data = await res.json();

        if (data.Name !== userName) {
          setMsg("내 글만 수정할 수 있어요.");
          return;
        }

        setTitle(data.title || "");
        setContent(data.Content || "");
        setMsg("");
      } catch (e) {
        setMsg("불러오기 실패");
      }
    }
    loadOne();
    // eslint-disable-next-line
  }, [id]);

  async function save(e) {
    e.preventDefault();

    if (title.trim().length === 0) return setMsg("제목을 입력해주세요.");
    if (content.trim().length === 0) return setMsg("내용을 입력해주세요.");

    setMsg("저장 중...");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          Content: content.trim(),
          Name: userName,
        }),
      });

      if (!res.ok) throw new Error("저장 실패");

      navigate(`/diary/${id}`);
    } catch (e2) {
      setMsg("저장 실패");
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "min(760px, 100%)" }}>
        <div className="card-title">일기 수정</div>
        {msg && <div className="hint">{msg}</div>}

        <form onSubmit={save} className="form" style={{ marginTop: 10 }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: 180, resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit">
              저장
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigate(`/diary/${id}`)}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
