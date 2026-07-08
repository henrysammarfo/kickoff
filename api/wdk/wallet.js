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

const USDT_TOKEN_ADDRESS =
  process.env.WDK_USDT_TOKEN_ADDRESS ||
  "0xaA8E23Fb1079EA71e0a56F48aEAfaFd942E645a6"; // Sepolia test USDT (verify on your network)

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

  async getBalance() {
    if (!this.account) throw new Error("Wallet not initialized");

    const address = await this.account.getAddress();
    const ethBalance = await this.account.getBalance();

    let usdt = 0n;
    try {
      usdt = await this.account.getTokenBalance(USDT_TOKEN_ADDRESS);
    } catch {
      /* token may not exist on this RPC */
    }

    return {
      usdt: Number(usdt) / 1e6,
      usdtRaw: usdt.toString(),
      eth: Number(ethBalance) / 1e18,
      ethRaw: ethBalance.toString(),
      usat: 0,
      xaut: 0,
      address,
      network: this.network,
      tokenAddress: USDT_TOKEN_ADDRESS,
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
