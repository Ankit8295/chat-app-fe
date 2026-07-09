"use client";
import { useFormStatus } from "react-dom";
import Button, { CustomButtonProps } from "./button";

export default function SubmitButton({ children, ...rest }: CustomButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button color="primary" type="submit" disabled={pending} {...rest}>
      {children}
    </Button>
  );
}
