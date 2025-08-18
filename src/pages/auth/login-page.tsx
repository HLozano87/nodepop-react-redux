import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { SpinnerLoadingText } from "../../components/icons/spinner";
import { Input } from "../../components/ui/formFields";
import { Form } from "../../components/ui/form";
import { useLoginForm } from "../../components/hooks/useLoginForm";

export const LoginPage = () => {
  const { credentials, isLoading, isLoginValid, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="title mb-6 text-center text-2xl font-bold text-emerald-700">
        Login
      </h1>

      <Form
        onSubmit={handleSubmit}
        className="space-y-5"
        initialValue={{
          email: credentials.email,
          password: credentials.password,
          remember: credentials.remember ?? false,
        }}
      >
        <Input
          label="Email"
          className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={credentials.email}
          required
        />

        <Input
          label="Contraseña"
          className="mt-1 w-full rounded-xl border px-4 py-2 text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
          required
          value={credentials.password}
          onChange={handleChange}
        />

        <div className="input-login flex items-center justify-between text-sm">
          <label htmlFor="remember" className="flex items-center">
            <Input
              className="form-checkbox mr-2"
              name="remember"
              type="checkbox"
              id="remember"
              checked={credentials.remember}
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
      </Form>

      <p className="mt-6 text-center text-sm text-emerald-900">
        ¿No tienes cuenta?
        <Link to="/signup" className="text-emerald-600 hover:underline">
          <span className="px-2">Regístrate</span>
        </Link>
      </p>
    </div>
  );
};
