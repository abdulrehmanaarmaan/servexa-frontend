
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";

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
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider>
          <QueryProvider>
            {children}

            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                className: "border border-border",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
