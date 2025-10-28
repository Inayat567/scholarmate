"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { acceptedMimeTypes, fileToBase64, inferMimeType, isValidBase64 } from "@/lib/utils";
import { toast } from "sonner";
import FileUploader from "@/components/UploadBox";
import { runChromeAI } from "@/lib/aiClient";
import { usePDFJS } from "@/lib/usePdf";

export default function GetStartedPage() {

    usePDFJS(async (pdfjs) => {
        console.log("✅ PDFJS Loaded:", pdfjs);
    });

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
    const [status, setStatus] = useState('Checking AI availability...');
    const [isSummarizerReady, setIsSummarizerReady] = useState(false);
    const [isLanguageModelReady, setIsLanguageModelReady] = useState(false);

    useEffect(() => {
        const checkAI = async () => {
            if (typeof window === 'undefined') {
                setStatus('Running in non-browser environment.');
                return;
            }

            const isModern = 'ai' in window;
            const isLegacySummarizer = 'Summarizer' in window;
            const isLegacyLanguageModel = 'LanguageModel' in window;
            let summarizerReady = false;
            let lmReady = false;

            if (isModern) {
                const ai: any = (window as any).ai;
                if (ai.summarizer) {
                    summarizerReady = true;
                }
                if (ai.languageModel || isLegacyLanguageModel) {
                    lmReady = true;
                }
            }

            if (!isModern && isLegacySummarizer) {
                summarizerReady = true;
            }

            setIsSummarizerReady(summarizerReady);
            setIsLanguageModelReady(lmReady);

            if (summarizerReady && lmReady) {
                setStatus('READY: All Chrome AI APIs available.');
            } else if (summarizerReady) {
                setStatus('READY: Summarizer available. Language Model detected for flashcards/quizzes.');
            } else if (lmReady) {
                setStatus('READY: Language Model available. Summarizer not available.');
            } else {
                setStatus('CRITICAL: No Chrome AI APIs detected. Enable flags in chrome://flags.');
            }
        };

        checkAI();
    }, []);

    const handleGenerate = async () => {
        let input = inputs[activeTab];
        const tabFiles = files[activeTab];

        if (!input.trim() && tabFiles.length === 0) return;

        setLoading(true);
        setOutputs((prev) => ({ ...prev, [activeTab]: activeTab === "summaries" ? "" : [] }));

        try {
            let filteredFiles: FileData[] = [];
            if (tabFiles.length > 0) {
                const base64Files = await Promise.all(
                    tabFiles.map(async (file) => {
                        try {
                            const base64 = await fileToBase64(file);

                            if (!isValidBase64(base64)) {
                                console.warn(`Invalid Base64 for ${file.name}, skipping.`);
                                return null;
                            }

                            // Infer MIME type if file.type is undefined/empty
                            let mimeType = file.type;
                            if (!mimeType || mimeType === '') {
                                mimeType = inferMimeType(file.name);
                                console.log(`Inferred MIME type for ${file.name}: ${mimeType}`);
                            }

                            if (mimeType === "application/pdf") {
                                const arrayBuffer = await file.arrayBuffer();
                                const pdf = await (await import("pdfjs-dist/webpack.mjs"))
                                    .getDocument({ data: arrayBuffer })
                                    .promise;

                                let text = "";
                                for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                                    const page = await pdf.getPage(i);
                                    const content = await page.getTextContent();
                                    text += content.items.map((i: any) => i.str).join(" ") + "\n\n";
                                }
                                input = input + text.slice(0, 2000);
                                return null
                            }

                            return { name: file.name, mimeType, data: base64 };
                        } catch (error) {
                            console.warn(`Error processing ${file.name}:`, error);
                            return null;
                        }
                    })
                );

                filteredFiles = base64Files.filter((file): file is NonNullable<typeof file> =>
                    file !== null && acceptedMimeTypes.includes(file.mimeType)
                );
            }

            const result = await runChromeAI({
                type: activeTab,
                text: input,
                files: filteredFiles,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            setOutputs((prev) => ({
                ...prev,
                [activeTab]:
                    activeTab === "summaries"
                        ? result.summary || result.raw
                        : activeTab === "flashcards"
                            ? result.flashcards || result.raw
                            : result.quizzes || result.raw,
            }));
            setStatus(`Successfully generated ${activeTab}!`);
        } catch (err: any) {
            console.error(err);
            setStatus(`ERROR: ${err.message}`);
            toast.error(`Failed to generate ${activeTab}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const showWarning = status.includes('CRITICAL');

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-12">
            <main className="flex flex-col gap-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center">Get Started</h1>
                <p className="text-center text-muted-foreground">
                    Paste your text or upload study files to generate summaries, flashcards, or quizzes.
                </p>

                {showWarning && (
                    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-inner" role="alert">
                        <p className="font-bold">AI API Issue</p>
                        <p>No Chrome AI APIs detected. Enable flags in chrome://flags and relaunch browser.</p>
                    </div>
                )}

                <p className={`text-sm font-semibold text-center ${status.includes('ERROR') || status.includes('CRITICAL') ? 'text-red-600' : status.includes('READY') ? 'text-green-600' : 'text-gray-600'}`}>
                    **Status:** {status}
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
                                        onFilesChange={(allFiles: File[]) => setFiles(prev => ({
                                            ...prev,
                                            [tab]: allFiles
                                        }))}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerate}
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
                                        {tab === "summaries" && typeof outputs[tab] === 'string' && (
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