"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { acceptedMimeTypes, fileToBase64 } from "@/lib/utils";
import { toast } from "sonner";
import FileUploader from "@/components/UploadBox";

export default function GetStartedPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("summaries");
    const [inputs, setInputs] = useState<Record<TabKey, string>>({
        summaries: "",
        flashcards: "",
        quizzes: "",
    });
    const [outputs, setOutputs] = useState<Record<TabKey, any>>({
        summaries: "",
        flashcards: [],
        quizzes: [],
    });
    const [files, setFiles] = useState<Record<TabKey, File[]>>({
        summaries: [],
        flashcards: [],
        quizzes: [],
    });
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        const input = inputs[activeTab];
        const tabFiles = files[activeTab];

        if (!input.trim() && tabFiles.length === 0) return;

        setLoading(true);
        setOutputs((prev) => ({ ...prev, [activeTab]: activeTab === "summaries" ? "" : [] }));

        try {
            const base64Files = await Promise.all(
                tabFiles.map(async (file) => {
                    const data = await fileToBase64(file);
                    return { name: file.name, mimeType: file.type, data };
                })
            );

            const filteredFiles = base64Files.filter((file) =>
                acceptedMimeTypes.includes(file.mimeType)
            );

            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeTab,
                    text: input,
                    files: filteredFiles,
                }),
            });

            const data = await res.json();
            if (data?.error) {
                toast.error(data.error);
                return;
            }

            setOutputs((prev) => ({
                ...prev,
                [activeTab]:
                    activeTab === "summaries"
                        ? data.summary
                        : activeTab === "flashcards"
                            ? data.flashcards
                            : data.quizzes,
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-12">
            <main className="flex flex-col gap-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center">Get Started</h1>
                <p className="text-center text-muted-foreground">
                    Paste your text or upload study files to generate summaries, flashcards, or quizzes.
                </p>

                <Tabs
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val as TabKey)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summaries">Summaries</TabsTrigger>
                        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    </TabsList>

                    {(["summaries", "flashcards", "quizzes"] as TabKey[]).map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>Study Material</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Textarea
                                        placeholder="Paste your text here..."
                                        value={inputs[tab]}
                                        onChange={(e) =>
                                            setInputs((prev) => ({ ...prev, [tab]: e.target.value }))
                                        }
                                        className="min-h-[150px]"
                                    />
                                    <FileUploader
                                        onFilesChange={(allFiles) => setFiles(prev => ({
                                            ...prev,
                                            [activeTab]: allFiles
                                        }))}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={loading || (!inputs[tab] && files[tab].length === 0)}
                                        >
                                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            {loading
                                                ? "Generating..."
                                                : tab === "summaries"
                                                    ? "Generate Summary"
                                                    : tab === "flashcards"
                                                        ? "Generate Flashcards"
                                                        : "Generate Quiz"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Output Section */}
                            {outputs[tab] && (
                                <Card className="mt-4">
                                    <CardHeader>
                                        <CardTitle>
                                            {tab === "summaries"
                                                ? "AI Summary"
                                                : tab === "flashcards"
                                                    ? "AI Flashcards"
                                                    : "AI Quiz"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Summary Output */}
                                        {tab === "summaries" && (
                                            <p className="whitespace-pre-line text-muted-foreground">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    skipHtml={false}
                                                >
                                                    {outputs[tab]}
                                                </ReactMarkdown>
                                            </p>
                                        )}

                                        {/* Flashcards Output */}
                                        {tab === "flashcards" &&
                                            Array.isArray(outputs[tab]) &&
                                            outputs[tab].map((card: Flashcard, i: number) => (
                                                <div
                                                    key={i}
                                                    className="border rounded-xl p-4 mb-3 bg-muted/10"
                                                >
                                                    <p className="font-semibold">
                                                        Q{i + 1}: {card.question}
                                                    </p>
                                                    <p className="text-muted-foreground mt-2">
                                                        {card.answer}
                                                    </p>
                                                </div>
                                            ))}

                                        {/* Quizzes Output */}
                                        {tab === "quizzes" &&
                                            Array.isArray(outputs[tab]) &&
                                            outputs[tab].map((q: QuizQuestion, i: number) => (
                                                <div
                                                    key={i}
                                                    className="border rounded-xl p-4 mb-3 bg-muted/10"
                                                >
                                                    <p className="font-semibold mb-2">
                                                        Q{i + 1}: {q.question}
                                                    </p>
                                                    <ul className="list-disc ml-5 text-muted-foreground">
                                                        {q.options.map((opt, idx) => (
                                                            <li key={idx}>{opt}</li>
                                                        ))}
                                                    </ul>
                                                    <p className="text-primary mt-2">
                                                        ✅ Correct: {q.answer}
                                                    </p>
                                                </div>
                                            ))}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}
