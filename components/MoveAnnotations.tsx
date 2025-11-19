"use client";

import React, { useEffect, useRef, useState } from "react";

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
};

type ChessCoachChatProps = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  fen: string;
  avatarUrl?: string;
};

export default function ChessCoachChat({
  messages,
  setMessages,
  fen,
  avatarUrl = "/professor.png",
}: ChessCoachChatProps) {
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Demo bot reply - replace with API call if desired
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Gute Frage! Ich schaue mir die Stellung an (FEN: ${fen}).` },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900/40 rounded-xl shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            {m.sender === "bot" && (
              <img src={avatarUrl} alt="Coach Avatar" className="w-10 h-10 rounded-full object-cover shadow-lg" />
            )}

            <div className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"}`}>
              {m.text}
            </div>

            {m.sender === "user" && (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">Du</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Frage den Professor..."
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button onClick={send} className="px-4 py-2 bg-yellow-400 rounded-lg text-black font-semibold hover:bg-yellow-300">
          Senden
        </button>
      </div>
    </div>
  );
}
