import "./globals.css";

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
      <head>
        {/* Load SDK GenLayer */}
        <script 
          src="https://cdn.jsdelivr.net/npm/genlayer-js-sdk@latest/dist/index.bundle.js"
          defer
        ></script>
      </head>
      <body suppressHydrationWarning className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}