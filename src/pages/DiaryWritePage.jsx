import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { getCurrentWeather } from "../weatherService.js";

export default function DiaryWritePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadWeather() {
      const w = await getCurrentWeather();
      if (mounted) setWeather(w);
      setWeatherLoading(false);
    }
    loadWeather();
    return () => (mounted = false);
  }, []);

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

  async function save(e) {
    e.preventDefault();

    if (!title.trim()) return setMsg("제목을 입력해주세요.");
    if (!content.trim()) return setMsg("내용을 입력해주세요.");

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
      Time,
      date: now.toISOString().slice(0, 10),
      weather,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      navigate("/diary");
    } catch {
      setMsg("저장 실패");
    }
  }

  return (
    <div className="page-center">
      <div
        className="card"
        style={{ width: "min(760px, 100%)", position: "relative" }}
      >
        {/* 🌤️ 우측 상단 날씨 이모지 */}
        {!weatherLoading && weather && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              fontSize: 56,
            }}
          >
            {getWeatherEmoji(weather.weatherCode)}
          </div>
        )}

        <div className="card-title">새 일기</div>
        <div className="hint">작성자: {userName}</div>

        {!weatherLoading && weather && (
          <div className="hint">
            날씨: {describeWeather(weather.weatherCode)}
            {typeof weather.temperature === "number"
              ? ` ${weather.temperature.toFixed(1)}°C`
              : ""}
          </div>
        )}

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
            style={{ minHeight: 180 }}
          />

          {msg && <div className="hint">{msg}</div>}

          <div style={{ display: "flex", gap: 10 }}>
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
