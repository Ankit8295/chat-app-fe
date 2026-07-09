import { ReactNode } from "react";
import { cn } from "@/../cn.config";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div
        className={cn(
          "w-full max-w-lg",
          "bg-card-bg backdrop-blur-sm max-md:bg-transparent max-md:backdrop-blur-none",
          "rounded-2xl shadow-2xl max-md:shadow-none",
          "p-8 max-md:px-1 max-md:py-2",
          "border border-card-border",
          "relative overflow-hidden",
        )}
      >
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
