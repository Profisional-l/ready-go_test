
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";


const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: "READY GO",
  description:
    "Digital agency focused on strategies, branding, and digital solutions.",
  viewport: "width=device-width, initial-scale=1",
  creator: " ✿ sakura. — web agency | tg: @sakura_global ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="ru" className={`${inter.variable}`}>
        <head>
          <link rel="stylesheet" href="/fonts/stylesheet.css" />
        </head>
        <body className="font-body antialiased bg-background text-foreground">
          <SmoothScrollProvider>
            <ProgressBar />
            {children}
            <Toaster />
          </SmoothScrollProvider>
        </body>
      </html>
    </>
  );
}
