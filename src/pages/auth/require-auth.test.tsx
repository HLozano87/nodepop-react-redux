import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthRoute } from "./require-auth";
import * as AuthContext from "./context"; // Para mockear useAuth

describe("AuthRoute component", () => {
  const ChildComponent = () => <div>Contenido protegido</div>;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra los hijos cuando requireAuth=true y usuario está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: true, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <AuthRoute requireAuth={true}>
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("redirige a /login cuando requireAuth=true y usuario NO está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: false, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/login" element={<div>Página Login</div>} />
          <Route
            path="/private"
            element={
              <AuthRoute requireAuth={true}>
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Página Login")).toBeInTheDocument();
  });

  it("redirige a redirectTo personalizado si está definido y usuario no está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: false, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/custom-redirect" element={<div>Redirect Personalizado</div>} />
          <Route
            path="/private"
            element={
              <AuthRoute requireAuth={true} redirectTo="/custom-redirect">
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Redirect Personalizado")).toBeInTheDocument();
  });

  it("muestra los hijos cuando requireAuth=false y usuario NO está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: false, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route
            path="/signup"
            element={
              <AuthRoute requireAuth={false}>
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("redirige a /adverts cuando requireAuth=false y usuario está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: true, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/adverts" element={<div>Página Adverts</div>} />
          <Route
            path="/signup"
            element={
              <AuthRoute requireAuth={false}>
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Página Adverts")).toBeInTheDocument();
  });

  it("redirige a redirectTo personalizado cuando requireAuth=false y usuario está logueado", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({ isLogged: true, onLogin: () => {}, onLogout: () => {} });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/custom-redirect" element={<div>Redirect Personalizado</div>} />
          <Route
            path="/signup"
            element={
              <AuthRoute requireAuth={false} redirectTo="/custom-redirect">
                <ChildComponent />
              </AuthRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Redirect Personalizado")).toBeInTheDocument();
  });
});