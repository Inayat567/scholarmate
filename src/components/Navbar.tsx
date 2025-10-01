"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, BookOpen, Sparkles, ClipboardList } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/get-started" },
    { name: "Learn More", href: "/learn-more" },
    { name: "About Us", href: "/about" },
  ];

  // Check if current path starts with /features
  const isFeaturesActive = pathname.startsWith("/features");

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Logo */}
      <Link href="/" className="text-lg font-bold text-primary">
        ScholarMate
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === item.href ? "text-primary" : "text-foreground"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Features Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              isFeaturesActive ? "text-primary" : "text-foreground"
            }`}
          >
            Features <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/features/summaries" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                AI Summaries
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/features/flashcards" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Smart Flashcards
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/features/quizzes" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Quizzes & Practice
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Theme Toggle */}
      <ThemeToggle />
    </header>
  );
}
