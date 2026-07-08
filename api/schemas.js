import { z } from "zod";

export const MatchAnalysisRequestSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  score: z.string().min(1),
  minute: z.union([z.string(), z.number()]),
  homePossession: z.union([z.string(), z.number()]),
  homeShots: z.union([z.string(), z.number()]),
  awayShots: z.union([z.string(), z.number()]),
  recentEvents: z.array(z.string()).optional().default([]),
});

export const MatchPredictionRequestSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  context: z.string().optional().default(""),
});

export const P2PMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    peerId: z.string(),
    match: z.string(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("chat"),
    peerId: z.string(),
    text: z.string(),
    aiAnalysis: z.unknown().optional().nullable(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("tip"),
    from: z.string(),
    to: z.string(),
    amount: z.number(),
    txHash: z.string(),
    message: z.string().optional(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("pool"),
    poolId: z.string(),
    action: z.enum(["created", "joined", "won"]),
    entry: z.unknown().optional(),
    peerId: z.string(),
    timestamp: z.number(),
  }),
]);

export const TipRequestSchema = z.object({
  recipientAddress: z.string().min(1),
  amountUsdt: z.union([z.string(), z.number()]),
  note: z.string().optional().default(""),
});

export const CreatePoolRequestSchema = z.object({
  matchName: z.string().min(1),
  stakeUsdt: z.union([z.string(), z.number()]),
});

export const JoinPoolRequestSchema = z.object({
  prediction: z.object({
    homeGoals: z.number().int().min(0),
    awayGoals: z.number().int().min(0),
  }),
  fanWalletAddress: z.string().min(1),
  txHash: z.string().optional(),
});

export const SettlePoolRequestSchema = z.object({
  actualResult: z.object({
    homeGoals: z.number().int().min(0),
    awayGoals: z.number().int().min(0),
  }),
});

export const RoomJoinRequestSchema = z.object({
  matchName: z.string().min(1),
});

export const RoomMessageRequestSchema = z.object({
  matchName: z.string().min(1),
  text: z.string().min(1),
  aiAnalysis: z.unknown().optional().nullable(),
});
