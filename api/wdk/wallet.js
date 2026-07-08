/**
 * WDK Self-Custodial Wallet — @tetherto/wdk
 */

import fs from "fs";
import path from "path";
import os from "os";
import WDK from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";

const WALLET_DIR = path.join(
  process.env.KICKOFF_HOME || path.join(os.homedir(), ".kickoff"),
);
const WALLET_FILE = path.join(WALLET_DIR, "wallet.json");

const DEFAULT_PROVIDER =
  process.env.WDK_EVM_PROVIDER || "https://ethereum-sepolia-rpc.publicnode.com";

const WDK_OFFICIAL_SEPOLIA_USDT =
  "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";

/** Known Sepolia test USDT contracts (many faucets mint different ERC-20s). */
const SEPOLIA_USDT_CANDIDATES = [
  process.env.WDK_USDT_TOKEN_ADDRESS,
  WDK_OFFICIAL_SEPOLIA_USDT,
  "0xd077A400968890Eacc75cdc901F0356c943e4fDb", // Crypto Chief / Etherscan "Tether USD"
  "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", // Common mintable test USDT
].filter(Boolean);

function uniqueTokenAddresses(addresses) {
  const seen = new Set();
  return addresses.filter((address) => {
    const key = address.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export class KickoffWallet {
  constructor() {
    this.wdk = null;
    this.account = null;
    this.blockchain = "ethereum";
    this.network = process.env.WDK_NETWORK || "sepolia";
  }

  async initialize() {
    fs.mkdirSync(WALLET_DIR, { recursive: true });

    let seedPhrase;
    if (fs.existsSync(WALLET_FILE)) {
      const stored = JSON.parse(fs.readFileSync(WALLET_FILE, "utf8"));
      seedPhrase = stored.seedPhrase;
      console.log("[WDK] Loaded existing KICKOFF wallet");
    } else {
      seedPhrase = WDK.getRandomSeedPhrase();
      fs.writeFileSync(
        WALLET_FILE,
        JSON.stringify(
          {
            seedPhrase,
            name: "KICKOFF Fan Wallet",
            createdAt: new Date().toISOString(),
            warning:
              "Self-custodial seed — never commit this file. Hackathon demo only.",
          },
          null,
          2,
        ),
        { mode: 0o600 },
      );
      console.log("[WDK] Created new self-custodial wallet");
    }

    this.wdk = new WDK(seedPhrase).registerWallet(
      this.blockchain,
      WalletManagerEvm,
      { provider: DEFAULT_PROVIDER },
    );

    this.account = await this.wdk.getAccount(this.blockchain, 0);
    const address = await this.account.getAddress();
    console.log(`[WDK] Wallet address: ${address}`);
    return this.account;
  }

  async resolveUsdtToken() {
    const preferred =
      process.env.WDK_USDT_TOKEN_ADDRESS || WDK_OFFICIAL_SEPOLIA_USDT;
    const candidates = uniqueTokenAddresses(SEPOLIA_USDT_CANDIDATES);

    let best = { address: preferred, balance: 0n };

    for (const tokenAddress of candidates) {
      let balance = 0n;
      try {
        balance = await this.account.getTokenBalance(tokenAddress);
      } catch {
        continue;
      }

      if (balance > best.balance) {
        best = { address: tokenAddress, balance };
      }

      if (
        tokenAddress.toLowerCase() === preferred.toLowerCase() &&
        balance > 0n
      ) {
        return { address: tokenAddress, balance };
      }
    }

    return best;
  }

  async getBalance() {
    if (!this.account) throw new Error("Wallet not initialized");

    const address = await this.account.getAddress();
    const ethBalance = await this.account.getBalance();
    const { address: tokenAddress, balance: usdt } =
      await this.resolveUsdtToken();

    return {
      usdt: Number(usdt) / 1e6,
      usdtRaw: usdt.toString(),
      eth: Number(ethBalance) / 1e18,
      ethRaw: ethBalance.toString(),
      usat: 0,
      xaut: 0,
      address,
      network: this.network,
      tokenAddress,
    };
  }

  getAddress() {
    return this.account?.address ?? null;
  }

  async getAddressAsync() {
    return this.account ? await this.account.getAddress() : null;
  }

  getWallet() {
    return this.account;
  }

  async validateAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  isReady() {
    return Boolean(this.account);
  }
}
