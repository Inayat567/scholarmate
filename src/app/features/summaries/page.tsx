"use client";

import { useState, DragEvent } from "react";
import { BookOpen, Sparkles, Clock, FileText, Loader2, Upload, FileIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SummariesPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim() && files.length === 0) return;

    setLoading(true);
    setSummary("");

    try {
      // TODO: Replace with Gemini API call
      const mockSummary = `✨ Mock summary based on your text/files. Real AI summary will appear here.`;
      await new Promise((res) => setTimeout(res, 1500));
      setSummary(mockSummary);
    } catch (error) {
      console.error(error);
      setSummary("❌ Failed to generate summary. Try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6">
        <BookOpen className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">AI Summaries</h1>
        <p className="text-lg text-muted-foreground">
          Turn lengthy study materials into clear, concise summaries in seconds.
          Paste your text or upload files to get started.
        </p>
      </div>

      {/* Input / Upload Section */}
      <Card className="mt-12 w-full max-w-2xl">
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

          {/* Drag & Drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"}`}
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
                Drag & drop your files here, or <span className="text-primary">browse</span>
              </span>
            </label>
          </div>

          {/* File List */}
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

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={loading || (!input && files.length === 0)}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Output */}
      {summary && (
        <Card className="mt-8 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div className="grid gap-6 sm:grid-cols-2 mt-16 max-w-4xl w-full">
        <Card>
          <CardHeader>
            <Sparkles className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Smart Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            Extracts the most important concepts and presents them in an easy-to-digest way.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Save Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            Get clear summaries instantly and review faster.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Multi-Format Support</CardTitle>
          </CardHeader>
          <CardContent>
            Upload PDFs, Word docs, or slides — ScholarMate handles them all with ease.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Custom Length</CardTitle>
          </CardHeader>
          <CardContent>
            Choose between bullet-point notes or detailed summaries, tailored for you.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
