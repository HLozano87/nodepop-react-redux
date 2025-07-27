import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { storage } from "../../utils/storage";
import { Link, useNavigate } from "react-router-dom";
import { Notifications } from "../../components/ui/notification";
import { useMessages } from "../../components/hooks/useMessage";
import type { CredentialUser } from "./types-auth";
import clsx from "clsx";
import { EyeShow, EyeHide } from "../../components/icons/eyes";
import { SpinnerLoadingText } from "../../components/icons/spinner";
import { Input } from "../../components/ui/formFields";
import { useLoginAction } from "../../store/auth/hooks";

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginAction = useLoginAction();
  const { successMessage, errorMessage, showSuccess, showError } =
    useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credential, setCredentials] = useState<CredentialUser>(() => {
    const saved = storage.get("auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          email: parsed.email || "",
          password: "",
          remember: true,
        };
      } catch (error) {
        console.error("Credentials not valid", error);
        showError(errorMessage);
      }
    }
    return {
      email: "",
      password: "",
      remember: false,
    };
  });

  const isLoginValid =
    credential.email.trim() !== "" && credential.password.trim() !== "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const token = await loginAction(credential);
      if (credential.remember) {
        storage.set("auth", token);
      } else {
        storage.remove("auth");
      }

      showSuccess("¡Login exitoso!");
      navigate("/adverts", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showError("Credenciales incorrectas.");
      setCredentials((prev) => ({
        ...prev,
        email: "",
        password: "",
      }));
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = event.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "email" ? { password: "" } : ""),
    }));
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="title mb-6 text-center text-2xl font-bold text-emerald-700">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Notifications
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
          <label
            htmlFor="email"
            className="block text-sm font-medium text-emerald-900"
          >
            Email
          </label>
          <Input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={credential.email}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-emerald-900"
          >
            Contraseña
          </label>
          <div className="relative">
            <Input
              className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              required
              value={credential.password}
              onChange={handleChange}
            />
            <Button
              type="button"
              className={clsx(
                "absolute top-1/2 right-3 text-gray-400 transition-colors",
                "-translate-y-1/3",
                showPassword && "hover:text-emerald-600",
                !showPassword && "hover:text-rose-600",
              )}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeHide /> : <EyeShow />}
            </Button>
          </div>
        </div>

        <div className="input-login flex items-center justify-between text-sm">
          <label className="flex items-center">
            <Input
              className="form-checkbox mr-2"
              name="remember"
              type="checkbox"
              id="remember"
              checked={credential.remember}
              onChange={handleChange}
            />
            Recuérdame
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!isLoginValid || isLoading}
          aria-label="Iniciar sesión"
          title="Iniciar sesión"
        >
          {isLoading ? (
            <SpinnerLoadingText text="Iniciando sesión..." />
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-emerald-900">
        ¿No tienes cuenta?
        <Link to="/signup" className="text-emerald-600 hover:underline">
          <span className="px-2">Regístrate</span>
        </Link>
      </p>
    </div>
  );
};
