import AuthLayout from "@/layouts/auth-layout";
import { ReactNode } from "react";

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
