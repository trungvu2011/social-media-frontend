// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { AppProviders } from "./context";
import LeftSidebar from "./components/layout/LeftSideBar";
import RightSidebar from "./components/layout/RightSideBar";
import { useEffect, useState } from "react";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";

const ROUTERS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
};

function App() {
  const [authUser, setAuthUser] = useState<any>(() => {
    try {
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep authUser in sync if storage changes in other tabs
  useEffect(() => {
    const onStorage = () => {
      try {
        const stored =
          localStorage.getItem("auth_user") ||
          sessionStorage.getItem("auth_user");
        setAuthUser(stored ? JSON.parse(stored) : null);
      } catch {
        setAuthUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AppProviders>
      <div className="flex min-h-screen flex-row">
        <BrowserRouter>
          {authUser && <LeftSidebar />}
          <Routes>
            <Route
              path={ROUTERS.HOME}
              element={authUser ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path={ROUTERS.LOGIN}
              element={!authUser ? <LoginPage /> : <Navigate to="/login" />}
            />
            <Route
              path={ROUTERS.REGISTER}
              element={!authUser ? <RegisterPage /> : <Navigate to="/register" />}
            />
          </Routes>
          {authUser && <RightSidebar friendSuggestions={[]} />}
        </BrowserRouter>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;