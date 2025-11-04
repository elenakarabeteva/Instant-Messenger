// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/login/LoginForm";
import Chat from "./components/chat/Chat";
import Profile from "./components/profile/Profile";
import RegisterForm from "./components/registration/RegisterForm";

function App() {
  // Функция, която проверява дали user е в localStorage
  const isAuthenticated = () => {
    return !!localStorage.getItem("user");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ако сме на root, прехвърляме към /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Публичен маршрут за логин */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Защитен маршрут: /chat */}
        <Route
          path="/chat"
          element={
            isAuthenticated() ? <Chat /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />} />

        {/* Всички други пътища прехвърляме към /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
