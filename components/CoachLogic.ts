import { Chess } from "chess.js";

/**
 * Analysiert die aktuelle Stellung und gibt eine einfache Erklärung.
 */
export function explainMove(game: Chess, move: string): string {
  const lastMove = move || game.history().slice(-1)[0];
  if (!lastMove) return "Keine Züge bisher.";

  // Ein paar simple Heuristiken
  if (lastMove.includes("x")) {
    return "Das war ein Schlagzug – eine Figur wurde geschlagen.";
  } else if (lastMove.includes("+")) {
    return "Schach! Das war ein starker Zug, der den König bedroht.";
  } else if (lastMove.includes("O-O")) {
    return "Rochade – das verbessert die Sicherheit deines Königs.";
  }

  const moveCount = game.history().length;
  if (moveCount < 10) return "Fokus auf Entwicklung und Kontrolle des Zentrums.";
  if (moveCount < 20) return "Beachte die Figurenaktivität – öffne Linien für deine Türme.";
  return "Endspielphase – aktiviere deinen König und achte auf Freibauern.";
}

/**
 * Gibt Tipps für den Spieler basierend auf der Stellung.
 */
export function suggestImprovement(game: Chess): string {
  if (game.isCheck()) return "Achtung! Dein König steht im Schach.";
  if (game.isCheckmate()) return "Schachmatt – analysiere, wie du das nächste Mal fliehen kannst.";
  if (game.isDraw()) return "Unentschieden – gutes Ergebnis gegen einen starken Gegner.";

  const mobility = game.moves().length;
  if (mobility < 10) return "Deine Figuren sind etwas eingeschränkt. Versuche, mehr Raum zu gewinnen.";
  if (mobility > 40) return "Sehr dynamische Stellung – achte auf Taktiken!";
  return "Position ist ausgeglichen – bleib aufmerksam.";
}
