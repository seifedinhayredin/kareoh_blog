import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Kaeroh Blog",
  description: "Kaeroh Blog App for uncovering insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}