import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "./login-page";
import { storage } from "../../utils/storage";
import { useNotifications } from "../../components/hooks/useNotifications";
import { useLoginAction } from "../../store/auth/hooks";
import { NotificationsProvider } from "../../components/ui/NotificationContext";
import { vi } from "vitest";

// Mocks
vi.mock("../../utils/storage");
vi.mock("../../store/auth/hooks");
vi.mock("../../components/hooks/useNotifications", () => ({
  useNotifications: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockStorage = vi.mocked(storage);
const mockUseNotifications = vi.mocked(useNotifications);
const mockUseLoginAction = vi.mocked(useLoginAction);

const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

const renderLoginPage = () =>
  render(
    <NotificationsProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </NotificationsProvider>,
  );

describe("LoginPage with Redux", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoginAction.mockReturnValue(vi.fn());
    mockUseNotifications.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    mockStorage.set.mockReturnValue(undefined);
    mockStorage.remove.mockReturnValue(undefined);
  });

  describe("Rendering", () => {
    test("renders login form fields correctly", () => {
      renderLoginPage();

      expect(
        screen.getByRole("heading", { name: /login/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /email/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Contraseña *")).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /recuérdame/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /iniciar sesión/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Form validation", () => {
    test("disables submit button initially", () => {
      renderLoginPage();

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      expect(submitButton).toBeDisabled();
    });

    test("enables submit button when both email and password are filled", async () => {
      renderLoginPage();

      fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "password123" },
      });

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      await waitFor(() => expect(submitButton).toBeEnabled());
    });
  });

  describe("Password toggle", () => {
    test("toggles password visibility", () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(
        "Contraseña *",
      ) as HTMLInputElement;
      const toggleButton = screen.getByRole("button", {
        name: /mostrar contraseña/i,
      });

      expect(passwordInput.type).toBe("password");

      fireEvent.click(toggleButton);

      expect(passwordInput.type).toBe("text");
      expect(
        screen.getByRole("button", { name: /ocultar contraseña/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Form submission", () => {
    test("calls login action and navigates on success", async () => {
      const mockLogin = vi.fn().mockResolvedValue("mock-token");
      mockUseLoginAction.mockReturnValue(mockLogin);

      renderLoginPage();

      fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "password123" },
      });

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          remember: false,
        });
        expect(mockShowSuccess).toHaveBeenCalledWith("¡Login exitoso!");
        expect(mockNavigate).toHaveBeenCalledWith("/adverts", {
          replace: true,
        });
      });
    });

    test("stores token if remember me is checked", async () => {
      const mockLogin = vi.fn().mockResolvedValue("mock-token");
      mockUseLoginAction.mockReturnValue(mockLogin);

      renderLoginPage();

      fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("checkbox", { name: /recuérdame/i }));

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStorage.set).toHaveBeenCalledWith("auth", "mock-token");
      });
    });

    test("shows error message and clears form on login failure", async () => {
      const mockLogin = vi
        .fn()
        .mockRejectedValue(new Error("Invalid credentials"));
      mockUseLoginAction.mockReturnValue(mockLogin);

      renderLoginPage();

      fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
        target: { value: "wrong@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "wrongpassword" },
      });

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("Credenciales incorrectas.");
      });

      await waitFor(() => {
        const emailInput = screen.getByRole("textbox", {
          name: /email/i,
        }) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(
          "Contraseña *",
        ) as HTMLInputElement;
        expect(emailInput.value).toBe("");
        expect(passwordInput.value).toBe("");
      });
    });
  });
});
