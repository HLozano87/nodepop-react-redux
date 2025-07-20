import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

export const Input = ({
  id,
  type,
  name,
  onChange,
  required,
  label,
  ...props
}: InputProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-emerald-900">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};
