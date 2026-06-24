import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoalDesk AI",
  description: "AI-powered personal assistant for students",
};

import { Shell } from "@/components/layout/Shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hardcoded dark mode class for MVP as per PRD "dark-mode first"
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
