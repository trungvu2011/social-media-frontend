import type { ReactNode } from "react";
import I18nContextProvider from "./I18nContex";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <I18nContextProvider>
      <SocketProvider>{children}</SocketProvider>
    </I18nContextProvider>
  );
};
