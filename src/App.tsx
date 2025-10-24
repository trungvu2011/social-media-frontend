// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { AppProviders } from "./context";
import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";

const ROUTERS = {
  HOME: "/",
};

function App() {
  return (
    <AppProviders>
      <div className="flex min-h-screen flex-row">
        <BrowserRouter>
          <LeftSidebar />
          <Routes>
            <Route path={ROUTERS.HOME} element={<HomePage />} />
          </Routes>
          <RightSidebar />
        </BrowserRouter>
      </div>
    </AppProviders>
  );
}

export default App;
