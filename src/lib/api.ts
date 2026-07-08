const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  "http://127.0.0.1:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = data as { error?: string | object };
    const msg =
      typeof err?.error === "string"
        ? err.error
        : `API ${res.status}: ${path}`;
    throw new Error(msg);
  }

  return data as T;
}

export type HealthResponse = {
  status: string;
  qvac: boolean;
  qvacMode: string;
  wallet: boolean;
  activeRooms: number;
  teamNation: string;
};

export type AiStatusResponse = {
  ready: boolean;
  mode: string;
  model: string;
  modelId: string | null;
  runningLocally: boolean;
  noCloudDependency: boolean;
};

export type MatchAnalysisResponse = {
  raw: string;
  analysis: string;
  prediction: string;
  confidence: number;
  processingTimeMs: number;
  model: string;
  ranLocally: boolean;
  mode: string;
  deviceInference: boolean;
  message?: string;
};

export type WalletBalanceResponse = {
  usdt: number;
  eth: number;
  address: string;
  network: string;
  tokenAddress: string;
};

export type Pool = {
  id: string;
  matchName: string;
  stakeUsdt: number;
  totalPot: number;
  entries: unknown[];
  status: string;
  createdAt: number;
};

export type P2PMessage = {
  type: string;
  peerId: string;
  text?: string;
  timestamp: number;
  aiAnalysis?: unknown;
  local?: boolean;
};

export const kickoffApi = {
  health: () => request<HealthResponse>("/api/health"),

  aiStatus: () => request<AiStatusResponse>("/api/ai/status"),

  analyzeMatch: (body: {
    homeTeam: string;
    awayTeam: string;
    score: string;
    minute: string | number;
    homePossession: string | number;
    homeShots: string | number;
    awayShots: string | number;
    recentEvents?: string[];
  }) =>
    request<MatchAnalysisResponse>("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  predictMatch: (body: {
    homeTeam: string;
    awayTeam: string;
    context?: string;
  }) =>
    request<{ prediction: string }>("/api/ai/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  joinRoom: (matchName: string) =>
    request<{
      matchName: string;
      peers: number;
      topic: string;
      peerId: string;
      p2p: boolean;
    }>("/api/rooms/join", {
      method: "POST",
      body: JSON.stringify({ matchName }),
    }),

  sendRoomMessage: (
    matchName: string,
    text: string,
    aiAnalysis?: unknown,
  ) =>
    request<{ sent: boolean }>("/api/rooms/message", {
      method: "POST",
      body: JSON.stringify({ matchName, text, aiAnalysis }),
    }),

  getRoomMessages: (matchName: string) =>
    request<{ messages: P2PMessage[] }>(
      `/api/rooms/${encodeURIComponent(matchName)}/messages`,
    ),

  walletBalance: () => request<WalletBalanceResponse>("/api/wallet/balance"),

  walletAddress: () => request<{ address: string }>("/api/wallet/address"),

  tip: (recipientAddress: string, amountUsdt: number, note?: string) =>
    request<{
      success: boolean;
      txHash: string;
      amount: number;
      currency: string;
    }>("/api/wallet/tip", {
      method: "POST",
      body: JSON.stringify({ recipientAddress, amountUsdt, note }),
    }),

  listPools: () => request<{ pools: Pool[] }>("/api/pools"),

  createPool: (matchName: string, stakeUsdt: number) =>
    request<Pool>("/api/pools/create", {
      method: "POST",
      body: JSON.stringify({ matchName, stakeUsdt }),
    }),

  joinPool: (
    poolId: string,
    prediction: { homeGoals: number; awayGoals: number },
    fanWalletAddress: string,
    txHash?: string,
  ) =>
    request<unknown>(`/api/pools/${poolId}/join`, {
      method: "POST",
      body: JSON.stringify({ prediction, fanWalletAddress, txHash }),
    }),
};

export function matchRoomKey(home: string, away: string, stage = "R16") {
  return `${home}-${away}-${stage}`;
}

export function truncateAddress(addr: string, chars = 4) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-chars)}`;
}
