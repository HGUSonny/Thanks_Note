import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DiaryListPage.css";

export default function DiaryListPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function logout() {
    localStorage.removeItem("authName");
    navigate("/index");
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("목록을 불러오지 못했습니다.");
      const data = await res.json();
      setAll(data || []);
    } catch (e) {
      setError(e.message || "목록을 불러오지 못했습니다.");
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const mine = useMemo(() => {
    const arr = all.filter((d) => d.Name === userName);
    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr;
  }, [all, userName]);

  const startDate = useMemo(() => {
    if (mine.length === 0) return "";
    const oldest = [...mine].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )[0];
    return new Date(oldest.createdAt).toLocaleDateString();
  }, [mine]);
  function getDateKey(it) {
    if (it?.date) return it.date; // ✅ 앞으로 저장할 필드
    if (it?.createdAt) return String(it.createdAt).slice(0, 10); // "YYYY-MM-DD"
    if (it?.Time) {
      const s = String(it.Time);
      const y = s.slice(0, 4);
      const m = s.slice(4, 6);
      const d = s.slice(6, 8);
      if (y && m && d) return `${y}-${m}-${d}`;
    }
    return "";
  }

  function formatKoDate(dateKey) {
    if (!dateKey) return "";
    const d = new Date(dateKey);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ko-KR");
  }

  return (
    <div className="diaryPage">
      <div className="diaryWrap">
        <div className="diaryTop">
          <div className="diaryLeft">
            <div className="diaryBrand">GRATITUDE JOURNAL</div>

            <div className="diaryTitle">
              <span className="diaryName">{userName}</span>
              <span className="diarySuffix">님의 일기 목록</span>
            </div>

            <div className="diaryDesc">
              {userName}님의 감사 일기!
              {startDate && (
                <div className="diaryStart">일기 시작일: {startDate}</div>
              )}
            </div>

            <button className="diaryLogout" onClick={logout}>
              로그아웃
            </button>
          </div>

          <div className="diaryMenuCard">
            <div className="diaryMenuTitle">메뉴</div>

            <button
              className="diaryMenuBtn diaryMenuBtnPrimary"
              onClick={() => navigate("/diary/write")}
            >
              ✏️ 새 일기
            </button>

            <button
              className="diaryMenuBtn diaryMenuBtnPrimary"
              onClick={() => navigate("/diary")}
            >
              🏠 목록
            </button>

            <button
              className="diaryMenuBtn diaryMenuBtnPrimary"
              onClick={loadData}
            >
              ↻ 새로고침
            </button>
          </div>
        </div>

        <div className="diaryListBox">
          <div className="diaryListHeader">
            총 <span className="diaryCount">{mine.length}</span> 개
          </div>

          {loading && <div className="diaryInfo">불러오는 중...</div>}

          {!loading && error && <div className="diaryInfo">{error}</div>}

          {!loading && !error && mine.length === 0 && (
            <div className="diaryInfo">
              <div className="diaryInfoTitle">안내</div>
              아직 일기가 없습니다.
            </div>
          )}

          {!loading && !error && mine.length > 0 && (
            <div className="diaryPreviewList">
              {mine.map((it) => {
                const dateSource =
                  it.createdAt ||
                  (it.Time
                    ? `${String(it.Time).slice(0, 4)}-${String(it.Time).slice(
                        4,
                        6
                      )}-${String(it.Time).slice(6, 8)}`
                    : "");

                const dateText = dateSource
                  ? new Date(dateSource).toLocaleDateString("ko-KR")
                  : "";

                const preview = (it.Content || "").slice(0, 90);

                return (
                  <div
                    key={it.id}
                    className="diaryPreviewItem"
                    onClick={() => navigate(`/diary/${it.id}`)}
                  >
                    <div className="diaryPreviewDate">{dateText}</div>
                    <div className="diaryPreviewTitle">
                      {it.title || "(제목 없음)"}
                    </div>
                    <div className="diaryPreviewContent">
                      {preview}
                      {it.Content && it.Content.length > 90 ? "..." : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
