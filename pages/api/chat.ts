import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Message = { sender: "bot" | "user"; text: string };
type RequestBody = { messages: Message[]; fen?: string };
type ResponseBody = { text: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody | { error: string }>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, fen } = req.body as RequestBody;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "Invalid messages" });

  const prompt = `
You are a friendly chess coach. The current board (FEN): ${fen || "not provided"}.
Conversation:
${messages
  .map((m) => (m.sender === "user" ? `User: ${m.text}` : `Bot: ${m.text}`))
  .join("\n")}

Now give a step-by-step suggestion for the user's next move.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message?.content || "Sorry, I couldn't think of a move.";
    res.status(200).json({ text });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "Internal error" });
  }
}
