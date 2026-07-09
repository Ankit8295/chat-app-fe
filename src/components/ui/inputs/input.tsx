import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import Typography from "../typography/typography";
import { cn } from "../../../../cn.config";

export type InputVariant = "default" | "bordered" | "underlined";

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  variant?: InputVariant;
  helperText?: ReactNode;
  error?: string;
  fullWidth?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  classNames?: {
    base?: string;
    label?: string;
    input?: string;
    inputWrapper?: string;
    helperWrapper?: string;
    leftContent?: string;
    rightContent?: string;
  };
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  function CustomInput(
    {
      className,
      label,
      variant = "default",
      helperText,
      error,
      fullWidth = true,
      leftContent,
      rightContent,
      classNames,
      ...rest
    },
    ref,
  ) {
    const variantClasses = {
      default:
        "bg-background border border-foreground hover:border-foreground focus:border-foreground",
      bordered:
        "bg-background border-2 border-brand-light/50 hover:border-brand-light focus-within:border-brand-light",
      underlined:
        "bg-transparent border-b-2 border-foreground rounded-none hover:border-foreground focus:border-foreground",
    };

    return (
      <div
        className={cn(
          "flex flex-col gap-1 text-brand-light",
          fullWidth ? "w-full" : "w-fit",
          classNames?.base,
        )}
      >
        {label && (
          <Typography
            variant="span"
            className={cn("font-bold", classNames?.label)}
          >
            {label}
          </Typography>
        )}
        <label
          className={cn(
            "relative flex items-center overflow-hidden rounded-lg transition-all duration-200",
            variantClasses[variant],
            error && "border-error hover:border-error focus:border-error",
            classNames?.inputWrapper,
          )}
        >
          {leftContent && (
            <div
              className={cn("horizontal-center pl-3", classNames?.leftContent)}
            >
              {leftContent}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full overflow-hidden bg-transparent px-3 py-2 text-base font-medium caret-brand-light outline-hidden placeholder:text-foreground/50",
              leftContent && "pl-0",
              rightContent && "pr-0",
              classNames?.input,
            )}
            {...rest}
          />
          {rightContent && (
            <div
              className={cn("horizontal-center pr-3", classNames?.rightContent)}
            >
              {rightContent}
            </div>
          )}
        </label>
        {(helperText || error) && (
          <div
            className={cn(
              "text-sm",
              error ? "text-error" : "text-foreground/70",
              classNames?.helperWrapper,
            )}
          >
            {error ? error : helperText}
          </div>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
