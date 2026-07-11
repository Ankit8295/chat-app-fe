import ChatLayout from "@/layouts/chat-layout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <ChatLayout>{children}</ChatLayout>;
}
