"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Sparkles, HelpCircle } from "lucide-react";
import { TestimonialsCarousel } from "./learn-more/page";

const features = [
  {
    title: "AI Summaries",
    description: "Instantly generate concise, clear summaries from your study material.",
    icon: <BookOpen className="h-7 w-7 text-primary mb-2" />,
    href: "/features/summaries",
  },
  {
    title: "Smart Flashcards",
    description: "Create flashcards automatically to master concepts faster.",
    icon: <Sparkles className="h-7 w-7 text-primary mb-2" />,
    href: "/features/flashcards",
  },
  {
    title: "Quizzes & Practice",
    description: "Test your knowledge with AI-generated quizzes tailored to your material.",
    icon: <HelpCircle className="h-7 w-7 text-primary mb-2" />,
    href: "/features/quizzes",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 bg-gradient-to-b from-background to-muted/10">
      <main className="flex flex-col items-center gap-12 text-center max-w-4xl w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-primary">
            <Brain className="h-12 w-12" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              ScholarMate
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your AI-powered study companion — generate summaries, flashcards, and quizzes in seconds.
            Study smarter, not harder. 🚀
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 text-white hover:from-purple-500 hover:to-primary">
                <Sparkles className="mr-2 h-5 w-5" /> Get Started
              </Button>
            </Link>
            <Link href="/learn-more">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-6 sm:grid-cols-3 w-full">
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <Card className="shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center">
                  {f.icon}
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">{f.description}</CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Optional: Testimonials Carousel */}
        <TestimonialsCarousel />
      </main>

      {/* Footer */}
      <footer className="mt-16 w-full border-t pt-6 text-sm text-muted-foreground text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/get-started" className="hover:underline">
            Get Started
          </Link>
          <Link href="/learn-more" className="hover:underline">
            Learn More
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
        <p>Built with ❤️ using Next.js, Supabase, and Shadcn</p>
      </footer>
    </div>
  );
}
