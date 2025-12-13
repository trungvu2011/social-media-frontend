import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import { AppProviders } from "./context";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useEffect, useState } from "react";
import ProfilePage from "./pages/profile/ProfilePage";
import FollowListPage from "./pages/profile/FollowListPage";

const ROUTERS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile/:username",
  FOLLOWS: "/profile/:username/:type",
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