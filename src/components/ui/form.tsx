import { type FormEvent, type ReactNode } from "react";
import type { FormMethod } from "react-router-dom"; // solo si usas react-router

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: ReactNode;
  method?: FormMethod;
}

export const Form = ({
  onSubmit,
  className,
  children,
  method,
  ...rest
}: FormProps) => {
  return (
    <form method={method} onSubmit={onSubmit} className={className} {...rest}>
      {children}
    </form>
  );
};
