import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kickoffApi } from "@/lib/api";

export function useHealth() {
  return useQuery({
    queryKey: ["kickoff", "health"],
    queryFn: () => kickoffApi.health(),
    refetchInterval: 15_000,
    retry: 1,
  });
}

export function useWallet() {
  return useQuery({
    queryKey: ["kickoff", "wallet"],
    queryFn: () => kickoffApi.walletBalance(),
    refetchInterval: 10_000,
    retry: 1,
  });
}

export function useAiStatus() {
  return useQuery({
    queryKey: ["kickoff", "ai", "status"],
    queryFn: () => kickoffApi.aiStatus(),
    refetchInterval: 10_000,
    retry: 1,
  });
}

export function usePools() {
  return useQuery({
    queryKey: ["kickoff", "pools"],
    queryFn: async () => {
      const res = await kickoffApi.listPools();
      return res.pools;
    },
    refetchInterval: 8_000,
    retry: 1,
  });
}

export function useRoomMessages(matchName: string | null, enabled = true) {
  return useQuery({
    queryKey: ["kickoff", "room", matchName, "messages"],
    queryFn: () => kickoffApi.getRoomMessages(matchName!),
    enabled: Boolean(matchName) && enabled,
    refetchInterval: 2_000,
    retry: 1,
  });
}

export function useAnalyzeMatch() {
  return useMutation({
    mutationFn: kickoffApi.analyzeMatch,
  });
}

export function useJoinRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchName: string) => kickoffApi.joinRoom(matchName),
    onSuccess: (_data, matchName) => {
      qc.invalidateQueries({ queryKey: ["kickoff", "room", matchName] });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      matchName,
      text,
      aiAnalysis,
    }: {
      matchName: string;
      text: string;
      aiAnalysis?: unknown;
    }) => kickoffApi.sendRoomMessage(matchName, text, aiAnalysis),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({
        queryKey: ["kickoff", "room", vars.matchName, "messages"],
      });
    },
  });
}

export function useTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      recipientAddress,
      amountUsdt,
      note,
    }: {
      recipientAddress: string;
      amountUsdt: number;
      note?: string;
    }) => kickoffApi.tip(recipientAddress, amountUsdt, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kickoff", "wallet"] });
    },
  });
}

export function useCreatePool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      matchName,
      stakeUsdt,
    }: {
      matchName: string;
      stakeUsdt: number;
    }) => kickoffApi.createPool(matchName, stakeUsdt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kickoff", "pools"] });
    },
  });
}

export function useJoinPool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      poolId,
      prediction,
      fanWalletAddress,
    }: {
      poolId: string;
      prediction: { homeGoals: number; awayGoals: number };
      fanWalletAddress: string;
    }) => kickoffApi.joinPool(poolId, prediction, fanWalletAddress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kickoff", "pools"] });
    },
  });
}

export function useSettlePool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      poolId,
      actualResult,
    }: {
      poolId: string;
      actualResult: { homeGoals: number; awayGoals: number };
    }) => kickoffApi.settlePool(poolId, actualResult),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kickoff", "pools"] });
    },
  });
}

export function useLiveMatches() {
  return useQuery({
    queryKey: ["kickoff", "matches", "live"],
    queryFn: () => kickoffApi.liveMatches(),
    refetchInterval: 60_000,
    retry: 1,
  });
}

export function useLiveMatch(matchId: string) {
  return useQuery({
    queryKey: ["kickoff", "matches", "live", matchId],
    queryFn: () => kickoffApi.liveMatch(matchId),
    refetchInterval: 30_000,
    retry: 1,
  });
}

export function useLiveDataStatus() {
  return useQuery({
    queryKey: ["kickoff", "matches", "status"],
    queryFn: () => kickoffApi.liveMatchesStatus(),
    refetchInterval: 30_000,
    retry: 1,
  });
}

export function useRefreshLiveMatches() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => kickoffApi.refreshLiveMatches(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kickoff", "matches"] });
    },
  });
}
