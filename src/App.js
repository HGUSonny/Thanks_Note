// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "gratitude_entries_v1";

function getTodayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayStr);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("happy");
  const [entries, setEntries] = useState([]);

  // 최초 로딩 시 로컬스토리지에서 불러오기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setEntries(parsed);
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  // entries 변경될 때마다 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [entries]);

  const entriesForSelectedDate = useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate]
  );

  // 날짜 목록 (최근 날짜 순 정렬)
  const dateList = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => {
      map.set(e.date, (map.get(e.date) || 0) + 1);
    });
    const arr = Array.from(map.entries()); // [date, count]
    arr.sort((a, b) => (a[0] < b[0] ? 1 : -1)); // 최신 날짜 먼저
    return arr;
  }, [entries]);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      alert("오늘 감사했던 일을 간단히 적어주세요.");
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      text: trimmed,
      mood,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [...prev, newEntry]);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleAdd();
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleChangeDate = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>감사일기 ✨</h1>
          <p className="subtitle">
            항상 기뻐하라, 쉬지 말고 기도하라, 범사에 <strong>감사</strong>하라"
            (데살로니가전서 5:18)
          </p>
        </div>
      </header>

      <main className="app-main">
        {/* 왼쪽: 입력 영역 */}
        <section className="panel panel-left">
          <h2 className="panel-title">오늘의 감사 기록</h2>

          {/* 날짜 선택 */}
          <div className="field">
            <label className="field-label">날짜</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleChangeDate}
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label">오늘의 감사 제목</label>
            <div className="mood-group">
              <textarea
                className="field-textarea"
                rows={12}
                placeholder={`오늘의 감사는 무엇인가요?`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="field-hint">
                <span>Enter 를 눌러도 추가할 수 있어요.</span>
              </div>
            </div>
          </div>

          {/* 추가 버튼 */}
          <div className="actions">
            <button type="button" className="btn-primary" onClick={handleAdd}>
              오늘의 감사 기록 추가하기
            </button>
          </div>
        </section>

        {/* 오른쪽: 날짜별 리스트 영역 */}
        <section className="panel panel-right">
          <div className="panel-right-header">
            <h2 className="panel-title">감사 기록 보기</h2>
          </div>

          {/* 날짜 목록 */}
          <div className="dates-list">
            <h3 className="dates-title">날짜별 요약</h3>
            {dateList.length === 0 && (
              <p className="empty-text">아직 작성한 감사일기가 없습니다.</p>
            )}
            {dateList.map(([date, count]) => (
              <button
                key={date}
                type="button"
                className={
                  "date-pill" +
                  (date === selectedDate ? " date-pill--active" : "")
                }
                onClick={() => setSelectedDate(date)}
              >
                <span>{date}</span>
                <span className="date-pill-count">{count}개</span>
              </button>
            ))}
          </div>

          {/* 선택된 날짜의 상세 목록 */}
          <div className="entries-list">
            <h3 className="entries-title">
              {selectedDate}의 감사 기록
              {entriesForSelectedDate.length > 0 &&
                ` (${entriesForSelectedDate.length}개)`}
            </h3>

            {entriesForSelectedDate.length === 0 && (
              <p className="empty-text">
                아직 이 날짜에는 감사일기를 작성하지 않았어요.
              </p>
            )}

            <ul className="entries-ul">
              {entriesForSelectedDate.map((entry) => {
                const moodLabel =
                  MOODS.find((m) => m.id === entry.mood)?.label ?? "🙂";

                return (
                  <li key={entry.id} className="entry-item">
                    <div className="entry-header">
                      <span className="entry-mood">{moodLabel}</span>
                      <button
                        type="button"
                        className="entry-delete-btn"
                        onClick={() => handleDelete(entry.id)}
                      >
                        삭제
                      </button>
                    </div>
                    <p className="entry-text">{entry.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>항상 감사하며 항상 동행하고 계신 예수님을 기억하기를...</span>
      </footer>
    </div>
  );
}

export default App;
