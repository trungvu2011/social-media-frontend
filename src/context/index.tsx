import type { ReactNode } from "react";
import I18nContextProvider from "./I18nContex";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <I18nContextProvider>{children}</I18nContextProvider>;
};
