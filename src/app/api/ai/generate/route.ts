import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { type, text, files } = await req.json();

  if (!text && (!files || files.length === 0)) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  // Build prompt based on type
  let prompt = "";
  switch (type) {
    case "summaries":
      prompt = `Summarize this content concisely:\n\n${text}`;
      break;
    case "flashcards":
      prompt = `Create Q&A flashcards from this content:\n\n${text}`;
      break;
    case "quizzes":
      prompt = `Generate 5 multiple-choice quiz questions from this content:\n\n${text}`;
      break;
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Call Gemini API
  try {
    const response = await fetch("https://api.gemini.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return NextResponse.json({ result: data.output });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
