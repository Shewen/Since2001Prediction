export function evaluatePrediction(
  prediction,
  homeScore,
  awayScore,
  homeTeam,
  awayTeam
) {
  const home = Number(homeScore);
  const away = Number(awayScore);

  if (Number.isNaN(home) || Number.isNaN(away)) {
    return "pending";
  }

  const text = prediction
    ?.toLowerCase()
    .trim();

  const homeWin = home > away;
  const draw = home === away;
  const awayWin = away > home;
  const totalGoals = home + away;

  // Home team to win
  if (
    text.includes(`${homeTeam.toLowerCase()} to win`) ||
    text === homeTeam.toLowerCase()
  ) {
    return homeWin ? "won" : "lost";
  }

  // Away team to win
  if (
    text.includes(`${awayTeam.toLowerCase()} to win`) ||
    text === awayTeam.toLowerCase()
  ) {
    return awayWin ? "won" : "lost";
  }

  // Draw
  if (text === "draw" || text.includes("draw")) {
    return draw ? "won" : "lost";
  }

  // Double chance - home or draw
  if (
    text.includes("or draw") &&
    text.includes(homeTeam.toLowerCase())
  ) {
    return homeWin || draw ? "won" : "lost";
  }

  // Double chance - away or draw
  if (
    text.includes("or draw") &&
    text.includes(awayTeam.toLowerCase())
  ) {
    return awayWin || draw ? "won" : "lost";
  }

  // Over 2.5 goals
  if (
    text.includes("over 2.5") ||
    text.includes("over 2,5")
  ) {
    return totalGoals > 2.5 ? "won" : "lost";
  }

  // Under 2.5 goals
  if (
    text.includes("under 2.5") ||
    text.includes("under 2,5")
  ) {
    return totalGoals < 2.5 ? "won" : "lost";
  }

  // Both teams to score
  if (
    text.includes("both teams to score") ||
    text.includes("btts")
  ) {
    return home > 0 && away > 0
      ? "won"
      : "lost";
  }

  // If the prediction format is unknown
  return "pending";
}