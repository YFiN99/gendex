"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WalletProvider } from "@/lib/genlayer/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {/* Render null dulu agar tidak error saat loading awal */}
        {mounted ? children : null}
      </WalletProvider>
      <Toaster position="top-right" theme="dark" richColors />
    </QueryClientProvider>
  );
}