// app/features/page.tsx
import { BookOpen, Sparkles, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const features = [
    {
      name: "AI Summaries",
      description: "Condense long documents into concise study notes in seconds.",
      icon: BookOpen,
      href: "/features/summaries",
    },
    {
      name: "Smart Flashcards",
      description: "Instantly generate interactive flashcards from your notes.",
      icon: Sparkles,
      href: "/features/flashcards",
    },
    {
      name: "Quizzes & Practice",
      description: "Turn your study material into quizzes to test your knowledge.",
      icon: ClipboardList,
      href: "/features/quizzes",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Explore Our Features</h1>
        <p className="text-lg text-muted-foreground">
          ScholarMate transforms your study workflow with AI-powered tools — designed
          to help you learn faster, retain more, and prepare smarter.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16 max-w-6xl w-full">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="cursor-pointer transition-transform hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link href="/get-started">
          <Button size="lg">Get Started Now</Button>
        </Link>
      </div>
    </div>
  );
}
