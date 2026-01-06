import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import { AppProviders } from "./context";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect, useState } from "react";
import ProfilePage from "./pages/profile/ProfilePage";
import FollowListPage from "./pages/profile/FollowListPage";
import NotificationPage from "./pages/notification/NotificationPage";

import PostPage from "./pages/post/PostPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminPage from "./pages/admin/AdminPage";
import { ChatPage } from "./pages/chat/ChatPage";

const ROUTERS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile/:username",
  FOLLOWS: "/profile/:username/:type",
  NOTIFICATIONS: "/notifications",
  POST: "/post/:id",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ADMIN: "/admin",
  CHAT: "/chat",
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
          <Routes>
            <Route
              path={ROUTERS.LOGIN}
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path={ROUTERS.REGISTER}
              element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path={ROUTERS.FORGOT_PASSWORD}
              element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />}
            />
            <Route
              path={ROUTERS.RESET_PASSWORD}
              element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
            />

            <Route
              path={ROUTERS.HOME}
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path={ROUTERS.PROFILE}
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path={ROUTERS.FOLLOWS}
              element={authUser ? <FollowListPage /> : <Navigate to="/login" />}
            />
            <Route
              path={ROUTERS.NOTIFICATIONS}
              element={
                authUser ? <NotificationPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path={ROUTERS.POST}
              element={authUser ? <PostPage /> : <Navigate to="/login" />}
            />

            <Route
              path={ROUTERS.ADMIN}
              element={
                authUser && authUser.role === "admin" ? (
                  <AdminPage />
                ) : (
                  <Navigate to={ROUTERS.HOME} />
                )
              }
            />

            <Route
              path={ROUTERS.CHAT}
              element={authUser ? <ChatPage /> : <Navigate to="/login" />}
            />

            <Route
              path="*"
              element={
                <Navigate to={authUser ? ROUTERS.HOME : ROUTERS.LOGIN} />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProviders>
  );
}

export default App;
