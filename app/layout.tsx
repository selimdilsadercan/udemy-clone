import { Inter } from "next/font/google";
const font = Inter({ subsets: ["latin"] });
import "./globals.css";

import ClerkProvider from "@/providers/clerk-provider";
import QueryProvider from "@/providers/query-provider";
import ToastProvider from "@/providers/toast-provider";
import ConfettiProvider from "@/providers/confetti-provider";

export const metadata = {
  title: "Udemy Clone",
  description: "another clone with nextjs",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <QueryProvider>
          <ClerkProvider>
            <ToastProvider />
            <ConfettiProvider />
            {children}
          </ClerkProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
