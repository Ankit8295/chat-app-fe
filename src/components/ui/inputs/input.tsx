import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import Typography from "../typography/typography";
import CheckIcon from "@/icons/check";
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

export interface InputRightActionsProps {
  charsLeft?: number;
  onSave?: () => void;
  saveTitle?: string;
  saveIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function InputRightActions({
  charsLeft,
  onSave,
  saveTitle,
  saveIcon,
  children,
  className,
}: InputRightActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {charsLeft !== undefined && (
        <span className="text-xs text-muted font-medium select-none">
          {charsLeft}
        </span>
      )}
      {children}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="text-foreground hover:text-primary transition-colors cursor-pointer outline-none"
          title={saveTitle}
        >
          {saveIcon ?? <CheckIcon className="size-5" />}
        </button>
      )}
    </div>
  );
}

const CustomInputBase = forwardRef<HTMLInputElement, CustomInputProps>(
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
      disabled,
      readOnly,
      ...rest
    },
    ref,
  ) {
    const isReadOnlyOrDisabled = disabled || readOnly;

    const variantClasses = {
      default:
        "bg-background border border-foreground hover:border-foreground focus:border-foreground rounded-lg",
      bordered:
        "bg-background border-2 border-brand-light/50 hover:border-brand-light focus-within:border-brand-light rounded-lg",
      underlined: cn(
        "bg-transparent rounded-none transition-colors",
        isReadOnlyOrDisabled
          ? "border-b-2 border-transparent"
          : "border-b-2 border-primary focus-within:border-primary hover:border-primary",
      ),
    };

    return (
      <div
        className={cn(
          "flex flex-col gap-1",
          variant === "underlined" ? "text-foreground" : "text-brand-light",
          fullWidth ? "w-full" : "w-fit",
          classNames?.base,
        )}
      >
        {label && (
          <Typography
            variant="span"
            className={cn(
              variant === "underlined"
                ? "text-xs font-semibold text-muted tracking-wide"
                : "font-bold",
              classNames?.label,
            )}
          >
            {label}
          </Typography>
        )}
        <label
          className={cn(
            "relative flex items-center overflow-hidden transition-all duration-200",
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
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              "w-full overflow-hidden bg-transparent text-base font-medium outline-hidden placeholder:text-muted truncate",
              variant === "underlined"
                ? "px-0 py-1 text-foreground caret-primary"
                : "px-3 py-2 text-foreground caret-brand-light",
              isReadOnlyOrDisabled && "cursor-pointer select-none",
              leftContent && "pl-0",
              rightContent && "pr-0",
              classNames?.input,
            )}
            {...rest}
          />
          {rightContent && (
            <div
              className={cn(
                "horizontal-center gap-2 shrink-0",
                variant === "underlined" ? "pr-0 pl-2" : "pr-3",
                classNames?.rightContent,
              )}
            >
              {rightContent}
            </div>
          )}
        </label>
        {(helperText || error) && (
          <div
            className={cn(
              "text-xs mt-1 leading-relaxed",
              error ? "text-error" : "text-muted",
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

CustomInputBase.displayName = "CustomInput";

type CustomInputType = typeof CustomInputBase & {
  RightActions: typeof InputRightActions;
};

const CustomInput = CustomInputBase as CustomInputType;
CustomInput.RightActions = InputRightActions;

export default CustomInput;
