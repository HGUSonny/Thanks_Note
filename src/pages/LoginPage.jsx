import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setMsg("이름을 입력해주세요.");
      return;
    }

    localStorage.setItem("authName", trimmed);
    setMsg("");
    navigate("/diary");
  }

  return (
    <div className="page-center">
      <div className="card">
        <div className="card-title">이름으로 접속</div>

        <form onSubmit={handleLogin} className="form">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />

          {msg && <div className="error">{msg}</div>}

          <button className="btn btn-primary" type="submit">
            로그인
          </button>
        </form>

        <div className="hint">회원가입 없이 이름만으로 시작합니다.</div>
      </div>
    </div>
  );
}
