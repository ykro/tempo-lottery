import type { Metadata } from "next";
import { Rye, Roboto_Slab } from "next/font/google";
import "./globals.css";

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tempo - Trail Run Lotería",
  description: "A trail running themed Lotería game.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${rye.variable} ${robotoSlab.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
