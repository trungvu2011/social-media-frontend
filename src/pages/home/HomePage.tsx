import NavBar from "../../components/NavBar";
import { useI18n } from "../../context/I18nContex";
import LoginForm from "../auth/LoginPage";
import RegisterForm from "../../components/RegisterForm";

function HomePage() {
  const i18n = useI18n();
  return (
    <div className="flex flex-col p-16">
      {/* <NavBar /> */}
      <LoginForm/>
      {/* <RegisterForm/> */}
    </div>
  );
}

export default HomePage;
