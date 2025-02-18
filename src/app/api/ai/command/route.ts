import type { Message } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Resource } from "sst/resource";

export async function POST(req: NextRequest) {
    const { messages, system } = (await req.json()) as {
        messages: Message[];
        system?: string;
    };

    const openai = createOpenAI({
        apiKey: Resource["langdb-api-key"].value,
        baseURL: Resource["langdb-openai-base-url"].value,
        headers: { "x-project-id": Resource["langdb-project-id"].value },
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
