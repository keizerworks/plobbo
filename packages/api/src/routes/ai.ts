import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { zValidator } from "@hono/zod-validator";
import { convertToCoreMessages, generateText, streamText } from "ai";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { z } from "zod";

import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";

import { geminiOptions } from "../lib/gemini";

const aiRouter = new Hono().use(enforeAuthMiddleware);

aiRouter.post(
  "/command",
  zValidator(
    "json",
    z.object({ messages: z.array(z.any()), system: z.string().optional() }),
  ),
  (c) => {
    const { messages, system } = c.req.valid("json");
    const gemini = createGoogleGenerativeAI(geminiOptions);

    try {
      const result = streamText({
        maxTokens: 2048,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        messages: convertToCoreMessages(messages),
        model: gemini("gemini-2.0-flash-001"),
        system,
      });
      return result.toDataStreamResponse();
    } catch {
      throw new HTTPException(500, {
        message: "Failed to process AI request",
      });
    }
  },
);

aiRouter.post(
  "/copilot",
  zValidator(
    "json",
    z.object({
      system: z.string().optional(),
      prompt: z.string().optional(),
    }),
  ),
  async (c) => {
    const { prompt, system } = c.req.valid("json");

    const gemini = createGoogleGenerativeAI(geminiOptions);

    try {
      const result = await generateText({
        abortSignal: c.event.request.signal,
        maxTokens: 200,
        model: gemini("gemini-2.0-flash-001"),
        prompt,
        system,
        temperature: 0.7,
      });

      return c.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        throw new HTTPException(408);

      throw new HTTPException(500, {
        message: "Failed to process AI request",
      });
    }
  },
);

export default aiRouter;
