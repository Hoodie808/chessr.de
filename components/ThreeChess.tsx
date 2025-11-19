"use client";

import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { explainMove, suggestImprovement } from "./CoachLogic";

type ThreeChessProps = {
  fen: string;
  onPlayerMove: (from: string, to: string) => boolean | Promise<boolean>;
  onCoachUpdate?: (msgs: string[]) => void; // Optional Callback für Coach-Hinweise
};

const stockfishFactory = () => new Worker("/stockfish.js");

export default function ThreeChess({ fen, onPlayerMove, onCoachUpdate }: ThreeChessProps) {
  const [thinking, setThinking] = useState(false);
  const [message, setMessage] = useState("Du spielst Weiß – dein Zug!");
  const [level, setLevel] = useState(5);

  const chessRef = useRef(new Chess(fen));
  const engineRef = useRef<Worker | null>(null);

  // === Init Stockfish Worker ===
  useEffect(() => {
    const engine = stockfishFactory();
    engineRef.current = engine;

    engine.onmessage = (event: any) => {
      const line = event.data?.toString();
      if (!line) return;

      if (line.startsWith("bestmove")) {
        const moveStr = line.split(" ")[1];
        if (!moveStr || moveStr === "(none)") {
          setThinking(false);
          setMessage("Keine Engine-Antwort oder Spiel beendet.");
          return;
        }

        const from = moveStr.slice(0, 2);
        const to = moveStr.slice(2, 4);

        // Spieler zieht KI
        let move = null;
        try {
          move = chessRef.current.move({ from, to, promotion: "q" } as any);
        } catch {
          move = null;
        }

        if (move) {
          setMessage("Dein Zug!");
          onCoachUpdate?.([
            `♟ Schwarz zieht ${move.san}`,
            `🧠 Coach: ${explainMove(chessRef.current, move.san)}`,
          ]);
        } else {
          onCoachUpdate?.([`⚠️ Ungültiger Engine-Zug: ${from} → ${to}`]);
        }

        setThinking(false);
      }
    };

    return () => engine.terminate();
  }, []);

  // === Spielerzug Handler ===
  const handleDrop = async (from: string, to: string) => {
    if (thinking || chessRef.current.isGameOver()) return false;

    // Versuche den Zug auf einer Kopie des Boards
    const clone = new Chess(chessRef.current.fen());
    let move = null;

    try {
      move = clone.move({ from, to, promotion: "q" });
    } catch {
      move = null;
    }

    if (!move) {
      setMessage("❌ Ungültiger Zug! Bitte wähle einen legalen Zug.");
      return false;
    }

    // Valid: ziehe auf dem echten Board
    chessRef.current.move({ from, to, promotion: "q" } as any);

    setMessage("KI denkt nach...");
    onCoachUpdate?.([
      `🟢 Du ziehst ${move.san}`,
      `🧩 Tipp: ${suggestImprovement(chessRef.current)}`,
    ]);

    // Engine Zug starten
    setThinking(true);
    setTimeout(() => {
      if (engineRef.current) {
        const moveCount = chessRef.current.history().length;
        const dynamicLevel = Math.min(20, Math.max(1, Math.floor(level + moveCount / 5)));
        setLevel(dynamicLevel);
        engineRef.current.postMessage(`setoption name Skill Level value ${dynamicLevel}`);
        engineRef.current.postMessage(`position fen ${chessRef.current.fen()}`);
        engineRef.current.postMessage("go movetime 1000");
      }
    }, 300);

    return true;
  };

  return (
    <div className="flex flex-col items-center mt-4 space-y-4">
      <h2 className="text-xl text-yellow-400">{message}</h2>

      <div style={{ width: 500, height: 500 }}>
        <Chessboard
          position={chessRef.current.fen()}
          onPieceDrop={(from, to) => handleDrop(from, to)}
          boardWidth={500}
          arePiecesDraggable={!thinking}
          customBoardStyle={{
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        />
      </div>

     
    </div>
  );
}
