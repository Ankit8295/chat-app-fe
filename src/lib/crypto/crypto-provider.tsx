"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGetMe } from "@/lib/queries/user/query";
import { hydrateIdentity } from "./identity";

type CryptoStatus = "loading" | "ready" | "locked";

type CryptoContextValue = {
  ready: boolean;
  status: CryptoStatus;
};

const CryptoContext = createContext<CryptoContextValue | null>(null);

export function CryptoProvider({ children }: { children: ReactNode }) {
  const { data: me } = useGetMe();
  const [status, setStatus] = useState<CryptoStatus>("loading");

  useEffect(() => {
    if (!me?.id) return;
    let cancelled = false;
    setStatus("loading");
    void hydrateIdentity(me.id).then((ok) => {
      if (!cancelled) setStatus(ok ? "ready" : "locked");
    });
    return () => {
      cancelled = true;
    };
  }, [me?.id]);

  const value = useMemo(
    () => ({
      ready: status === "ready",
      status,
    }),
    [status],
  );

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within CryptoProvider");
  }
  return context;
}
