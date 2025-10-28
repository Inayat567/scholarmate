import { parseCountFromText } from "./utils";

export async function runChromeAI({
  type,
  text,
  files,
}: {
  type: string;
  text: string;
  files?: FileData[];
}): Promise<any> {
  console.log(files)
  const isSummarizerAvailable = typeof window !== "undefined" && ("Summarizer" in window) && type === "summaries";
  const isLanguageModelAvailable = typeof window !== "undefined" && ("LanguageModel" in window) && (type === "flashcards" || type === "quizzes");

  if (!isSummarizerAvailable && !isLanguageModelAvailable) {
    throw new Error("Chrome AI APIs are not available. Please ensure Chrome flags are enabled.");
  }

  if (type === "summaries") {
    let summarizerInstance: any;

    if (isSummarizerAvailable) {
      const Summarizer: any = (window as any).Summarizer;
      summarizerInstance = await Summarizer.create({ type: "key-points" });
    } else {
      throw new Error("No Summarization API found (neither modern nor legacy).");
    }

    const result = await summarizerInstance.summarize(text);
    return { summary: result };
  }

  let session: any;

  if (!session && isLanguageModelAvailable) {
    const LegacyLanguageModel: any = (window as any).LanguageModel;
    try {

      session = await LegacyLanguageModel.create({
        expectedInputs: [
          { type: "text", languages: ["en"] },
          // unable to use image and audio in stable version so skipped it, for this required to be registered to the origin somehting like that
          // { type: "image", languages: ["en"] },
          // { type: "audio", languages: ["en"] }
        ],
        expectedOutputs: [{ type: "text", languages: ["en"] }]
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create legacy LanguageModel session: ${error.message}`);
      } else {
        throw new Error(`Failed to create legacy LanguageModel session: ${String(error)}`);
      }
    }
  }

  if (!session) {
    throw new Error("No LanguageModel available (neither modern nor legacy).");
  }

  let promptText = text;
  let jsonFormatRequested = false;

  switch (type) {
    case "flashcards":
      jsonFormatRequested = true;
      const flashcardCount = parseCountFromText(text, "flashcard", 5); // Default 5
      promptText = `
Read the following content and create ${flashcardCount} study flashcards. 
Return JSON like:
[
  { "question": "string", "answer": "string" }
]

Content:
${text}`;
      break;

    case "quizzes":
      jsonFormatRequested = true;
      const quizCount = parseCountFromText(text, "question", 5); // Default 5
      promptText = `
Generate ${quizCount} multiple-choice quiz questions based on this content.
Return JSON like:
[
  { "question": "string", "options": ["A","B","C","D"], "answer": "string" }
]

Content:
${text}`;
      break;

    default:
      promptText = text;
  }

  const content: any[] = [{ type: "text", value: promptText }];

  // uncomment below line when we have origin access to multimodal prompt api

  // if (files && files.length > 0) {
  //   for (const file of files) {
  //     let fileContent: any = null;
  //     console.log(fileContent)
  //     if (file.mimeType?.startsWith("image/")) {
  //       fileContent = { type: "image", value: file };
  //     } else if (file.mimeType?.startsWith("audio/")) {
  //       fileContent = { type: "audio", value: file };
  //     } else {
  //       console.warn(`Unsupported mimeType for multimodal: ${file.mimeType}. Skipping file.`);
  //       continue;
  //     }

  //     if (fileContent) {
  //       content.push(fileContent);
  //       console.log(`Added ${fileContent.mimeType}: ${file.name}`);
  //     }
  //   }
  //   if (content.length > 1) {
  //     promptText += "\n\nAnalyze the attached file(s) as well.";
  //     content[0].value = promptText;
  //   }
  // }

  let result: any;
  try {
    const messages = [{ role: "user", content }];
    result = await session.prompt(messages, { outputLanguage: 'en' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create legacy LanguageModel session: ${error.message}`);
    } else {
      throw new Error(`Failed to create legacy LanguageModel session: ${String(error)}`);
    }
  }

  const cleaned = result.replace(/```json/i, "").replace(/```/g, "").trim();

  if (jsonFormatRequested) {
    try {
      const parsed = JSON.parse(cleaned);
      if (type === "flashcards") return { flashcards: parsed };
      if (type === "quizzes") return { quizzes: parsed };
      return parsed;
    } catch (error) {
      console.log("Error : ", error);
      return { raw: cleaned, error: "Model failed to return valid JSON." };
    }
  }

  return { raw: cleaned };
}