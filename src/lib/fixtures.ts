/** WC26 fixture catalog — schedule metadata (live data comes from the local API). */

export type Fixture = {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  stage: string;
  kickoff: string;
  venue: string;
  status: "live" | "upcoming";
  score: string;
  minute: string;
  /** Default possession / shots for live analysis form */
  homePossession: number;
  homeShots: number;
  awayShots: number;
};

export const FIXTURES: Fixture[] = [
  {
    id: "can-mar",
    home: "Canada",
    away: "Morocco",
    homeFlag: "🇨🇦",
    awayFlag: "🇲🇦",
    stage: "R16",
    kickoff: "Jul 8 · 16:00 ET",
    venue: "Toronto",
    status: "live",
    score: "1 - 1",
    minute: "67'",
    homePossession: 52,
    homeShots: 5,
    awayShots: 4,
  },
  {
    id: "fra-par",
    home: "France",
    away: "Paraguay",
    homeFlag: "🇫🇷",
    awayFlag: "🇵🇾",
    stage: "R16",
    kickoff: "Jul 8 · 20:00 ET",
    venue: "MetLife",
    status: "live",
    score: "2 - 1",
    minute: "67'",
    homePossession: 65,
    homeShots: 8,
    awayShots: 3,
  },
  {
    id: "bra-eng",
    home: "Brazil",
    away: "England",
    homeFlag: "🇧🇷",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    stage: "QF",
    kickoff: "Jul 11 · 15:00 ET",
    venue: "AT&T",
    status: "upcoming",
    score: "0 - 0",
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
    venue: "SoFi",
    status: "upcoming",
    score: "0 - 0",
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
    venue: "Lumen",
    status: "upcoming",
    score: "0 - 0",
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
    venue: "MetLife",
    status: "upcoming",
    score: "0 - 0",
    minute: "—",
    homePossession: 50,
    homeShots: 0,
    awayShots: 0,
  },
];

export function getFixture(id: string) {
  return FIXTURES.find((f) => f.id === id) ?? FIXTURES[0];
}
