import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import QueryProvider from "@/providers/QueryProvider";
import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Servexa",
    template: "%s | Servexa",
  },
  description: "Field Service Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        <QueryProvider>
          {children}

          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "#090d16",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}