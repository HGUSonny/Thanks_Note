import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DiaryListPage.css";
import { getCurrentWeather } from "../weatherService";

export default function DiaryListPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("authName") || "User";

  const API_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [todayWeather, setTodayWeather] = useState(null);

  function logout() {
    localStorage.removeItem("authName");
    navigate("/index");
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAll(data || []);
    } catch {
      setError("목록을 불러오지 못했습니다.");
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    getCurrentWeather().then(setTodayWeather);
  }, []);

  const mine = useMemo(() => {
    const arr = all.filter((d) => d.Name === userName);
    arr.sort((a, b) => new Date(getDateKey(b)) - new Date(getDateKey(a)));
    return arr;
  }, [all, userName]);

  const monthOptions = useMemo(() => {
    const set = new Set();
    mine.forEach((it) => {
      const d = getDateKey(it);
      if (d) set.add(d.slice(0, 7));
    });
    return [...set].sort().reverse();
  }, [mine]);

  const filteredMine = useMemo(() => {
    let result = mine;

    if (selectedMonth !== "all") {
      result = result.filter((it) => getDateKey(it).startsWith(selectedMonth));
    }

    if (selectedWeather) {
      result = result.filter(
        (it) => getWeatherGroup(it.weather?.weatherCode) === selectedWeather
      );
    }

    return result;
  }, [mine, selectedMonth, selectedWeather]);

  function getDateKey(it) {
    if (it?.date) return it.date;
    if (it?.createdAt) return String(it.createdAt).slice(0, 10);
    if (it?.Time) {
      const s = String(it.Time);
      return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
    }
    return "";
  }

  function formatKoDate(dateKey) {
    const d = new Date(dateKey);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("ko-KR");
  }

  function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌡️";
  }

  function getWeatherText(code) {
    if (code === 0) return "맑음";
    if (code <= 3) return "흐림";
    if (code <= 67) return "비";
    if (code <= 77) return "눈";
    if (code >= 95) return "폭풍";
    return "날씨";
  }

  function getWeatherGroup(code) {
    if (code === 0) return "sun";
    if (code <= 3) return "cloud";
    if (code <= 67) return "rain";
    if (code <= 77) return "snow";
    if (code >= 95) return "storm";
    return null;
  }

  return (
    <div className="diaryPage">
      <div className="diaryWrap">
        <div className="diaryTop">
          <div className="diaryHeaderRow">
            <div className="diaryHeaderLeft">
              <div className="diaryBrand">GRATITUDE JOURNAL</div>

              <div className="diaryTitle">{userName}님의 일기 목록</div>

              {todayWeather && (
                <div className="todayWeatherRow">
                  <span className="todayWeatherEmoji">
                    {getWeatherEmoji(todayWeather.weatherCode)}
                  </span>
                  <span>
                    {getWeatherText(todayWeather.weatherCode)} ·{" "}
                    {todayWeather.temperature.toFixed(1)}°C · 포항
                  </span>
                </div>
              )}
            </div>

            <div className="diaryHeaderActions">
              <div className="headerBtnRow">
                <button
                  className="headerBtn primary"
                  onClick={() => navigate("/diary/write")}
                >
                  ✏️ 새 일기
                </button>
                <button className="headerBtn" onClick={loadData}>
                  ↻ 새로고침
                </button>
                <button className="headerBtn ghost" onClick={logout}>
                  로그아웃
                </button>
              </div>

              <div className="weatherFilterRow">
                {[
                  { key: "sun", icon: "☀️" },
                  { key: "rain", icon: "🌧️" },
                  { key: "snow", icon: "❄️" },
                  { key: "storm", icon: "⛈️" },
                ].map((w) => (
                  <button
                    key={w.key}
                    className={`weatherFilterBtn ${
                      selectedWeather === w.key ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedWeather(
                        selectedWeather === w.key ? null : w.key
                      )
                    }
                  >
                    {w.icon}
                  </button>
                ))}
              </div>

              {selectedWeather && (
                <div className="activeWeatherNotice">
                  현재 적용된 필터 :
                  <strong>
                    {selectedWeather === "sun" && " ☀️ 맑음"}
                    {selectedWeather === "rain" && " 🌧️ 비"}
                    {selectedWeather === "snow" && " ❄️ 눈"}
                    {selectedWeather === "storm" && " ⛈️ 폭풍"}
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="diaryDescRow">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="monthSelect"
            >
              <option value="all">전체 일기</option>
              {monthOptions.map((m) => {
                const [y, mm] = m.split("-");
                return (
                  <option key={m} value={m}>
                    {y}년 {parseInt(mm, 10)}월
                  </option>
                );
              })}
            </select>

            <div className="diaryTodayDate">
              {new Date().toLocaleDateString("ko-KR")}
            </div>
          </div>
        </div>

        <div
          className={`diaryListBox ${
            selectedWeather ? `list-${selectedWeather}` : ""
          }`}
        >
          <div className="diaryListHeader">
            총 <span>{filteredMine.length}</span> 개
          </div>

          {loading && <div>불러오는 중...</div>}
          {!loading && error && <div>{error}</div>}
          {!loading && filteredMine.length === 0 && (
            <div>선택한 조건에 해당하는 일기가 없습니다.</div>
          )}

          <div className="diaryPreviewList">
            {filteredMine.map((it) => (
              <div
                key={it.id}
                className="diaryPreviewItem"
                onClick={() => navigate(`/diary/${it.id}`)}
              >
                <div className="diaryPreviewMain">
                  <div className="diaryPreviewDate">
                    {formatKoDate(getDateKey(it))}
                  </div>
                  <div className="diaryPreviewTitle">
                    {it.title || "(제목 없음)"}
                  </div>
                  <div className="diaryPreviewContent">
                    {(it.Content || "").slice(0, 80)}
                    {it.Content?.length > 80 ? "..." : ""}
                  </div>
                </div>

                {it.weather && (
                  <div className="diaryPreviewWeatherBig">
                    {getWeatherEmoji(it.weather.weatherCode)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
