import { useNavigate } from "react-router-dom";
import { createdUser } from "../../pages/signup/service";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type FocusEvent,
} from "react";
import { REGEXP } from "../../utils/constants";
import { useNotifications } from "./useNotifications";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataSend } = formData;
      await createdUser(dataSend);
      showSuccess("Usuario creado con éxito");
      navigate(`/adverts`, { replace: true });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error 
      ? error.message
      : "Error al crear el usuario."
      showError(errorMsg);
    } finally {
      setIsLoading(false)
    }
  };
  return {
    isLoading,
    formData,
    isFormValid,
    handleChange,
    handleSubmit,
    handleBlur,
    setIsLoading,
    showSuccess,
    showError,
  };
};
