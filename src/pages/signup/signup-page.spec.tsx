import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { SignUpPage } from "./signup-page";
import { createdUser } from "../../pages/signup/service";
import { useNotifications } from "../../components/hooks/useNotifications";
import { NotificationsProvider } from "../../components/ui/NotificationContext";

// Mocks
vi.mock("../../pages/signup/service", () => ({
  createdUser: vi.fn(),
}));

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

const mockCreatedUser = vi.mocked(createdUser);
const mockUseNotifications = vi.mocked(useNotifications);

const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

const renderSignUpPage = () =>
  render(
    <NotificationsProvider>
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    </NotificationsProvider>,
  );

describe("SignUpPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNotifications.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });
  });

  describe("Rendering", () => {
    test("renders signup form fields correctly", () => {
      renderSignUpPage();

      expect(
        screen.getByRole("heading", { name: /registro/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Nombre\s*\*/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Nombre de usuario *")).toBeInTheDocument();
      expect(screen.getByLabelText(/Email\s*\*/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Contraseña *")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Confirmar contraseña *"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /registrarse/i }),
      ).toBeDisabled();
    });
  });

  describe("Validation", () => {
    test("shows error when passwords do not match", async () => {
      renderSignUpPage();

      fireEvent.change(screen.getByLabelText("Nombre *"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText("Nombre de usuario *"), {
        target: { value: "tester" },
      });
      fireEvent.change(screen.getByLabelText("Email *"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByLabelText("Confirmar contraseña *"), {
        target: { value: "654321" },
      });

      fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          "Las contraseñas no coinciden.",
        );
      });
    });

    test("shows error if email is invalid on blur", async () => {
      renderSignUpPage();

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: "wrongemail" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("El email no es válido.");
      });
    });

    test("shows error if username is invalid on blur", async () => {
      renderSignUpPage();

      const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
      fireEvent.change(usernameInput, { target: { value: "a" } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          "El nombre de usuario no es válido.",
        );
      });
    });
  });

  describe("Submission", () => {
    test("creates user and navigates on success", async () => {
      mockCreatedUser.mockResolvedValueOnce({
        id: "123",
        email: "",
        username: "",
        createdAt: "",
      });

      renderSignUpPage();

      fireEvent.change(screen.getByLabelText("Nombre *"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText("Nombre de usuario *"), {
        target: { value: "tester" },
      });
      fireEvent.change(screen.getByLabelText("Email *"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByLabelText("Confirmar contraseña *"), {
        target: { value: "123456" },
      });

      fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

      await waitFor(() => {
        expect(mockCreatedUser).toHaveBeenCalledWith({
          name: "Test User",
          username: "tester",
          email: "test@example.com",
          password: "123456",
        });
        expect(mockShowSuccess).toHaveBeenCalledWith(
          "Usuario creado con éxito",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/adverts", {
          replace: true,
        });
      });
    });

    test("shows error on API failure", async () => {
      mockCreatedUser.mockRejectedValueOnce(new Error("API error"));

      renderSignUpPage();

      fireEvent.change(screen.getByLabelText("Nombre *"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText("Nombre de usuario *"), {
        target: { value: "tester" },
      });
      fireEvent.change(screen.getByLabelText("Email *"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Contraseña *"), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByLabelText("Confirmar contraseña *"), {
        target: { value: "123456" },
      });

      fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("API error");
      });
    });
  });
});
