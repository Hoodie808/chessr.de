"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoom, setZoom] = useState(1.05);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setOffsetX(x);
      setOffsetY(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Sanfter Zoom-Effekt
  useEffect(() => {
    const interval = setInterval(() => {
      setZoom((prev) => (prev === 1.05 ? 1.1 : 1.05));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Animiertes Hintergrundbild */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          backgroundImage: "url('/Chessr Wallpaper.png')",
          backgroundSize: "cover",
          backgroundPosition: `${50 + offsetX}% ${50 + offsetY}%`,
          transform: `scale(${zoom})`,
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.8)",
        }}
      />

      {/* Dunkles Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Inhalt */}
      <div className="relative z-10 flex flex-col items-center text-white p-10 animate-fadeIn">
        <Image src="/logo.svg" alt="Logo" width={400} height={10} priority />
        <h1 className="text-5xl font-bold mt-6 drop-shadow-lg">
          Dein digitaler Lernpartner
        </h1>
        <p className="mt-4 text-xl text-gray-200 max-w-xl drop-shadow-md">
          Lerne Schach mit 3D-Board & persönlichem KI-Coach.
        </p>
        <Link href="/start" className="mt-8 bg-black text-white px-8 py-3 rounded-xl text-lg">
            Jetzt starten
        </Link>

      </div>
    </div>
  );
}
