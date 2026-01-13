"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WalletProvider } from "@/lib/genlayer/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Mencegah error Hydration: memastikan hanya render di browser
  const [mounted, setMounted] = useState(false);

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

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {/* Hanya render children jika sudah di client side agar tombol wallet muncul */}
        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      </WalletProvider>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        offset="80px"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            boxShadow: '0 8px 32px hsl(var(--background) / 0.8)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
