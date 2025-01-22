import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "env";

export async function POST(req: NextRequest) {
  const { prompt, system } = (await req.json()) as {
    system?: string;
    prompt?: string;
  };

  const openai = createOpenAI({
    apiKey: env.LANGDB_OPENAI_BASE_URL,
    baseURL: env.LANGDB_OPENAI_BASE_URL,
    headers: { "x-project-id": env.LANGDB_PROJECT_ID },
  });

  try {
    const result = await generateText({
      abortSignal: req.signal,
      maxTokens: 50,
      model: openai("gpt-3.5-turbo-0125"),
      prompt: prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
