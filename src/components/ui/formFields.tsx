import React, { useState } from "react";
import { EyeShow, EyeHide } from "../icons/eyes";
import clsx from "clsx";
import { Button } from "./button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
}

export const Input = ({
  id,
  name,
  type,
  label,
  required,
  labelClassName,
  value,
  onChange,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "text-sm font-medium text-emerald-900",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          className={clsx(
            "w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none",
            isPassword && "pr-10",
          )}
          {...props}
        />
        {isPassword && (
          <Button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-emerald-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeHide /> : <EyeShow />}
          </Button>
        )}
      </div>
    </div>
  );
};
