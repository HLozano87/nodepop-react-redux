import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { Button } from "../../components/Button";
import { createdUser } from "./service";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../../components/hooks/useMessage";
import { Notifications } from "../../components/Notifications";
import { REGEXP } from "../../utils/constants";

export const SignUpPage = () => {
  const { successMessage, errorMessage, showSuccess, showError } =
    useMessages();

  //TODO Component form
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      name === "username" || name === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleBlur = ({
    target: { name, value },
  }: FocusEvent<HTMLInputElement>) => {
    if (name === "email") {
      if (!REGEXP.email.test(value)) {
        showError("El email no es válido.");
      } else {
        showError("");
      }
    } else if (name === "username") {
      if (!REGEXP.username.test(value)) {
        showError("El nombre de usuario no es válido.");
      } else {
        showError("");
      }
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    REGEXP.email.test(formData.email.trim()) &&
    REGEXP.username.test(formData.username.trim()) &&
    formData.password.trim() !== "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError("Las contraseñas no coinciden.");
      return;
    }

    if (!formData.name || !formData.username || !formData.email) {
      showError("Por favor rellene todos los campos.");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataSend } = formData;
      await createdUser(dataSend);

      showSuccess("Usuario creado con éxito");
      navigate(`/adverts`, { replace: true });
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      showError("Error al crear el usuario.");
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="title">Registrarse</h1>

      <Notifications
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-emerald-900"
          >
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            pattern="^[a-zA-Z0-9]{4,}$"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="text-sm font-medium text-emerald-900"
          >
            Nombre de usuario <span className="text-red-600">*</span>
          </label>

          <input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="text"
            id="username"
            name="username"
            minLength={4}
            value={formData.username}
            placeholder="username"
            onChange={handleChange}
          />
          {formData.username.trim().length > 0 &&
            formData.username.length < 4 && (
              <p className="text-sm text-red-600">
                El username debe tener minimo 4 caracteres
              </p>
            )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-emerald-900"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            pattern="/^\w{4,}([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-emerald-900"
          >
            Password <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            autoComplete="false"
            minLength={6}
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-emerald-900"
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="password"
            id="password-confirm"
            name="confirmPassword"
            placeholder="Confirm password"
            autoComplete="false"
            minLength={6}
            required
            onChange={handleChange}
          />
        </div>

        <Button type="submit" variant="primary" disabled={!isFormValid}>
          Registrar
        </Button>
      </form>
    </div>
  );
};
