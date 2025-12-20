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

  function getWeatherEmoji(code) {
    if (code === undefined || code === null) return "❓";
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code <= 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 57) return "🌦️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "🌨️";
    if (code >= 95) return "⛈️";
    return "🌡️";
  }

  function describeWeather(code) {
    const map = {
      0: "맑음",
      1: "대체로 맑음",
      2: "부분 흐림",
      3: "흐림",
      45: "안개",
      48: "안개",
      51: "약한 이슬비",
      53: "이슬비",
      55: "강한 이슬비",
      61: "약한 비",
      63: "비",
      65: "강한 비",
      71: "눈",
      73: "눈",
      75: "강한 눈",
      80: "소나기",
      81: "소나기",
      82: "강한 소나기",
      95: "뇌우",
    };
    return map[code] || "알 수 없음";
  }

  async function handleDelete() {
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      navigate("/diary");
    } catch {
      alert("삭제 실패");
    }
  }

  useEffect(() => {
    async function loadOne() {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (data.Name !== userName) {
          setMsg("내가 쓴 일기만 볼 수 있어요.");
          return;
        }

        setItem(data);
        setMsg("");
      } catch {
        setMsg("불러오기 실패");
      }
    }
    loadOne();
  }, [id, userName]);

  if (msg) {
    return (
      <div className="page-center">
        <div className="card">
          <div className="card-title">일기 보기</div>
          <div className="hint">{msg}</div>
          <button className="btn" onClick={() => navigate("/diary")}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const dateText = new Date(item.date || item.createdAt).toLocaleDateString(
    "ko-KR"
  );

  const weather = item.weather;

  return (
    <div className="page-center">
      <div
        className="card"
        style={{ width: "min(760px, 100%)", position: "relative" }}
      >
        {/* 🌤️ 우측 상단 날씨 */}
        {weather && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              fontSize: 60,
              textAlign: "center",
            }}
          >
            {getWeatherEmoji(weather.weatherCode)}
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {describeWeather(weather.weatherCode)}
              {typeof weather.temperature === "number"
                ? ` ${weather.temperature.toFixed(1)}°C`
                : ""}
            </div>
          </div>
        )}

        <div className="card-title">{item.title}</div>
        <div className="hint">
          {dateText} / {item.Name}
        </div>

        <div style={{ marginTop: 16, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
          {item.Content}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/diary/${id}/edit`)}
          >
            수정
          </button>
          <button className="btn btn-primary" onClick={handleDelete}>
            삭제
          </button>
          <button className="btn" onClick={() => navigate("/diary")}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
}
