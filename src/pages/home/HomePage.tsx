import React from "react";
import { useI18n } from "../../context/I18nContex";

function HomePage() {
  const i18n = useI18n();
  return <div>{i18n.t("Hello")}</div>;
}

export default HomePage;
