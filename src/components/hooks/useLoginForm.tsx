import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import { useLoginAction } from "../../store/auth/hooks";
import { useNotifications } from "./useNotifications";
import type { CredentialUser } from "../../pages/auth/types-auth";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const loginAction = useLoginAction();
  const { showSuccess, showError } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<CredentialUser>({
    email: "",
    password: "",
    remember: false,
  });

  const isLoginValid =
    credentials.email.trim() !== "" && credentials.password.trim() !== "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "email" && { password: "" }),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const token = await loginAction(credentials);
      if (credentials.remember) {
        storage.set("auth", token);
      } else {
        storage.remove("auth");
      }

      showSuccess("¡Login exitoso!");
      navigate("/adverts", { replace: true });
    } catch (error) {
      showError("Credenciales incorrectas.");
      setCredentials((prev) => ({
        ...prev,
        email: "",
        password: "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    isLoginValid,
    handleChange,
    handleSubmit,
  };
};
