import type { ReactNode } from "react";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SocketProvider>{children}</SocketProvider>
  );
};
