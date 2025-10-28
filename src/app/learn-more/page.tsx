// app/learn-more/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock, FileText, CheckCircle, Quote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const testimonials = [
  {
    text: "ScholarMate helped me prepare for finals in half the time. The flashcards feature is a game-changer!",
    author: "Sarah K., University Student",
  },
  {
    text: "As a teacher, I use ScholarMate to create quizzes for my students. It makes lesson planning effortless.",
    author: "Mr. Ahmed, High School Teacher",
  },
  {
    text: "I upload my research papers and get clean summaries instantly. ScholarMate saves me hours every week.",
    author: "Dr. Emily R., Researcher",
  },
  {
    text: "I love how easy it is to drag & drop my study files. ScholarMate turns them into useful learning tools.",
    author: "James L., Graduate Student",
  },
];

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  // Handle swipe gesture
  const handleSwipe = (direction: number) => {
    if (direction > 0) {
      // Swipe right → previous
      setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else if (direction < 0) {
      // Swipe left → next
      setIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold mb-8">What Our Users Say</h2>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleSwipe(1); // swipe right
              if (info.offset.x < -100) handleSwipe(-1); // swipe left
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-md cursor-grab active:cursor-grabbing"
          >
            <Quote className="h-6 w-6 text-primary mx-auto mb-4" />
            <p className="italic text-lg text-muted-foreground">“{testimonial.text}”</p>
            <p className="mt-4 font-semibold">{testimonial.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "bg-primary w-4" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}


export default function LearnMorePage() {
    return (
        <div className="min-h-screen px-6 py-16 flex flex-col items-center">
            {/* Hero Section */}
            <div className="max-w-3xl text-center space-y-6">
                <div className="flex justify-center">
                    <Brain className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">Why Choose ScholarMate?</h1>
                <p className="text-lg text-muted-foreground">
                    We designed ScholarMate to make studying smarter, faster, and more effective.
                    Whether you’re a student, researcher, or lifelong learner, our AI tools help
                    you master knowledge with ease.
                </p>
            </div>

            {/* Value Highlights */}
            <div className="grid gap-6 sm:grid-cols-2 mt-16 max-w-4xl w-full">
                <Card>
                    <CardHeader>
                        <Clock className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>Save Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Generate summaries, flashcards, and quizzes instantly — no more wasted hours.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <FileText className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>All Formats Supported</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Upload PDFs — ScholarMate adapts to your material.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CheckCircle className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>Boost Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Learn with active recall, spaced repetition, and interactive practice.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Brain className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>AI-Powered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Smarter than traditional tools — ScholarMate learns with you, not just for you.
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mt-20 w-full">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is ScholarMate free to use?</AccordionTrigger>
                        <AccordionContent>
                            ScholarMate offers a free plan with core features. Premium plans unlock
                            advanced tools, unlimited uploads, and priority access.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>What file types are supported?</AccordionTrigger>
                        <AccordionContent>
                            You can only upload PDFs
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Who can use ScholarMate?</AccordionTrigger>
                        <AccordionContent>
                            Students, educators, researchers, and professionals — anyone looking to
                            learn faster and retain more knowledge.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Do I need technical skills?</AccordionTrigger>
                        <AccordionContent>
                            Not at all! ScholarMate is designed to be simple, intuitive, and easy to use
                            right from the start.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Testimonials */}
            <TestimonialsCarousel />
            {/* CTA */}
            <div className="mt-16 text-center">
                <Link href="/get-started">
                    <Button size="lg">Get Started with ScholarMate</Button>
                </Link>
            </div>
        </div>
    );
}
