import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  className,
  variant,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(`btn-${variant}`, className, {
        "cursor-not-allowed opacity-50": disabled,
        "cursor-pointer": !disabled,
      })}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
