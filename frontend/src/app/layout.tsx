import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart To-Do List",
  description: "AI-powered task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
              <div className="flex w-full h-16 items-center justify-between p-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/" className="text-lg font-bold transition-colors hover:text-primary">
                    Smart To-Do
                  </Link>
                  <NavigationMenu>
                    <NavigationMenuList className="flex items-center space-x-4">
                      <NavigationMenuItem>
                        <Link href="/dashboard" passHref>
                          <div className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                            Dashboard
                          </div>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/task-editor" passHref>
                          <div className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                            Task Editor
                          </div>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/context-input" passHref>
                          <div className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                            Context Input
                          </div>
                        </Link>
                      </NavigationMenuItem>
                      {/* <NavigationMenuItem>
                        <Link href="/ai-chat" passHref>
                          <div className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                            AI Chat
                          </div>
                        </Link>
                      </NavigationMenuItem> */}
                      
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4">
                      <SheetHeader>
                        <SheetTitle className="text-2xl font-bold mb-4">Navigation</SheetTitle>
                      </SheetHeader>
                      <nav className="flex flex-col space-y-2">
                        <Link href="/dashboard" className="text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
                          Dashboard
                        </Link>
                        <Link href="/task-editor" className="text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
                          Task Editor
                        </Link>
                        <Link href="/context-input" className="text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
                          Context Input
                        </Link>
                        <Link href="/ai-chat" className="text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
                          AI Chat
                        </Link>
                        
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <Link href="/" className="text-lg font-bold transition-colors hover:text-primary ml-4">
                    Smart To-Do
                  </Link>
                </div>

                <ModeToggle />
              </div>
            </header>
            <main className="flex-1 bg-transparent">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}