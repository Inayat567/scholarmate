import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/provider/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster
            position="top-right"
            richColors
            expand={true}
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: "#1e293b",
                color: "#fff",
                padding: "12px 16px",
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
              className: "shadow-lg backdrop-blur-md",
            }}
          />        </ThemeProvider>
      </body>
    </html>
  );
}
