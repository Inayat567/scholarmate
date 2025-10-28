type TabKey = "summaries" | "flashcards" | "quizzes";

interface Flashcard {
    question: string;
    answer: string;
}

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

interface FileUploaderProps {
    onFilesChange: (files: File[]) => void;
    acceptedTypes?: string;
    multiple?: boolean;
}

interface FileData {
    name: string;
    mimeType: string,
    data: string
}

declare module 'pdfjs-dist/webpack.mjs' {
  import * as pdfjsLib from 'pdfjs-dist';
  export = pdfjsLib;
}
