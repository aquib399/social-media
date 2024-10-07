import ReactQueryProvider from "./reactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Drift",
    default: "Drift",
  },
  description: "A Friendly Social Media Platform for Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ReactQueryProvider>
          <ThemeProvider
            enableSystem
            disableTransitionOnChange
            defaultTheme="system"
            attribute="class"
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
