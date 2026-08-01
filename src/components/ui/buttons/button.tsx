import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../../../cn.config";

export type ButtonVariant = "bordered" | "flat" | "text";
export type ButtonColor = "primary" | "secondary" | "tertiary" | "destructive";

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

const filledColorClasses: Record<ButtonColor, string> = {
  primary: "bg-primary border-primary text-black",
  secondary: "bg-secondary border-secondary text-foreground",
  tertiary: "bg-tertiary text-foreground border-tertiary",
  destructive: "bg-destructive border-destructive text-white",
};

const borderedColorClasses: Record<ButtonColor, string> = {
  primary: "bg-background border-primary text-primary",
  secondary: "bg-background border-foreground text-foreground",
  tertiary: "bg-background border-foreground text-foreground",
  destructive: "bg-background border-destructive text-destructive",
};

const textColorClasses: Record<ButtonColor, string> = {
  primary: "text-primary",
  secondary: "text-foreground",
  tertiary: "text-muted",
  destructive: "text-destructive",
};

const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(function Button(
  {
    variant = "flat",
    color = "primary",
    fullWidth = true,
    leftContent,
    rightContent,
    children,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  const isText = variant === "text";

  return (
    <button
      ref={ref}
      className={cn(
        "cursor-pointer outline-none transition-colors",
        "disabled:cursor-not-allowed",
        isText
          ? cn(
              "inline-flex w-fit items-center gap-1 bg-transparent p-0 font-medium",
              "hover:underline underline-offset-2",
              "disabled:text-disable-text disabled:no-underline",
              textColorClasses[color],
            )
          : cn(
              "horizontal-center gap-1 rounded-lg border-2 px-3 py-2 font-semibold transition-transform hover:opacity-95 active:scale-98",
              fullWidth ? "w-full" : "w-fit",
              "disabled:border-disable-bg disabled:bg-disable-bg disabled:text-disable-text",
              variant === "bordered"
                ? borderedColorClasses[color]
                : filledColorClasses[color],
            ),
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled && !isText && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/50 border-t-current" />
      )}
      {leftContent}
      {children}
      {rightContent}
    </button>
  );
});

export default Button;
