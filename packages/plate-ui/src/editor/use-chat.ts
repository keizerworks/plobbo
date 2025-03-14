import { useChat as useBaseChat } from "@ai-sdk/react";

export const useChat = () => {
  return useBaseChat({
    id: "editor",
    api: process.env.VITE_URL + "/ai/command",
    fetch: async (input, init) => {
      const token = `Bearer `;
      const headers = new Headers(init?.headers);
      headers.append("Authorization", token);
      const res = await fetch(input, { ...init, headers });
      if (!res.ok) {
        return new Response(null, {
          headers: {
            Connection: "keep-alive",
            "Content-Type": "text/plain",
          },
        });
      }
      return res;
    },
    onError: console.error,
  });
};
