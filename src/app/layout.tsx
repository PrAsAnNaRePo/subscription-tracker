import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-[#050505] text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
