import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ProgressBar } from "@/components/layout/ProgressBar";

export const metadata: Metadata = {
  title: "READY GO",
  description:
    "Digital agency focused on strategies, branding, and digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="ru">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Inter+Display:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/fonts/stylesheet.css" />
        </head>
        <body className="font-body antialiased bg-background text-foreground">
          <SmoothScrollProvider>
            <ProgressBar />
            {children}
          </SmoothScrollProvider>
          <Toaster />
          
        </body>
      </html>
    </>
  );
}
