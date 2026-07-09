"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-porvider";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
