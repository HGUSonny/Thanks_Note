import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import IndexPage from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import DiaryListPage from "./pages/DiaryListPage";
import DiaryWritePage from "./pages/DiaryWritePage";
import DiaryViewPage from "./pages/DiaryViewPage";
import DiaryEditPage from "./pages/DiaryEditPage";

function isLogin() {
  return Boolean(localStorage.getItem("authName"));
}

function ProtectedRoute({ children }) {
  if (!isLogin()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ 1번 화면(대시보드) 없애고 바로 목록으로 */}
        <Route path="/dashboard" element={<Navigate to="/diary" replace />} />

        <Route
          path="/diary"
          element={
            <ProtectedRoute>
              <DiaryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/write"
          element={
            <ProtectedRoute>
              <DiaryWritePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/:id"
          element={
            <ProtectedRoute>
              <DiaryViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/:id/edit"
          element={
            <ProtectedRoute>
              <DiaryEditPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
