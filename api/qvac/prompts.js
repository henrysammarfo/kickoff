/**
 * Football-specific prompts for QVAC local model
 * The model runs ENTIRELY on the fan's device.
 * No internet connection required for AI analysis.
 */

export const FOOTBALL_ANALYST_SYSTEM = `You are KICKOFF AI, a sharp football analyst providing real-time match intelligence.
You receive live match statistics and respond with concise, confident analysis.
Never say you're an AI. Speak like an experienced football scout.
Keep responses under 100 words. Be specific, be bold, be right.`;

export function buildMatchPrompt({
  homeTeam,
  awayTeam,
  score,
  minute,
  homePossession,
  homeShots,
  awayShots,
  recentEvents = [],
}) {
  const awayPossession = 100 - Number(homePossession);
  const events =
    recentEvents.length > 0 ? `Recent: ${recentEvents.join(", ")}` : "";

  return `Match: ${homeTeam} vs ${awayTeam}
Score: ${score}
Time: ${minute}'
Possession: ${homeTeam} ${homePossession}% | ${awayTeam} ${awayPossession}%
Shots on target: ${homeTeam} ${homeShots} | ${awayTeam} ${awayShots}
${events}

Give me: 1 line tactical observation + 1 line prediction + confidence % (0-100).
Format: [ANALYSIS] ... [PREDICTION] ... [CONFIDENCE: X%]`;
}

export function buildPredictionPrompt({ homeTeam, awayTeam, context = "" }) {
  return `Pre-match: ${homeTeam} vs ${awayTeam}
Context: ${context || "World Cup 2026 knockout round"}

Give me your score prediction and 2 key tactical factors. Under 80 words.`;
}

export function buildGoldenBootPrompt(topScorers) {
  const scorers = topScorers
    .map((s) => `${s.name} (${s.country}): ${s.goals} goals`)
    .join("\n");
  return `Golden Boot Race:\n${scorers}\n\nWho wins and why? Under 60 words.`;
}
