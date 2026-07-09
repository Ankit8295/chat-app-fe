import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <main className="relative mx-auto h-dvh w-full max-w-[1920px] bg-surface">
      {children}
    </main>
  );
}
