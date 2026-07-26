"use client";
import React, { useRef } from "react";
import CustomInput, { CustomInputProps } from "./input";
import { EyeIcon } from "@/icons/eye";
import { EyeSlashedIcon } from "@/icons/eye-slashed";

export default function PasswordInput(props: CustomInputProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const toggleVisibility = () => {
    if (passwordInputRef.current) {
      const cursorPosition = passwordInputRef.current.selectionStart ?? 0;
      setIsVisible((prev) => !prev);

      setTimeout(() => {
        if (passwordInputRef.current) {
          passwordInputRef.current.setSelectionRange(
            cursorPosition,
            cursorPosition,
          );
          passwordInputRef.current.focus();
        }
      }, 0);
    }
  };
  return (
    <CustomInput
      ref={passwordInputRef}
      fullWidth
      variant="bordered"
      rightContent={
        <button
          className="focus:outline-none cursor-pointer text-muted hover:text-primary transition-colors shrink-0"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeIcon className="size-5 fill-current" />
          ) : (
            <EyeSlashedIcon className="size-5 fill-current" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
}
