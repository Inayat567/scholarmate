import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <main className="flex flex-col items-center gap-10 text-center max-w-2xl">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-10 w-10" />
            <h1 className="text-4xl font-bold">ScholarMate</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your AI-powered study companion — summaries, flashcards, and quizzes in seconds.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Button size="lg">
            <Sparkles className="mr-2 h-5 w-5" /> Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid gap-6 sm:grid-cols-2 w-full">
          <Card>
            <CardHeader>
              <BookOpen className="h-6 w-6 text-primary mb-2" />
              <CardTitle>AI Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              Instantly generate concise, clear summaries from your study material.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Smart Flashcards</CardTitle>
            </CardHeader>
            <CardContent>
              Create flashcards automatically to master concepts faster.
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 text-sm text-muted-foreground">
        Built with ❤️ using Next.js, Supabase, and Shadcn
      </footer>
    </div>
  );
}
