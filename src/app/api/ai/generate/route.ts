import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Part } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey });

interface ClientFile {
  name: string;
  mimeType: string;
  data: string;
}

export async function POST(req: NextRequest) {
  try {
    const { type, text, files } = (await req.json()) as {
      type: string;
      text: string;
      files: ClientFile[];
    };

    if (!text && (!files || files.length === 0)) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    let promptText = "";

    switch (type) {
      case "summaries":
        promptText = `
You are an expert academic summarizer.
Summarize the following content into a concise, clear, and well-structured summary while preserving all key ideas.
If any images or visual materials are provided, describe their relevant content.

Return strictly valid JSON in this format:
{
  "summary": "string"
}

Content:
${text}
`;
        break;

      case "flashcards":
        promptText = `
You are a study material assistant.
Read the following and generate study flashcards in JSON format.

Return strictly valid JSON in this format:
[
  { "question": "string", "answer": "string" }
]

Ensure:
- 5–10 high-quality flashcards.
- Clear questions and accurate answers.
- JSON only, no explanations.

Content:
${text}
`;
        break;

      case "quizzes":
        promptText = `
You are an expert quiz generator.
Generate 5 multiple-choice quiz questions in strict JSON format.

Return strictly valid JSON in this format:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "string"
  }
]

Ensure:
- Each question is unique.
- Each answer exactly matches one option.
- JSON only, no explanation.

Content:
${text}
`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const parts: Part[] = [{ text: promptText }];

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.mimeType && file.data) {
          const base64Data = file.data.split(",")[1] || file.data;
          parts.push({
            inlineData: {
              mimeType: file.mimeType,
              data: base64Data,
            },
          });
        }
      }
    }

    const response = await ai.models?.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
    });

    const rawText = response?.candidates?.[0]?.content.parts?.[0]?.text || "";

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 400 }
      );
    }

    let parsedData: any;

    try {
      const cleaned = rawText
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI response:", err, rawText);
      return NextResponse.json(
        { error: "Invalid JSON output from AI", raw: rawText },
        { status: 500 }
      );
    }

    switch (type) {
      case "summaries":
        return NextResponse.json({ summary: parsedData.summary || parsedData });
      case "flashcards":
        return NextResponse.json({ flashcards: parsedData });
      case "quizzes":
        return NextResponse.json({ quizzes: parsedData });
      default:
        return NextResponse.json({ result: parsedData });
    }
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: "Server error: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
