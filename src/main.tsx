import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "./components/errors/error-boundary.tsx";
import { AuthProvider } from "./pages/auth/auth-provider.tsx";
import { setAuthorizationHeader } from "./api/client.ts";
import { storage } from "./utils/storage.ts";

const accessToken = storage.get("auth");
if (accessToken) {
  setAuthorizationHeader(accessToken);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider defaultIsLogged={!!accessToken}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
