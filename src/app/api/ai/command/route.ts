import type { Message } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { env } from "env";

export async function POST(req: NextRequest) {
  const { messages, system } = (await req.json()) as {
    messages: Message[];
    system?: string;
  };

  const openai = createOpenAI({
    apiKey: env.LANGDB_OPENAI_BASE_URL,
    baseURL: env.LANGDB_OPENAI_BASE_URL,
    headers: { "x-project-id": env.LANGDB_PROJECT_ID },
  });

  try {
    const result = streamText({
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
      model: openai("gpt-3.5-turbo-0125"),
      system: system,
    });

    return result.toDataStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
