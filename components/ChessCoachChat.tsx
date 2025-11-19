"use client";

import React, { useState, useEffect, useRef } from "react";

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

  // Auto-scroll auf neuesten Chat
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handler für Senden
  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    // Hier kannst du eine Bot-Antwort simulieren oder an Backend senden
    const botMsg: ChatMessage = {
      sender: "bot",
      text: `Der Coach denkt über "${input}" nach...`,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
    }, 500);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Nachrichten */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900/40 rounded-xl shadow-inner"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={avatarUrl}
                alt="Coach Avatar"
                className="w-10 h-10 rounded-full object-cover shadow-lg"
              />
            )}

            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <img
                src="/user-avatar.png" // optional, falls du einen User-Avatar hast
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover shadow-lg"
              />
            )}
          </div>
        ))}
      </div>

      {/* Eingabefeld */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Schreibe eine Nachricht an den Coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-yellow-400 rounded-lg text-black font-semibold hover:bg-yellow-500 transition"
        >
          Senden
        </button>
      </div>
    </div>
  );
}
