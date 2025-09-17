import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/provider/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScholarMate",
  description: "Your AI-powered study companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <header className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-bold">ScholarMate</h1>
            <ThemeToggle />
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
