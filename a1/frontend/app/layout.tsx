import "./globals.css";
import { Providers } from "./providers"; // Kita akan buat file ini setelah ini

export const metadata = {
  title: "GenDEX - Swap",
  description: "Swap Gold to Base on GenLayer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-black text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
