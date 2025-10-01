"use client";

import { useState, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabKey = "summaries" | "flashcards" | "quizzes";

export default function GetStartedPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("summaries");

    // Separate state per tab
    const [inputs, setInputs] = useState<Record<TabKey, string>>({
        summaries: "",
        flashcards: "",
        quizzes: "",
    });

    const [outputs, setOutputs] = useState<Record<TabKey, string>>({
        summaries: "",
        flashcards: "",
        quizzes: "",
    });

    const [files, setFiles] = useState<Record<TabKey, File[]>>({
        summaries: [],
        flashcards: [],
        quizzes: [],
    });

    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleGenerate = async () => {
        const input = inputs[activeTab];
        const tabFiles = files[activeTab];

        if (!input.trim() && tabFiles.length === 0) return;

        setLoading(true);
        setOutputs((prev) => ({ ...prev, [activeTab]: "" }));

        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeTab,
                    text: input,
                    files: tabFiles,
                }),
            });

            const data = await res.json();
            setOutputs((prev) => ({ ...prev, [activeTab]: data.result }));
        } catch (err) {
            console.error(err);
            setOutputs((prev) => ({ ...prev, [activeTab]: "Error generating content" }));
        } finally {
            setLoading(false);
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const tabFiles = files[activeTab];
            setFiles((prev) => ({
                ...prev,
                [activeTab]: [...tabFiles, ...Array.from(e.target.files)],
            }));
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const tabFiles = files[activeTab];
            setFiles((prev) => ({
                ...prev,
                [activeTab]: [...tabFiles, ...Array.from(e.dataTransfer.files)],
            }));
            e.dataTransfer.clearData();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-12">
            <main className="flex flex-col gap-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center">Get Started</h1>
                <p className="text-center text-muted-foreground">
                    Paste your text or upload study files to generate summaries, flashcards, or quizzes.
                </p>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summaries">Summaries</TabsTrigger>
                        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    </TabsList>

                    {(["summaries", "flashcards", "quizzes"] as TabKey[]).map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            {/* Input Card */}
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

                                    {/* Drag & Drop File Upload */}
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
                                            id={`file-upload-${tab}`}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.csv,.jpg,.jpeg,.png,.gif"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor={`file-upload-${tab}`} className="flex flex-col items-center gap-2 cursor-pointer">
                                            <Upload className="h-8 w-8 text-primary" />
                                            <span className="text-sm text-muted-foreground">
                                                Drag & drop your files here, or <span className="text-primary">browse</span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* File List */}
                                    {files[tab].length > 0 && (
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            {files[tab].map((file, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <FileIcon className="h-4 w-4 text-primary" />
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Generate Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={loading || (!inputs[tab] && files[tab].length === 0)}
                                        >
                                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            {tab === "summaries"
                                                ? "Generate Summary"
                                                : tab === "flashcards"
                                                    ? "Generate Flashcards"
                                                    : "Generate Quiz"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Output */}
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
                                        <p>{outputs[tab]}</p>
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
