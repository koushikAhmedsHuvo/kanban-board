import type { Metadata } from "next";
import { Toaster } from "sonner";

import "@/env";
import { AppProvider } from "@/providers/app-provider";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A focused workspace for organizing work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AppProvider>{children}</AppProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
