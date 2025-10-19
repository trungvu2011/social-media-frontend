import { useState } from "react";
import LeftSidebar from "../../components/LeftSideBar";
import { useI18n } from "../../context/I18nContex";
import Header from "../../components/Header";
import RightSidebar from "../../components/RightSideBar";

function HomePage() {
  const i18n = useI18n();
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="border border-red-500 bg-gray-50">
      <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <RightSidebar />
      <Header />
    </div>
  );
}

export default HomePage;
