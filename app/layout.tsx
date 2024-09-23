import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import { Toaster } from "@/lib/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ModeToggle } from "@/lib/components/mode-toggle";
import { TasksProvider } from "@/lib/providers/tasks-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(roboto.className)}>
        <ThemeProvider>
          <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-border px-4 backdrop-blur-md">
            <Button variant="link" asChild>
              <Link href="/">TODO App</Link>
            </Button>

            <section className="flex items-center gap-4">
              <nav className="flex items-center justify-between p-4"></nav>
              <ModeToggle />
            </section>
          </header>

          <TasksProvider>{children}</TasksProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
