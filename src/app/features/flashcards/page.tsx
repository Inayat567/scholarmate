"use client";

import { useState, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Flashcard {
    question: string;
    answer: string;
}

export default function FlashcardsPage() {
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleGenerate = () => {
        if (!input.trim() && files.length === 0) return;

        setLoading(true);
        setFlashcards([]);
        setCurrentIndex(0);
        setFlipped(false);
        setCompleted(false);

        // Mock AI-generated flashcards
        setTimeout(() => {
            const generated: Flashcard[] = [
                { question: "What is ScholarMate?", answer: "An AI-powered study companion." },
                { question: "How does it help students?", answer: "Generates flashcards, summaries, and quizzes automatically." },
                { question: "Which file formats are supported?", answer: "PDF, DOCX, PPT, CSV, images, and more." },
            ];
            setFlashcards(generated);
            setLoading(false);
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
            e.dataTransfer.clearData();
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
        } else {
            setCompleted(true);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
        }
    };

    const toggleFlip = () => {
        setFlipped(!flipped);
    };

    const renderResult = () => {
        if (!completed) return null;

        const total = flashcards.length;
        let message = "";
        let emoji = "";

        if (total === 0) return null;

        if (total <= 1) {
            message = "You completed your flashcard! 🎉";
            emoji = "🎉";
        } else if (total <= 2) {
            message = "Good job! You reviewed your flashcards. 👍";
            emoji = "👍";
        } else {
            message = "Excellent! You mastered all your flashcards! 🏆";
            emoji = "🏆";
        }

        return (
            <Card className="mt-8 text-center">
                <CardContent>
                    <p className="text-xl font-bold">{message}</p>
                    <p className="text-4xl mt-2">{emoji}</p>
                </CardContent>
            </Card>
        );
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-12">
            <main className="flex flex-col gap-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center">Smart Flashcards</h1>
                <p className="text-center text-muted-foreground">
                    Paste your notes or upload study files to generate interactive flashcards instantly.
                </p>

                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Study Material</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Textarea
                            placeholder="Paste your text here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[150px]"
                        />

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragActive(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragActive(false);
                            }}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                                }`}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.csv,.jpg,.jpeg,.png,.gif"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                <Upload className="h-8 w-8 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Drag & drop files here, or <span className="text-primary">browse</span>
                                </span>
                            </label>
                        </div>

                        {files.length > 0 && (
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {files.map((file, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <FileIcon className="h-4 w-4 text-primary" />
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex justify-end">
                            <Button
                                onClick={handleGenerate}
                                disabled={loading || (!input && files.length === 0)}
                            >
                                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Generate Flashcards
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Flashcard Display */}
                {flashcards.length > 0 && !completed && currentCard && (
                    <motion.div
                        className="relative w-full h-48 sm:h-60 mt-8 cursor-pointer"
                        style={{ perspective: 1000 }}
                        onClick={toggleFlip}
                    >
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full h-full"
                        >
                            {/* Front */}
                            <div
                                className="absolute w-full h-full rounded-xl shadow-lg bg-white dark:bg-neutral-900 flex items-center justify-center p-4 text-center font-semibold text-lg"
                                style={{
                                    transform: flipped ? "rotateY(180deg)" : undefined,
                                    backfaceVisibility: flipped ? "hidden" : 'visible',
                                }}
                            >
                                📘 {currentCard.question}
                            </div>

                            {/* Back */}
                            <div
                                className="absolute w-full h-full rounded-xl shadow-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center p-4 text-center font-medium"
                                style={{
                                    transform: flipped ? undefined : "rotateY(180deg)",
                                    backfaceVisibility: !flipped ? "hidden" : 'visible',
                                }}
                            >
                                ✅ {currentCard.answer}
                            </div>
                        </motion.div>
                        <div className="flex justify-between mt-4 gap-4">
                            <Button onClick={handleBack} disabled={currentIndex === 0}>
                                Back
                            </Button>
                            <Button onClick={handleNext}>
                                {currentIndex === flashcards.length - 1 ? "Finish" : "Next"}
                            </Button>
                        </div>
                    </motion.div>


                )}

                {/* Final Result */}
                {renderResult()}
            </main>
        </div>
    );
}
