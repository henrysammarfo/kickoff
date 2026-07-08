export const MATCHES = [
  { id: "can-mar", home: "Canada", away: "Morocco", homeFlag: "🇨🇦", awayFlag: "🇲🇦", stage: "R16", kickoff: "Jul 8 · 16:00 ET", venue: "Toronto", peers: 812, status: "live" as const, score: "1 - 1", minute: "67'" },
  { id: "fra-par", home: "France", away: "Paraguay", homeFlag: "🇫🇷", awayFlag: "🇵🇾", stage: "R16", kickoff: "Jul 8 · 20:00 ET", venue: "MetLife", peers: 2431, status: "upcoming" as const, score: "0 - 0", minute: "—" },
  { id: "bra-eng", home: "Brazil", away: "England", homeFlag: "🇧🇷", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", stage: "QF", kickoff: "Jul 11 · 15:00 ET", venue: "AT&T", peers: 3902, status: "upcoming" as const, score: "0 - 0", minute: "—" },
  { id: "arg-ger", home: "Argentina", away: "Germany", homeFlag: "🇦🇷", awayFlag: "🇩🇪", stage: "QF", kickoff: "Jul 11 · 20:00 ET", venue: "SoFi", peers: 4188, status: "upcoming" as const, score: "0 - 0", minute: "—" },
  { id: "esp-ned", home: "Spain", away: "Netherlands", homeFlag: "🇪🇸", awayFlag: "🇳🇱", stage: "QF", kickoff: "Jul 12 · 15:00 ET", venue: "Lumen", peers: 1247, status: "upcoming" as const, score: "0 - 0", minute: "—" },
  { id: "por-usa", home: "Portugal", away: "USA", homeFlag: "🇵🇹", awayFlag: "🇺🇸", stage: "QF", kickoff: "Jul 12 · 20:00 ET", venue: "MetLife", peers: 1893, status: "upcoming" as const, score: "0 - 0", minute: "—" },
];

export const WALLET = {
  balance: 428.55,
  currency: "USDt",
  address: "0x9f2c…8e14",
  tx: [
    { id: 1, type: "tip_out" as const, to: "peer:a8f3", amount: -5, note: "🔥 call on France's press", ts: "12m ago" },
    { id: 2, type: "tip_in" as const, from: "peer:c221", amount: 2, note: "nice AI read", ts: "38m ago" },
    { id: 3, type: "pool_join" as const, to: "pool:fra-par:1st-goal", amount: -10, note: "Mbappé to open scoring", ts: "1h ago" },
    { id: 4, type: "pool_win" as const, from: "pool:can-mar:htft", amount: 42, note: "Half-time Canada, full-time draw", ts: "yesterday" },
    { id: 5, type: "tip_out" as const, to: "peer:ff01", amount: -3, note: "tactical thread", ts: "2d ago" },
  ],
};

export const POOLS = [
  { id: "p1", match: "France vs Paraguay", question: "First scorer", entry: 10, pot: 340, entries: 34, status: "open" as const, closes: "20:00 ET" },
  { id: "p2", match: "Canada vs Morocco", question: "Full-time result", entry: 5, pot: 185, entries: 37, status: "live" as const, closes: "in 23 min" },
  { id: "p3", match: "Brazil vs England", question: "Over 2.5 goals", entry: 20, pot: 780, entries: 39, status: "open" as const, closes: "Jul 11" },
];

export const ROOMS = [
  { id: "r1", match: "France vs Paraguay", peers: 2431, unread: 42, topic: "b3a4…ff02" },
  { id: "r2", match: "Canada vs Morocco", peers: 812, unread: 128, topic: "9c1e…7b02" },
  { id: "r3", match: "General · WC26", peers: 8291, unread: 5, topic: "0000…kick" },
];

export const AI_MODELS = [
  { id: "phi3", name: "Phi-3 Mini 4K", size: "2.3 GB", status: "active" as const, tokens: "142/s", ram: "3.1 GB" },
  { id: "llama32", name: "Llama 3.2 3B", size: "1.9 GB", status: "downloaded" as const, tokens: "168/s", ram: "2.7 GB" },
  { id: "mistral7", name: "Mistral 7B v0.3", size: "4.1 GB", status: "not-downloaded" as const, tokens: "—", ram: "6.8 GB" },
];
