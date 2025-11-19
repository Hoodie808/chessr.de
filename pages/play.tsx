"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import MoveAnnotations from "../components/MoveAnnotations";
import ChessCoachChat from "../components/ChessCoachChat";
import { Chess } from "chess.js";

const ThreeChess = dynamic(() => import("../components/ThreeChess"), { ssr: false });

type ChatMessage = { sender: "bot" | "user"; text: string };

export default function PlayPage() {
  const [coachLog, setCoachLog] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentFen, setCurrentFen] = useState<string>(new Chess().fen());

  // Threat detection (text only) based on current FEN
  const threatSquares = useMemo(() => {
    const g = new Chess(currentFen);
    const moves = g.moves({ verbose: true }) as any[];
    const threatened: Set<string> = new Set();
    moves.forEach((m) => {
      threatened.add(m.to);
    });
    // return sorted array
    return Array.from(threatened).sort();
  }, [currentFen]);

  // Collect coach messages coming from ThreeChess
  const handleCoachUpdate = (msgs: string[]) => {
    setCoachLog((prev) => [...prev, ...msgs]);
  };

  // update FEN from ThreeChess
  const handleFenChange = (fen: string) => {
    setCurrentFen(fen);
  };

  // quick reset
  const resetAll = () => {
    setCoachLog([]);
    setChatMessages([]);
    const g = new Chess();
    setCurrentFen(g.fen());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        {/* LEFT: ANALYSES */}
        <div className="flex-1 bg-gray-800 p-4 rounded-xl shadow-lg h-[720px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Zug-Analysen & Hinweise</h2>
            <div className="flex gap-2 items-center">
              <button onClick={resetAll} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm">Reset</button>
            </div>
          </div>

          <div className="h-[600px]">
            <MoveAnnotations messages={coachLog} />
          </div>

          <div className="mt-3 text-sm text-gray-400">
            <h3 className="text-sm font-semibold text-yellow-300 mb-1">Bedrohte Felder (Text)</h3>
            {threatSquares.length === 0 ? (
              <div className="text-gray-500">Keine</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {threatSquares.map((s) => (
                  <span key={s} className="px-2 py-1 bg-red-700 rounded text-xs">{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: BOARD */}
        <div className="flex-1 bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold mb-3">Spiele gegen den ChessR-Coach</h2>

          <ThreeChess onCoachUpdate={handleCoachUpdate} onFenChange={handleFenChange} />

          <div className="mt-4 text-sm text-gray-300">Aktuelle FEN: <span className="text-xs text-gray-500">{currentFen}</span></div>
        </div>

        {/* RIGHT: CHAT */}
        <div className="flex-1 bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-3">Coach-Chat</h2>

          <div className="flex-1">
            <ChessCoachChat messages={chatMessages} setMessages={setChatMessages} fen={currentFen} avatarUrl="/professor.png" />
          </div>
        </div>
      </main>
    </div>
  );
}
