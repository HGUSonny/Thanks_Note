import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function DiaryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [item, setItem] = useState(null);
  const [msg, setMsg] = useState("불러오는 중...");

  // ✅ 삭제 함수는 여기
  async function handleDelete() {
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제 완료!");
      navigate("/diary");
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  }

  useEffect(() => {
    async function loadOne() {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("불러오기 실패");

        const data = await res.json();

        if (data.Name !== userName) {
          setMsg("내 이름으로 작성한 글만 볼 수 있어요.");
          setItem(null);
          return;
        }

        setItem(data);
        setMsg("");
      } catch (e) {
        setMsg("불러오기 실패");
      }
    }

    loadOne();
    // eslint-disable-next-line
  }, [id]);

  if (msg) {
    return (
      <div className="page-center">
        <div className="card">
          <div className="card-title">일기 보기</div>
          <div className="hint">{msg}</div>
          <button
            className="btn"
            onClick={() => navigate("/diary")}
            style={{ marginTop: 10 }}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const dateText = new Date(
    (item.createdAt || "").slice(0, 10) ||
      `${String(item.Time || "").slice(0, 4)}-${String(item.Time || "").slice(
        4,
        6
      )}-${String(item.Time || "").slice(6, 8)}`
  ).toLocaleDateString("ko-KR");

  return (
    <div className="page-center">
      <div className="card" style={{ width: "min(760px, 100%)" }}>
        <div className="card-title">{item.title}</div>
        <div className="hint">
          {dateText} / {item.Name}
        </div>

        <div style={{ marginTop: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
          {item.Content}
        </div>

        <div
          style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/diary/${id}/edit`)}
          >
            수정
          </button>

          <button className="btn btn-primary" onClick={handleDelete}>
            삭제
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/diary")}
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
}
