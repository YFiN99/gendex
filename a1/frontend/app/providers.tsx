"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WalletProvider } from "@/lib/genlayer/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Memastikan aplikasi sudah jalan di browser sebelum menampilkan komponen wallet
  useEffect(() => {
    setMounted(true);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Masukkan Project ID kamu di sini sebagai fallback
  const projectId = "422e04239eb1f0978776e7e34d261591";

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {/* Children hanya dirender setelah mounted agar ConnectButton muncul */}
        {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
      </WalletProvider>
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </QueryClientProvider>
  );
}
