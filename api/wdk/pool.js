/**
 * Prediction pools — hackathon admin model with WDK settlement
 */

import { randomUUID } from "crypto";

export class PredictionPool {
  constructor(walletInstance, tipper) {
    this.walletInstance = walletInstance;
    this.tipper = tipper;
    this.pools = new Map();
  }

  createPool({ matchName, stakeUsdt, closesAtMinute = 0 }) {
    const poolId = randomUUID().slice(0, 8);

    const pool = {
      id: poolId,
      matchName,
      stakeUsdt: Number(stakeUsdt),
      closesAtMinute,
      totalPot: 0,
      entries: [],
      status: "open",
      winner: null,
      createdAt: Date.now(),
      adminAddress: null,
    };

    this.pools.set(poolId, pool);
    return pool;
  }

  async joinPool(poolId, prediction, fanWalletAddress, txHash = null) {
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error("Pool not found");
    if (pool.status !== "open") throw new Error("Pool is closed");
    if (pool.entries.find((e) => e.walletAddress === fanWalletAddress)) {
      throw new Error("Already in this pool");
    }

    const adminAddress = await this.walletInstance.getAddressAsync();

    const entry = {
      fanId: `fan_${pool.entries.length + 1}`,
      walletAddress: fanWalletAddress,
      prediction,
      stakeUsdt: pool.stakeUsdt,
      joinedAt: Date.now(),
      txHash: txHash || null,
      confirmed: Boolean(txHash),
    };

    pool.entries.push(entry);
    if (txHash) pool.totalPot += pool.stakeUsdt;
    pool.adminAddress = adminAddress;

    return {
      poolId,
      entry,
      totalPot: pool.totalPot,
      entryCount: pool.entries.length,
      adminAddress,
      paymentNote: `KICKOFF Pool ${poolId}`,
    };
  }

  confirmPayment(poolId, fanWalletAddress, txHash) {
    const pool = this.pools.get(poolId);
    const entry = pool?.entries.find((e) => e.walletAddress === fanWalletAddress);
    if (!entry) throw new Error("Entry not found");
    if (!entry.txHash) {
      entry.txHash = txHash;
      entry.confirmed = true;
      pool.totalPot += pool.stakeUsdt;
    }
    return entry;
  }

  async settlePool(poolId, actualResult) {
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error("Pool not found");

    pool.status = "settling";

    const confirmedEntries = pool.entries.filter((e) => e.txHash);
    if (confirmedEntries.length === 0) {
      throw new Error("No confirmed entries");
    }

    let winner = null;
    let lowestError = Infinity;

    for (const entry of confirmedEntries) {
      const homeError = Math.abs(
        entry.prediction.homeGoals - actualResult.homeGoals,
      );
      const awayError = Math.abs(
        entry.prediction.awayGoals - actualResult.awayGoals,
      );
      const totalError = homeError + awayError;

      if (totalError < lowestError) {
        lowestError = totalError;
        winner = entry;
      }
    }

    if (!winner) throw new Error("Could not determine winner");

    const potAmount = pool.totalPot || pool.stakeUsdt;
    const tx = await this.tipper.tip(
      winner.walletAddress,
      potAmount,
      `KICKOFF Pool ${poolId} Winner ${actualResult.homeGoals}-${actualResult.awayGoals}`,
    );

    pool.status = "settled";
    pool.winner = {
      ...winner,
      wonPot: potAmount,
      settleTxHash: tx.txHash,
    };

    return pool;
  }

  getPool(poolId) {
    return this.pools.get(poolId);
  }

  getAllPools() {
    return Array.from(this.pools.values());
  }
}
