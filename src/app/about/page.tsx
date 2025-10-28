"use client";

import { Mail, Github, Linkedin, Target, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <main className="flex flex-col gap-12 w-full max-w-5xl">
        {/* Hero Section */}
        <section className="text-center flex flex-col gap-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            About ScholarMate
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered study companion — built to transform the way students learn.  
            We simplify studying by turning your notes, documents, and textbooks into 
            clear summaries, flashcards, and quizzes.
          </p>
        </section>

        {/* Mission / Vision / Values */}
        <section className="grid gap-6 sm:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              To make learning faster and smarter by leveraging the power of AI for students worldwide.
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              A future where every learner has a personal AI tutor to guide them towards success.
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              Innovation, accessibility, and empowering students to achieve their full potential.
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col gap-6 text-center">
          <h2 className="text-3xl font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have feedback, ideas, or questions? We’d love to hear from you.  
            Reach out through any of the platforms below.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Button asChild variant="outline" size="lg">
              <a href="mailto:support@inayatalibalti100@gmail.com" className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Email
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/Inayat567" target="_blank" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://www.linkedin.com/in/inayatalii/" target="_blank" className="flex items-center gap-2">
                <Linkedin className="h-5 w-5" /> LinkedIn
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
