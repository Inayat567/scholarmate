"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Clock, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { acceptedMimeTypes, fileToBase64, isValidBase64 } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import FileUploader from "@/components/UploadBox";
import { runChromeAI } from "@/lib/aiClient";
import { usePDFJS } from "@/lib/usePdf";

export default function SummariesPage() {

  usePDFJS(async (pdfjs) => {
    console.log("✅ PDFJS Loaded:", pdfjs);
  });

  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim() && files.length === 0) return;

    setLoading(true);
    setSummary("");

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
        type: "summaries",
        text: prompt,
        files: filteredFiles,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        setSummary(result.summary || result.raw || "");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl text-center space-y-6">
        <BookOpen className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">AI Summaries</h1>
        <p className="text-lg text-muted-foreground">
          Turn lengthy study materials into clear, concise summaries in seconds.
          Paste your text or upload files to get started.
        </p>
      </div>

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

          <FileUploader
            onFilesChange={(allFiles) => setFiles(allFiles)}
          />

          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={loading || (!input && files.length === 0)}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Generating..." : "Generate Summary"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card className="mt-8 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} skipHtml={false}>
              {summary}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

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
            Upload PDFs, CSVs, or images — ScholarMate handles them all with ease.
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