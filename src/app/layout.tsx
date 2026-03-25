import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSuper - Comprehensive Financial Dashboard",
  description:
    "All-in-one financial superapp for personal finance, investments, crypto, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 w-full md:w-auto pt-16 md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
