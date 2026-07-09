import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../../../cn.config";

export type ButtonVariant = "bordered" | "flat";
export type ButtonColor = "primary" | "secondary" | "tertiary" | "destructive";

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(function Button(
  {
    variant = "flat",
    color = "primary",
    fullWidth = true,
    leftContent,
    rightContent,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const colorClasses = {
    primary:
      variant === "bordered"
        ? "bg-background border-brand-light text-brand-light"
        : "bg-brand-light border-brand-light text-white",
    secondary:
      variant === "bordered"
        ? "bg-background border-foreground text-foreground"
        : "bg-secondary border-secondary text-foreground",
    tertiary:
      variant === "bordered"
        ? "bg-background border-foreground text-foreground"
        : "bg-tertiary text-foreground border-tertiary",
    destructive:
      variant === "bordered"
        ? "bg-background border-destructive text-destructive"
        : "bg-destructive border-destructive text-white",
  };

  const variantClasses = {
    bordered: "",
    flat: "",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "horizontal-center cursor-pointer gap-1 rounded-lg border-2 px-3 py-2 font-semibold transition-transform hover:opacity-95 active:scale-98",
        fullWidth ? "w-full" : "w-fit",
        colorClasses[color],
        variantClasses[variant],
        "disabled:cursor-not-allowed disabled:border-disable-bg disabled:bg-disable-bg disabled:text-disable-text",
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/50 border-t-current"></div>
      )}
      {children}
    </button>
  );
});

export default Button;
