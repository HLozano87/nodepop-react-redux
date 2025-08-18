import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { Button } from "../../components/ui/button";
import { createdUser } from "./service";
import { useNavigate } from "react-router-dom";
import { REGEXP } from "../../utils/constants";
import { Input } from "../../components/ui/formFields";
import { Form } from "../../components/ui/form";
import { Page } from "../../components/layout/page";
import { useNotifications } from "../../components/hooks/useNotifications";

export const SignUpPage = () => {
  const { showSuccess, showError } = useNotifications();

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
      name === "username" || name === "email"
        ? value.toLowerCase().trim()
        : value.trim();
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
    formData.name !== "" &&
    REGEXP.email.test(formData.email) &&
    REGEXP.username.test(formData.username) &&
    formData.password !== "";

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
      <Page title={"Registro"}>
        <Form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="text"
            id="name"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{4,}$"
            required
          />

          <Input
            label="Nombre de usuario"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="text"
            id="username"
            name="username"
            minLength={4}
            value={formData.username}
            placeholder="Nombre de usuario"
            onChange={handleChange}
            aria-invalid={formData.username.length < 4}
          />
          {formData.username.trim().length > 0 &&
            formData.username.length < 4 && (
              <p className="text-sm text-red-600">
                El username debe tener minimo 4 caracteres
              </p>
            )}

          <Input
            label="Email"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Su correo electronico"
            pattern="^\w{4,}([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Input
            label="Contraseña"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="password"
            id="password"
            name="password"
            placeholder="Introduzca su contraseña"
            autoComplete="off"
            minLength={6}
            required
            onChange={handleChange}
          />

          <Input
            label="Confirmar contraseña"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="password"
            id="password-confirm"
            name="confirmPassword"
            placeholder="Confirme la contraseña"
            autoComplete="off"
            minLength={6}
            required
            onChange={handleChange}
          />

          <Button type="submit" variant="primary" disabled={!isFormValid}>
            Registrarse
          </Button>
        </Form>
      </Page>
    </div>
  );
};
