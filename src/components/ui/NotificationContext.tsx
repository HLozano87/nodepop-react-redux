// NotificationsContext.tsx
import { createContext, type ReactNode } from "react";
import { useMessages } from "../hooks/useMessage";
import { Notifications } from "./notification";

type NotificationsContextType = {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
};

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { successMessage, errorMessage, showSuccess, showError } =
    useMessages();

  return (
    <NotificationsContext.Provider value={{ showSuccess, showError }}>
      {/* Notificaciones globales */}
      <div className="fixed top-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2">
        <Notifications
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      </div>
      {children}
    </NotificationsContext.Provider>
  );
}
