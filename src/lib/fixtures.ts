/** WC26 fixture catalog — offline fallback when API is down; keep in sync with api/data/fixtures-catalog.js */

export type Fixture = {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  stage: string;
  kickoff: string;
  venue: string;
  status: "live" | "upcoming" | "finished";
  score: string;
  minute: string;
  homePossession: number;
  homeShots: number;
  awayShots: number;
  recentEvents?: string[];
  roomKey?: string;
};

export const FIXTURES: Fixture[] = [
  {
    id: "can-mar",
    home: "Canada",
    away: "Morocco",
    homeFlag: "🇨🇦",
    awayFlag: "🇲🇦",
    stage: "R16",
    kickoff: "Jul 5 · 16:00 ET",
    venue: "Toronto",
    status: "finished",
    score: "0 - 2",
    minute: "FT",
    homePossession: 48,
    homeShots: 6,
    awayShots: 9,
    recentEvents: ["Goal 23'", "Goal 78'"],
  },
  {
    id: "fra-par",
    home: "France",
    away: "Paraguay",
    homeFlag: "🇫🇷",
    awayFlag: "🇵🇾",
    stage: "R16",
    kickoff: "Jul 6 · 20:00 ET",
    venue: "MetLife",
    status: "finished",
    score: "2 - 1",
    minute: "FT",
    homePossession: 61,
    homeShots: 14,
    awayShots: 7,
    recentEvents: ["Goal 34'", "Goal 71'", "Goal 88'"],
  },
  {
    id: "bra-eng",
    home: "Brazil",
    away: "England",
    homeFlag: "🇧🇷",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    stage: "QF",
    kickoff: "Jul 11 · 15:00 ET",
    venue: "AT&T Stadium",
    status: "upcoming",
    score: "—",
    minute: "—",
    homePossession: 50,
    homeShots: 0,
    awayShots: 0,
  },
  {
    id: "arg-ger",
    home: "Argentina",
    away: "Germany",
    homeFlag: "🇦🇷",
    awayFlag: "🇩🇪",
    stage: "QF",
    kickoff: "Jul 11 · 20:00 ET",
    venue: "SoFi Stadium",
    status: "upcoming",
    score: "—",
    minute: "—",
    homePossession: 50,
    homeShots: 0,
    awayShots: 0,
  },
  {
    id: "esp-ned",
    home: "Spain",
    away: "Netherlands",
    homeFlag: "🇪🇸",
    awayFlag: "🇳🇱",
    stage: "QF",
    kickoff: "Jul 12 · 15:00 ET",
    venue: "Lumen Field",
    status: "upcoming",
    score: "—",
    minute: "—",
    homePossession: 50,
    homeShots: 0,
    awayShots: 0,
  },
  {
    id: "por-usa",
    home: "Portugal",
    away: "USA",
    homeFlag: "🇵🇹",
    awayFlag: "🇺🇸",
    stage: "QF",
    kickoff: "Jul 12 · 20:00 ET",
    venue: "MetLife Stadium",
    status: "upcoming",
    score: "—",
    minute: "—",
    homePossession: 50,
    homeShots: 0,
    awayShots: 0,
  },
];

export function getFixture(id: string): Fixture | undefined {
  return FIXTURES.find((f) => f.id === id);
}
