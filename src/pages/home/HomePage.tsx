import NavBar from "../../components/NavBar";
import { useI18n } from "../../context/I18nContex";

function HomePage() {
  const i18n = useI18n();
  return (
    <div className="flex flex-col p-16">
      <NavBar />
    </div>
  );
}

export default HomePage;
