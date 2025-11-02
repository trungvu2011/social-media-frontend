// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { AppProviders } from "./context";
import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";
import { useState } from "react";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

const ROUTERS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
};

function App() {
  const [authUser, setAuthUser] = useState(null);

  return (
    <AppProviders>
      <div className="flex min-h-screen flex-row">
        <BrowserRouter>
          {authUser && <LeftSidebar />}
          <Routes>
            <Route
              path={ROUTERS.HOME}
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path={ROUTERS.LOGIN}
              element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
            />
            <Route
              path={ROUTERS.REGISTER}
              element={!authUser ? <RegisterPage /> : <Navigate to="/home" />}
            />
          </Routes>
          {authUser && <RightSidebar />}
        </BrowserRouter>
      </div>
    </AppProviders>
  );
}

export default App;
