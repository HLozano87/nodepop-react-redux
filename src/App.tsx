import { lazy, Suspense } from "react";
import { Layout } from "./components/layout/layout";
import { AdvertPage } from "./pages/adverts/advert-detail-page";
import { NewAdvertPage } from "./pages/adverts/new-advert-page";
import { LoginPage } from "./pages/auth/login-page";
import { AuthRoute } from "./pages/auth/require-auth";
import NotFoundPage from "./pages/not-found";
import { SignUpPage } from "./pages/signup/signup-page";
import { Routes, Route, Navigate, Outlet } from "react-router";
import { SpinnerLoadingText } from "./components/icons/spinner";

const AdvertsPage = lazy(() =>
  import("./pages/adverts/adverts-page").then((res) => ({
    default: res.AdvertsPage,
  })),
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Principal */}
        <Route
          index
          element={
            <Suspense
              fallback={
                <div className="items-center">
                  <SpinnerLoadingText text="Cargando anuncios..." />
                </div>
              }
            >
              <AuthRoute requireAuth={true} redirectTo="/login">
                <AdvertsPage />
              </AuthRoute>
            </Suspense>
          }
        />
        {/* Protegidas */}
        <Route
          path="/adverts"
          element={
            <AuthRoute requireAuth={true} redirectTo="/login">
              <Outlet />
            </AuthRoute>
          }
        >
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":id" element={<AdvertPage />} />
          <Route path="new" element={<NewAdvertPage />} />
        </Route>

        {/* Errores */}
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
