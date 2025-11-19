// pages/einfuehrung.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

// -------------------------------------------------------
// 1) Schachfiguren-Info
// -------------------------------------------------------

const pieces = [
  {
    id: "King",
    name: "König",
    movement: [[0,1],[1,0],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
    description:
      "Der König kann sich ein Feld in jede Richtung bewegen. Wird er bedroht und kann nicht entkommen, ist es Schachmatt.",
  },
  {
    id: "Queen",
    name: "Dame",
    movement: "all-directions",
    description:
      "Die Dame ist die stärkste Figur und kann beliebig weit horizontal, vertikal oder diagonal ziehen.",
  },
  {
    id: "Rook",
    name: "Turm",
    movement: "straight",
    description:
      "Der Turm zieht beliebig weit gerade: vorwärts, rückwärts, links oder rechts.",
  },
  {
    id: "Bishop",
    name: "Läufer",
    movement: "diagonal",
    description:
      "Der Läufer zieht beliebig weit diagonal und bleibt immer auf seiner Feldfarbe.",
  },
  {
    id: "Knight",
    name: "Springer",
    movement: "knight",
    description:
      "Der Springer bewegt sich in einer L-Form und ist die einzige Figur, die über andere Figuren springen kann.",
  },
  {
    id: "Pawn",
    name: "Bauer",
    movement: "pawn",
    description:
      "Bauern ziehen ein Feld vor (vom Start auch zwei), schlagen aber nur diagonal.",
  },
];



// -------------------------------------------------------
// 2) 2D Symbole
// -------------------------------------------------------

const pieceSymbols: Record<string, { White: string; Black: string }> = {
  King: { White: "♔", Black: "♚" },
  Queen: { White: "♕", Black: "♛" },
  Rook: { White: "♖", Black: "♜" },
  Bishop: { White: "♗", Black: "♝" },
  Knight: { White: "♘", Black: "♞" },
  Pawn: { White: "♙", Black: "♟" },
};

// -------------------------------------------------------
// 2) Lade 3D-Modell
// -------------------------------------------------------

function PieceModel({ color, id }: { color: "White" | "Black"; id: string }) {
  const gltf = useLoader(GLTFLoader, `/pieces/${color}_${id}.glb`);

  const cloned = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((child: any) => {
      if (child.isMesh) child.material = child.material.clone();
    });
    return scene;
  }, [gltf]);

  return <primitive object={cloned} scale={1.2} position={[0, 0.5, 0]} />;
}

// -------------------------------------------------------
// 3) Bewegungsmarkierungen
// -------------------------------------------------------

function MovementMarkers({
  type,
  color,
}: {
  type: any;
  color: "White" | "Black";
}) {
  const squares: [number, number][] = [];
  const x0 = 2;
  const y0 = 2;
  const boardSize = 5;

  const add = (dx: number, dy: number) => {
    const x = x0 + dx;
    const y = y0 + dy;
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) squares.push([x, y]);
  };

  if (Array.isArray(type)) {
    type.forEach(([dx, dy]) => add(dx, dy));
  } else if (type === "straight") {
    for (let i = 1; i < boardSize; i++) {
      add(i, 0); add(-i, 0); add(0, i); add(0, -i);
    }
  } else if (type === "diagonal") {
    for (let i = 1; i < boardSize; i++) {
      add(i, i); add(i, -i); add(-i, i); add(-i, -i);
    }
  } else if (type === "all-directions") {
    for (let i = 1; i < boardSize; i++) {
      add(i, 0); add(-i, 0); add(0, i); add(0, -i);
      add(i, i); add(i, -i); add(-i, i); add(-i, -i);
    }
  } else if (type === "knight") {
    [
      [1,2],[2,1],[-1,2],[-2,1],
      [1,-2],[2,-1],[-1,-2],[-2,-1]
    ].forEach(([dx,dy]) => add(dx,dy));
  } else if (type === "pawn") {
    add(0, color === "White" ? 1 : -1);
  }

  return (
    <>
      {squares.map(([x, y], i) => (
        <mesh key={i} position={[x - 2, 0.12, y - 2]}>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="red" opacity={0.8} transparent />
        </mesh>
      ))}
    </>
  );
}

// -------------------------------------------------------
// 4) 3D-Schachbrett
// -------------------------------------------------------

function ChessBoard() {
  const tiles = [];
  const boardSize = 5;

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const isDark = (x + y) % 2 === 1;
      tiles.push(
        <mesh key={`${x}-${y}`} position={[x - 2, 0, y - 2]}>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={isDark ? "#2f2f2f" : "#e0e0e0"} />
        </mesh>
      );
    }
  }

  return <>{tiles}</>;
}

// -------------------------------------------------------
// 5) Hauptseite
// -------------------------------------------------------

export default function EINFUEHRUNG() {
  const [index, setIndex] = useState(0);
  const [color, setColor] = useState<"White" | "Black">("White");

  const piece = pieces[index];

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">Einführung in die Schachfiguren</h1>

      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">

        {/* LEFT SIDE = 3D Teil */}
        <div className="bg-gray-900 p-4 rounded-xl h-[600px]">
          <Canvas camera={{ position: [4, 5, 4] }} style={{ background: "transparent" }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />
            <Environment preset="city" />

            <ChessBoard />
            <PieceModel color={color} id={piece.id} />
            <MovementMarkers type={piece.movement} color={color} />

            <OrbitControls />
          </Canvas>
        </div>

        {/* RIGHT SIDE = Erklärungen */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">
            {piece.name} {pieceSymbols[piece.id][color]}
          </h2>
          <p className="text-gray-300 text-lg mb-8">{piece.description}</p>


          {/* Farbwahl */}
          <div className="mb-4">
            <label className="mr-2 font-semibold">Farbe:</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 p-2 rounded"
            >
              <option value="White">Weiß</option>
              <option value="Black">Schwarz</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIndex((i) => (i === 0 ? pieces.length - 1 : i - 1))}
              className="bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700"
            >
              ◀ Zurück
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % pieces.length)}
              className="bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700"
            >
              Weiter ▶
            </button>
          </div>

          {/* Zurück Link */}
          <Link
            href="/"
            className="block text-center mt-10 underline text-gray-400"
          >
            Zurück zur Hauptseite
          </Link>
        </div>
      </div>
    </div>
  );
}
