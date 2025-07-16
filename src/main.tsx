import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "./components/errors/error-boundary.tsx";
import { setAuthorizationHeader } from "./api/client.ts";
import { storage } from "./utils/storage.ts";
import { configureStore } from "./store/index.ts";
import { Provider } from "react-redux";

const accessToken = storage.get("auth");
if (accessToken) {
  setAuthorizationHeader(accessToken);
}
const store = configureStore({ auth: !!accessToken });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
