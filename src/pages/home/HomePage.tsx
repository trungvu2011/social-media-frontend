import { useState } from "react";
import Sidebar from "../../components/SideBar";
import { useI18n } from "../../context/I18nContex";

function HomePage() {
  const i18n = useI18n();
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default HomePage;
