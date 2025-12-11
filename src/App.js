import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const USER_NAME = "User";
  const CITY_NAME = "Pohang"; // 지역 이름
  const OPENWEATHER_API_KEY = "75af31a92acaa7c17e9e76ce3bcb0c8e"; //날씨 API 키

  const MOCK_API_BASE_URL =
    "https://69312ce411a8738467cd899f.mockapi.io/api/thanks/Thanks_note";

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  const [diaryCount, setDiaryCount] = useState(0);
  const [startDate, setStartDate] = useState("-");
  const [preview, setPreview] = useState(
    "아직 작성된 감사일기가 없습니다. 오늘 첫 감사일기를 남겨보세요. 😊"
  );
  const [diaryError, setDiaryError] = useState("");

  // 날짜 포맷입니다.
  function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getKoreanWeekday(dateObj) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[dateObj.getDay()];
  }

  // “시간 포멧입니다.”
  function formatUpdatedTime(dateObj) {
    const h = String(dateObj.getHours()).padStart(2, "0");
    const m = String(dateObj.getMinutes()).padStart(2, "0");
    return `${h}:${m} 기준`;
  }

  // OpenWeather에서 날씨 값을 가지고와 이모지로 변환하는 함수입니다.
  function getEmojiFromWeatherMain(mainText) {
    if (!mainText) return "⛅";

    if (mainText === "Clear") return "☀️";
    if (mainText === "Clouds") return "☁️";
    if (mainText === "Rain" || mainText === "Drizzle") return "🌧️";
    if (mainText === "Thunderstorm") return "⛈️";
    if (mainText === "Snow") return "❄️";
    if (mainText === "Mist" || mainText === "Fog" || mainText === "Haze")
      return "🌫️";

    return "⛅";
  }

  // 1) OpenWeather에서 포항 날씨 가져오기 (온도 + 이모지)
  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      CITY_NAME
    )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("OpenWeather API 호출 실패");
        }
        return res.json();
      })
      .then((data) => {
        const temp = Math.round(data.main.temp);
        const mainWeather =
          data.weather && data.weather[0] ? data.weather[0].main : "";
        const emoji = getEmojiFromWeatherMain(mainWeather);

        setWeather({
          temp: temp,
          emoji: emoji,
          updatedAt: new Date(),
        });
        setWeatherError("");
      })
      .catch((error) => {
        console.error(error);
        setWeatherError("날씨 정보를 불러오지 못했습니다.");
      });
  }, []); // 페이지 처음 로딩 시 한 번만 하도록 했습니다.

  // 2) 감사일기(MockAPI) 불러오기
  useEffect(() => {
    fetch(MOCK_API_BASE_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("일기 목록 호출 실패");
        }
        return res.json();
      })
      .then((diaries) => {
        setDiaryCount(diaries.length);

        if (diaries.length === 0) {
          setStartDate("-");
          setPreview(
            "아직 작성된 감사일기가 없습니다. 오늘 첫 감사일기를 남겨보세요. 😊"
          );
          setDiaryError("");
          return;
        }

        // 시작일: 가장 오래된 createdAt찾아서 디스플레이
        const sortedByOldest = diaries
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        const firstDiary = sortedByOldest[0];
        const firstDate = new Date(firstDiary.createdAt);
        const startText = `${formatDate(firstDate)} (${getKoreanWeekday(
          firstDate
        )}요일)`;
        setStartDate(startText);

        // 최신 일기: 가장 최근 createdAt찾아서 디스플레이
        const sortedByNewest = diaries
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        const latest = sortedByNewest[0];

        const title = latest.title || "제목 없음";
        const content = latest.content || "(내용 없음)";
        let shortContent = content;
        if (content.length > 60) {
          shortContent = content.slice(0, 60) + "...";
        }

        setPreview(`"${title}" - ${shortContent}`);
        setDiaryError("");
      })
      .catch((error) => {
        console.error(error);
        setDiaryError(
          "일기 데이터를 불러오지 못했습니다. MockAPI 서버 주소를 확인해주세요."
        );
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="title-block">
          <div className="logo-text">GRATITUDE JOURNAL</div>
          <h1 className="main-title">
            오늘의 <span>감사</span>를 기록해 볼까요?
          </h1>
          <p className="subtitle">
            작은 감사들을 모아서, 큰 행복을 만들어가는
            <strong> 나만의 일기장</strong>.
          </p>
        </div>

        <aside className="weather-card">
          <div className="weather-header">포항 날씨</div>

          {!weather && !weatherError && (
            <div className="weather-loading">
              날씨 정보를 불러오는 중입니다...
            </div>
          )}

          {weatherError && <div className="weather-error">{weatherError}</div>}

          {weather && !weatherError && (
            <>
              <div className="weather-main">
                <div className="weather-emoji" style={{ fontSize: "40px" }}>
                  {weather.emoji}
                </div>
                <div>
                  <div className="weather-temp">{weather.temp}°C</div>
                  <div className="weather-desc">현재 포항 날씨</div>
                </div>
              </div>
              <div className="weather-updated">
                {formatUpdatedTime(weather.updatedAt)}
              </div>
            </>
          )}
        </aside>
      </header>

      <main className="content">
        <section className="user-summary">
          <div className="user-name">
            <span>{USER_NAME}</span> 님의 감사일기
          </div>
          <p className="user-meta">
            오늘 함께한 하나님의 은혜를 기록해서 기억해보세요.
          </p>

          <div className="stats-row">
            <div className="stat-pill">
              시작일 : <strong>{startDate}</strong>
            </div>
            <div className="stat-pill">
              감사했던 하루 : <strong>{diaryCount}</strong>일
            </div>
          </div>

          <div className="diary-preview">
            <div className="preview-title">최근 감사 한 줄 미리보기</div>
            <div className="preview-content">{preview}</div>
            {diaryError && <div className="diary-error">{diaryError}</div>}
          </div>

          <div className="buttons">
            <button className="btn btn-primary">
              <span className="icon">✏️</span>
              <span>일기 쓰러 가기</span>
            </button>
            <button className="btn btn-outline">
              <span className="icon">📚</span>
              <span>일기 목록 보기</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
