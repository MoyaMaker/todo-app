import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const roboto = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODO App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, "bg-zinc-900 text-gray-200")}>
        {children}
      </body>
    </html>
  );
}
