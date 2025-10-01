"use client";

import { useState, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileIcon } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizzesPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    if (!input.trim() && files.length === 0) return;

    setLoading(true);
    setQuizzes([]);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setShowResult(false);

    // Mock AI response
    setTimeout(() => {
      const generated: QuizQuestion[] = [
        {
          question: "What is ScholarMate?",
          options: ["AI study companion", "Video game", "Cooking app", "Music player"],
          answer: "AI study companion",
        },
        {
          question: "Which file types are supported?",
          options: ["PDF, DOCX, PPT", "Only PDF", "Only images", "Text only"],
          answer: "PDF, DOCX, PPT",
        },
        {
          question: "What study tools are included?",
          options: ["Summaries, Flashcards, Quizzes", "Movies", "Games", "None"],
          answer: "Summaries, Flashcards, Quizzes",
        },
      ];
      setQuizzes(generated);
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

  const correctCount = quizzes.filter((q, idx) => selectedOptions[idx] === q.answer).length;

  const getResultMessage = () => {
    const total = quizzes.length;
    const score = correctCount;

    if (score === total) return { msg: "Perfect! 🎉 You're a study master!", emoji: "🏆" };
    if (score >= total / 2) return { msg: "Good job! 😊 Keep improving!", emoji: "👍" };
    return { msg: "Keep trying! 💪 You can do better!", emoji: "💡" };
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <main className="flex flex-col gap-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center">Quizzes & Practice</h1>
        <p className="text-center text-muted-foreground">
          Paste your notes or upload study files to generate interactive quizzes instantly.
        </p>

        {/* Input Card */}
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
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30"
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
                  Generate Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz Card */}
        {quizzes.length > 0 && !showResult && (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentIndex + 1} of {quizzes.length}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">{quizzes[currentIndex].question}</p>
              {quizzes[currentIndex].options.map((opt) => (
                <Button
                  key={opt}
                  variant={selectedOptions[currentIndex] === opt ? "default" : "outline"}
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
                <Button onClick={handleNext} disabled={!selectedOptions[currentIndex]}>
                  {currentIndex === quizzes.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {showResult && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Quiz Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl mb-4">{getResultMessage().emoji}</p>
              <p className="text-lg font-semibold mb-2">{getResultMessage().msg}</p>
              <p>
                You got {correctCount} out of {quizzes.length} correct.
              </p>
              <Button className="mt-4" onClick={() => {
                setQuizzes([]);
                setInput("");
                setFiles([]);
                setShowResult(false);
              }}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
