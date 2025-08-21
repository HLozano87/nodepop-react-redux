import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/formFields";
import { Form } from "../../components/ui/form";
import { Page } from "../../components/layout/page";
import { useSignUp } from "../../components/hooks/useSignUp";
import { SpinnerLoadingText } from "../../components/icons/spinner";

export const SignUpPage = () => {
  const { formData, isFormValid, isLoading, handleChange, handleSubmit, handleBlur } =
    useSignUp();
    
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
            required
            minLength={4}
            value={formData.username}
            placeholder="Nombre de usuario"
            onChange={handleChange}
            onBlur={handleBlur}
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
            {isLoading ? (
              <SpinnerLoadingText text="Procesando..." />) : ("Registrarse")}
          </Button>
        </Form>
      </Page>
    </div>
  );
};
