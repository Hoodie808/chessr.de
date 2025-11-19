export default function StartPage() {
  return (
    <div className="w-screen h-screen flex">
      {/* Linke Seite – Einführung */}
      <a
        href="/einfuehrung"
        className="w-1/2 h-full bg-black/60 hover:bg-black/80 transition flex items-center justify-center text-white text-4xl font-bold"
      >
        Einführung
      </a>

      {/* Rechte Seite – Spielen */}
      <a
        href="/play"
        className="w-1/2 h-full bg-yellow-600 hover:bg-yellow-700 transition flex items-center justify-center text-white text-4xl font-bold"
      >
        Gegen KI spielen
      </a>
    </div>
  );
}
