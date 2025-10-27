"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { acceptedMimeTypes, fileToBase64 } from "@/lib/utils";
import FileUploader from "@/components/UploadBox";

export default function FlashcardsPage() {
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleGenerate = async () => {
        if (!input.trim() && files.length === 0) return;
        setLoading(true);
        setFlashcards([]);
        setCurrentIndex(0);
        setFlipped(false);
        setCompleted(false);

        try {
            const validFiles = files.filter((file) =>
                acceptedMimeTypes.includes(file.type)
            );

            const base64Files = await Promise.all(
                validFiles.map(async (file) => {
                    const data = await fileToBase64(file);
                    return { name: file.name, mimeType: file.type, data };
                })
            );

            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "flashcards",
                    text: input,
                    files: base64Files,
                }),
            });

            if (!res.ok) throw new Error("Failed to generate flashcards");
            const result = await res.json();
            
            // Assuming the API returns { result: "[{...}, {...}]" } as a string
            // If it returns { result: [{...}, {...}] } as an array, use:
            // setFlashcards(result.result || []);

            // If it returns { flashcards: [...] } as in your original code:
            setFlashcards(result.flashcards || []);

        } catch (err) {
            console.error("Error generating flashcards:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (!flipped) {
            setFlipped(true);
        } else {
            if (currentIndex < flashcards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setFlipped(false);
            } else {
                setCompleted(true);
            }
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
        <div className="min-h-screen flex flex-col items-center px-6 py-12 pb-20">
            <main className="flex flex-col gap-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center">Smart Flashcards</h1>
                <p className="text-center text-muted-foreground">
                    Paste your notes or upload study files to generate interactive flashcards instantly.
                </p>

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

                        <FileUploader
                            onFilesChange={(allFiles) => setFiles(allFiles)}
                        />

                        <div className="flex justify-end">
                            <Button
                                onClick={handleGenerate}
                                disabled={loading || (!input && files.length === 0)}
                            >
                                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {loading ? "Generating..." : "Generate Flashcards"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {flashcards.length > 0 && !completed && currentCard && (
                    <motion.div
                        className="relative w-full h-48 sm:h-60 mt-8"
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            onClick={toggleFlip}
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full h-full cursor-pointer"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div
                                className="absolute w-full h-full rounded-xl shadow-lg bg-white dark:bg-neutral-900 flex items-center justify-center p-4 text-center font-semibold text-lg"
                                style={{
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                📘 {currentCard.question}
                            </div>

                            <div
                                className="absolute w-full h-full rounded-xl shadow-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center p-4 text-center font-medium"
                                style={{
                                    transform: "rotateY(180deg)",
                                    backfaceVisibility: "hidden",
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
                                {currentIndex === flashcards.length - 1 && flipped ? "Finish" : (flipped ? "Next" : "Show Answer")}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {renderResult()}
            </main>
        </div>
    );
}
