import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="app-header">
        <div className="title-block">
          <div className="logo-text">GRATITUDE JOURNAL</div>
          <h1 className="main-title">
            감사노트 <span>사용 안내</span>
          </h1>
          <p className="subtitle">
            아래 안내를 읽고, 버튼을 눌러서 <strong>로그인</strong>으로
            이동하세요.
          </p>
        </div>

        <aside className="weather-card">
          <div className="weather-header">TIP</div>
          <div className="weather-loading">
            • 이름만 입력하면 시작돼요 <br />
            • 일기는 Name 기준으로 저장돼요 <br />• 내 이름으로만 조회돼요
          </div>
        </aside>
      </header>

      <main className="content">
        <section className="user-summary">
          <div className="user-name">
            <span>감사일기 설명</span>
          </div>

          <div className="guide-box">
            <div className="guide-title">감사일기 사용법</div>
            <div className="guide-text">
              1) 로그인 화면에서 이름을 입력하면 시작돼요. <br />
              2) 작성한 일기는 입력한 이름으로만 저장/조회돼요. <br />
              3) 오늘 감사했던 일을 짧게 기록해보세요.
            </div>
          </div>

          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              로그인으로 이동
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
