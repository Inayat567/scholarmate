"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { acceptedMimeTypes, fileToBase64, isValidBase64 } from "@/lib/utils";
import FileUploader from "@/components/UploadBox";
import { runChromeAI } from "@/lib/aiClient";
import { toast } from "sonner";

export default function QuizzesPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {

    if (!input.trim() && files.length === 0) return;

    setLoading(true);
    setQuizzes([]);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setShowResult(false);

    try {
      let prompt = input
      const base64Files = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          if (!isValidBase64(base64)) {
            console.warn(`Invalid Base64 for ${file.name}, skipping.`);
            return null;
          }

          if (file.type === "application/pdf") {
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
            prompt = prompt + text.slice(0, 2000);
            return null
          }
          return { name: file.name, mimeType: file.type, data: base64 };
        })
      );

      const filteredFiles: FileData[] = base64Files.filter((file): file is NonNullable<typeof file> =>
        file !== null && acceptedMimeTypes.includes(file.mimeType)
      );

      const result = await runChromeAI({
        type: "quizzes",
        text: prompt,
        files: filteredFiles,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setQuizzes(result.quizzes || []);
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      toast.error(`Failed to generate quizzes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (option: string) => {
    const updated = [...selectedOptions];
    updated[currentIndex] = option;
    setSelectedOptions(updated);
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const correctCount = quizzes.filter(
    (q, idx) => selectedOptions[idx] === q.answer
  ).length;

  const getResultMessage = () => {
    const total = quizzes.length;
    const score = correctCount;

    if (score === total)
      return { msg: "Perfect! 🎉 You're a study master!", emoji: "🏆" };
    if (score >= total / 2)
      return { msg: "Good job! 😊 Keep improving!", emoji: "👍" };
    return { msg: "Keep trying! 💪 You can do better!", emoji: "💡" };
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <main className="flex flex-col gap-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center">Quizzes & Practice</h1>
        <p className="text-center text-muted-foreground">
          Paste your notes or upload study files to generate interactive quizzes instantly.
        </p>

        {quizzes.length === 0 && (
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
                  {loading ? "Generating..." : "Generate Quizzes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {quizzes.length > 0 && !showResult && (
          <Card>
            <CardHeader>
              <CardTitle>
                Question {currentIndex + 1} of {quizzes.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">{quizzes[currentIndex].question}</p>
              {quizzes[currentIndex].options.map((opt) => (
                <Button
                  key={opt}
                  variant={
                    selectedOptions[currentIndex] === opt
                      ? "default"
                      : "outline"
                  }
                  className="w-full text-left"
                  onClick={() => selectOption(opt)}
                >
                  {opt}
                </Button>
              ))}

              <div className="flex justify-between mt-4">
                <Button onClick={handleBack} disabled={currentIndex === 0}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedOptions[currentIndex]}
                >
                  {currentIndex === quizzes.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showResult && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Quiz Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl mb-4">{getResultMessage().emoji}</p>
              <p className="text-lg font-semibold mb-2">
                {getResultMessage().msg}
              </p>
              <p>
                You got {correctCount} out of {quizzes.length} correct.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setQuizzes([]);
                  setInput("");
                  setFiles([]);
                  setShowResult(false);
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}