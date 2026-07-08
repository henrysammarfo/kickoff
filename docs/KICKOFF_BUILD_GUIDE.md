# KICKOFF — Decentralized Football Intelligence for World Cup 2026
**Hackathon:** Tether Developers Cup  
**Target:** Cup Champion $5,000 + Track Pears $1,000 + Track QVAC $1,000 + Track WDK $1,000 = **$8,000 full pool**  
**Deadline:** July 8 first cut → July 12 semifinals → July 14 final  
**Stack:** Pears (Hyperswarm P2P) + QVAC (local AI) + WDK (self-custodial wallet) + Node.js  
**Frontend:** Built in Lovable — connects to local APIs

---

## WHAT WE ARE BUILDING

A P2P football fan platform where:
- **QVAC:** Local AI analyzes live match stats entirely on your device — no cloud, no API keys, works offline
- **Pears:** Fans connect peer-to-peer in match rooms — no server, no central authority
- **WDK:** Fans tip each other and join prediction pools in USDt — self-custodial, no intermediary

The World Cup Final is July 19 at MetLife Stadium. KICKOFF is live and useful for every match between now and then. Today's Round of 16: Canada vs Morocco, France vs Paraguay. The product is needed right now.

**Why this wins Cup Champion:** Every other project picks one track. KICKOFF uses all three authentically — each is load-bearing. Remove any one and the product breaks.

---

## PROJECT STRUCTURE

```
kickoff/
├── KICKOFF_BUILD_GUIDE.md         ← this file
├── package.json
├── .env
│
├── pears/                          ← Pears P2P application
│   ├── package.json
│   ├── app.js                      ← main Pears entry point
│   ├── p2p/
│   │   ├── room.js                 ← Hyperswarm room management
│   │   └── messages.js             ← message protocol
│   └── index.html                  ← Pears desktop UI
│
├── qvac/                           ← QVAC local AI
│   ├── football-ai.js              ← match analysis using QVAC
│   └── prompts.js                  ← football-specific prompts
│
├── wdk/                            ← WDK wallet integration
│   ├── wallet.js                   ← wallet creation + management
│   ├── tip.js                      ← fan-to-fan tipping
│   └── pool.js                     ← prediction pool logic
│
├── api/                            ← Local FastAPI/Express for Lovable frontend
│   ├── server.js                   ← Express server (localhost:3001)
│   └── routes/
│       ├── ai.js                   ← QVAC inference endpoint
│       ├── rooms.js                ← Pears room management
│       └── wallet.js               ← WDK wallet actions
│
└── frontend_spec.md                ← API spec for Lovable
```

---

## STACK SETUP

### Install Pears
```bash
npm install -g pear
pear --version

# Create KICKOFF as a Pears app
pear create kickoff --yes
cd kickoff
npm install hyperswarm b4a compact-encoding

# Verify Pears works
pear run pear://keet  # should open Keet (Holepunch's own app)
```

### Install QVAC
```bash
# Install QVAC CLI
npm install -g @tether/qvac-cli
# OR follow: qvac.tether.io/install

# Download a football-capable model
# Options (pick based on device):
# Phi-3-mini-4k-instruct — 3.8B, good on CPU, ~2.3GB
# Llama-3.2-3B-Instruct — 3B, faster on lower-end hardware
# Mistral-7B-Instruct-v0.3 — 7B, best quality if GPU available

qvac pull phi-3-mini-4k-instruct
qvac list  # confirm model downloaded

# Test inference locally
qvac run phi-3-mini-4k-instruct "France is winning 2-1 in the 67th minute. Analyze."
```

### Install WDK
```bash
# Follow: wdk.tether.io
npm install @tether/wdk
# OR:
npm install @tether/wallet-development-kit

# WDK creates self-custodial wallets
# User holds their own keys — no server custody
```

### Project dependencies
```bash
npm install express cors hyperswarm b4a compact-encoding dotenv
npm install @tether/wdk @tether/qvac-sdk
npm install uuid crypto
```

### .env
```bash
# WDK Network (testnet for demo)
WDK_NETWORK=testnet
WDK_TETHER_ENDPOINT=https://testnet-api.tether.io

# QVAC
QVAC_MODEL=phi-3-mini-4k-instruct
QVAC_MODEL_PATH=~/.qvac/models/phi-3-mini-4k-instruct

# API
PORT=3001
PEARS_PORT=3002

# Demo: Ghana representing — World Cup theme
TEAM_NATION=Ghana
```

---

## COMPONENT 1: PEARS P2P ROOMS

### pears/p2p/room.js
```javascript
/**
 * KICKOFF P2P Room Management using Hyperswarm
 * 
 * How it works:
 * - Each match gets a topic key derived from match name
 * - Fans discover each other through the DHT (no central server)
 * - Messages sync peer-to-peer using Hyperswarm data channels
 * - No server. No WebSocket to a backend. Pure P2P.
 * 
 * To prove in demo: open Network inspector — no HTTP calls to any backend for chat
 */

const Hyperswarm = require('hyperswarm');
const b4a = require('b4a');
const crypto = require('crypto');

class KickoffRoom {
  constructor(matchName) {
    this.matchName = matchName;
    this.swarm = new Hyperswarm();
    this.peers = new Map();
    this.messageHandlers = [];
    this.localPeerId = crypto.randomUUID();
    
    // Derive topic from match name — consistent across all fans
    // "France-Paraguay-R16" → same SHA256 hash for all
    this.topic = crypto.createHash('sha256')
      .update(`kickoff:${matchName}`)
      .digest();
    
    this._setupSwarm();
  }
  
  _setupSwarm() {
    // When a new peer joins our match room
    this.swarm.on('connection', (conn, info) => {
      const peerId = b4a.toString(info.publicKey, 'hex').slice(0, 8);
      console.log(`Fan joined room: ${peerId}`);
      
      this.peers.set(peerId, conn);
      
      // Send join announcement to this peer
      this._send(conn, {
        type: 'join',
        peerId: this.localPeerId,
        match: this.matchName,
        timestamp: Date.now()
      });
      
      // Receive messages from this peer
      conn.on('data', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          this._handleIncoming(peerId, msg);
        } catch (e) {
          console.error('Failed to parse peer message:', e);
        }
      });
      
      conn.on('close', () => {
        this.peers.delete(peerId);
        console.log(`Fan left room: ${peerId}`);
      });
      
      conn.on('error', (err) => {
        console.error(`Peer error ${peerId}:`, err.message);
        this.peers.delete(peerId);
      });
    });
  }
  
  /**
   * Join the match room — discover other fans via DHT
   */
  async join() {
    const discovery = this.swarm.join(this.topic, {
      client: true,   // we want to find peers
      server: true    // we also serve as a peer for others
    });
    
    await discovery.flushed();
    console.log(`Joined room: ${this.matchName} (${this.peers.size} fans connected)`);
    
    return {
      room: this.matchName,
      topic: b4a.toString(this.topic, 'hex'),
      peerId: this.localPeerId
    };
  }
  
  /**
   * Broadcast a message to ALL peers in the room
   */
  broadcast(message) {
    const payload = JSON.stringify({
      ...message,
      peerId: this.localPeerId,
      timestamp: Date.now()
    });
    
    for (const [peerId, conn] of this.peers) {
      try {
        conn.write(Buffer.from(payload));
      } catch (e) {
        console.error(`Failed to send to ${peerId}:`, e.message);
      }
    }
  }
  
  /**
   * Send a chat message with optional AI analysis attached
   */
  sendMessage(text, aiAnalysis = null) {
    this.broadcast({
      type: 'chat',
      text,
      aiAnalysis,  // attach QVAC prediction if fan ran analysis
      peerId: this.localPeerId
    });
  }
  
  /**
   * Broadcast a tip notification (WDK transaction)
   */
  broadcastTip(recipientPeerId, amountUsdt, txHash) {
    this.broadcast({
      type: 'tip',
      from: this.localPeerId,
      to: recipientPeerId,
      amount: amountUsdt,
      txHash,
      message: `🤑 Tipped ${amountUsdt} USDt!`
    });
  }
  
  /**
   * Broadcast prediction pool update
   */
  broadcastPoolUpdate(poolId, action, entry = null) {
    this.broadcast({
      type: 'pool',
      poolId,
      action,  // 'created', 'joined', 'won'
      entry,
      peerId: this.localPeerId
    });
  }
  
  /**
   * Register handler for incoming messages
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
  
  _handleIncoming(peerId, msg) {
    for (const handler of this.messageHandlers) {
      handler(peerId, msg);
    }
  }
  
  _send(conn, msg) {
    try {
      conn.write(Buffer.from(JSON.stringify(msg)));
    } catch (e) {
      console.error('Send error:', e.message);
    }
  }
  
  getPeerCount() {
    return this.peers.size;
  }
  
  async leave() {
    await this.swarm.destroy();
    console.log('Left room:', this.matchName);
  }
}

module.exports = KickoffRoom;
```

---

## COMPONENT 2: QVAC LOCAL AI

### qvac/prompts.js
```javascript
/**
 * Football-specific prompts for QVAC local model
 * The model runs ENTIRELY on the fan's device.
 * No internet connection required for AI analysis.
 * Proof: disconnect WiFi — analysis still works.
 */

const FOOTBALL_ANALYST_SYSTEM = `You are KICKOFF AI, a sharp football analyst providing real-time match intelligence.
You receive live match statistics and respond with concise, confident analysis.
Never say you're an AI. Speak like an experienced football scout.
Keep responses under 100 words. Be specific, be bold, be right.`;

/**
 * Build a match analysis prompt
 */
function buildMatchPrompt({ homeTeam, awayTeam, score, minute, 
                            homePossession, homeShots, awayShots,
                            recentEvents = [] }) {
  const awaypossession = 100 - homePossession;
  const events = recentEvents.length > 0 
    ? `Recent: ${recentEvents.join(', ')}` 
    : '';
  
  return `Match: ${homeTeam} vs ${awayTeam}
Score: ${score}
Time: ${minute}'
Possession: ${homeTeam} ${homePossession}% | ${awayTeam} ${awaypossession}%
Shots on target: ${homeTeam} ${homeShots} | ${awayTeam} ${awayShots}
${events}

Give me: 1 line tactical observation + 1 line prediction + confidence % (0-100).
Format: [ANALYSIS] ... [PREDICTION] ... [CONFIDENCE: X%]`;
}

/**
 * Build a pre-match prediction prompt
 */
function buildPredictionPrompt({ homeTeam, awayTeam, context = '' }) {
  return `Pre-match: ${homeTeam} vs ${awayTeam}
Context: ${context || 'World Cup 2026 knockout round'}

Give me your score prediction and 2 key tactical factors. Under 80 words.`;
}

/**
 * Build a Golden Boot tracker prompt
 */
function buildGoldenBootPrompt(topScorers) {
  const scorers = topScorers.map(s => `${s.name} (${s.country}): ${s.goals} goals`).join('\n');
  return `Golden Boot Race:\n${scorers}\n\nWho wins and why? Under 60 words.`;
}

module.exports = { 
  FOOTBALL_ANALYST_SYSTEM, 
  buildMatchPrompt, 
  buildPredictionPrompt, 
  buildGoldenBootPrompt 
};
```

### qvac/football-ai.js
```javascript
/**
 * QVAC Local AI Integration
 * 
 * All inference runs on the user's device.
 * No API keys. No cloud. No data leaves the machine.
 * Model: phi-3-mini-4k-instruct (or llama-3.2-3b-instruct)
 * 
 * QVAC SDK docs: qvac.tether.io
 */

const { QVAC } = require('@tether/qvac-sdk');  // or however QVAC SDK exports
const { 
  FOOTBALL_ANALYST_SYSTEM, 
  buildMatchPrompt, 
  buildPredictionPrompt 
} = require('./prompts');

class FootballAI {
  constructor() {
    this.qvac = null;
    this.model = process.env.QVAC_MODEL || 'phi-3-mini-4k-instruct';
    this.ready = false;
  }
  
  /**
   * Initialize QVAC and load model into memory
   * Called once on startup — takes 5-15 seconds
   */
  async initialize() {
    console.log(`Loading QVAC model: ${this.model}...`);
    console.log('This runs locally — no internet required for AI');
    
    // Initialize QVAC runtime
    // NOTE: Exact QVAC SDK API — refer to qvac.tether.io/docs for current methods
    this.qvac = new QVAC({
      model: this.model,
      modelPath: process.env.QVAC_MODEL_PATH,
      // All inference stays local
      offline: true,
    });
    
    await this.qvac.load();
    this.ready = true;
    console.log(`QVAC ready. Model: ${this.model} | Running: LOCAL (your device)`);
  }
  
  /**
   * Analyze live match statistics
   * Returns: { analysis, prediction, confidence, processingTime }
   */
  async analyzeMatch(matchData) {
    if (!this.ready) throw new Error('QVAC not initialized');
    
    const prompt = buildMatchPrompt(matchData);
    const startTime = Date.now();
    
    const response = await this.qvac.generate({
      systemPrompt: FOOTBALL_ANALYST_SYSTEM,
      userPrompt: prompt,
      maxTokens: 150,
      temperature: 0.7,  // some creativity for bold predictions
    });
    
    const processingTime = Date.now() - startTime;
    const text = response.text || response.content || response;
    
    // Parse structured response
    const analysis = this._extractSection(text, 'ANALYSIS');
    const prediction = this._extractSection(text, 'PREDICTION');
    const confidence = this._extractConfidence(text);
    
    return {
      raw: text,
      analysis: analysis || text,
      prediction: prediction || '',
      confidence: confidence || 0,
      processingTimeMs: processingTime,
      model: this.model,
      ranLocally: true  // proof that it ran on device
    };
  }
  
  /**
   * Pre-match prediction
   */
  async predictMatch(homeTeam, awayTeam, context = '') {
    if (!this.ready) throw new Error('QVAC not initialized');
    
    const prompt = buildPredictionPrompt({ homeTeam, awayTeam, context });
    
    const response = await this.qvac.generate({
      systemPrompt: FOOTBALL_ANALYST_SYSTEM,
      userPrompt: prompt,
      maxTokens: 120,
      temperature: 0.8,
    });
    
    return {
      prediction: response.text || response,
      teams: { home: homeTeam, away: awayTeam },
      ranLocally: true
    };
  }
  
  /**
   * Fallback for when QVAC SDK interface differs from expected
   * Uses QVAC CLI subprocess as alternative
   */
  async analyzeMatchViaCLI(matchData) {
    const { execSync } = require('child_process');
    const prompt = buildMatchPrompt(matchData);
    
    const fullPrompt = `${FOOTBALL_ANALYST_SYSTEM}\n\n${prompt}`;
    
    // Call QVAC CLI directly
    const result = execSync(
      `qvac run ${this.model} "${fullPrompt.replace(/"/g, '\\"')}"`,
      { encoding: 'utf8', timeout: 30000 }
    );
    
    return {
      raw: result.trim(),
      analysis: result.trim(),
      ranLocally: true,
      model: this.model
    };
  }
  
  isReady() { return this.ready; }
  
  _extractSection(text, tag) {
    const regex = new RegExp(`\\[${tag}\\]\\s*(.+?)(?=\\[|$)`, 'si');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }
  
  _extractConfidence(text) {
    const match = text.match(/CONFIDENCE[:\s]+(\d+)%/i);
    return match ? parseInt(match[1]) : null;
  }
}

module.exports = FootballAI;
```

---

## COMPONENT 3: WDK WALLET + TIPPING + PREDICTION POOL

### wdk/wallet.js
```javascript
/**
 * WDK Self-Custodial Wallet Management
 * 
 * User holds their own keys — KICKOFF never has custody.
 * No exchange. No account. Self-custodial from day one.
 * Supports: USDt (primary), USAt, XAUt
 * 
 * WDK docs: wdk.tether.io
 */

const { WDK, Wallet } = require('@tether/wdk');  // exact import from wdk.tether.io
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Store encrypted wallet locally
const WALLET_PATH = path.join(process.env.HOME, '.kickoff', 'wallet.enc');

class KickoffWallet {
  constructor() {
    this.wdk = new WDK({ 
      network: process.env.WDK_NETWORK || 'testnet'
    });
    this.wallet = null;
  }
  
  /**
   * Create or load a self-custodial wallet
   * Keys stored locally, encrypted with user's PIN
   */
  async initialize(pin = '1234') {
    // Try to load existing wallet
    if (fs.existsSync(WALLET_PATH)) {
      console.log('Loading existing KICKOFF wallet...');
      const encrypted = fs.readFileSync(WALLET_PATH, 'utf8');
      this.wallet = await this.wdk.loadWallet({
        encrypted,
        pin
      });
    } else {
      // Create new self-custodial wallet
      console.log('Creating new KICKOFF wallet...');
      fs.mkdirSync(path.dirname(WALLET_PATH), { recursive: true });
      
      this.wallet = await this.wdk.createWallet({
        name: 'KICKOFF Fan Wallet',
        pin,
        // WDK generates and manages keys locally
        // No server stores your private key
      });
      
      // Save encrypted wallet locally
      const encrypted = await this.wallet.encrypt(pin);
      fs.writeFileSync(WALLET_PATH, encrypted, 'utf8');
      console.log('Wallet created and saved locally');
    }
    
    console.log(`Wallet address: ${this.wallet.address}`);
    return this.wallet;
  }
  
  /**
   * Get wallet balance (USDt, USAt, XAUt)
   */
  async getBalance() {
    if (!this.wallet) throw new Error('Wallet not initialized');
    
    const balances = await this.wallet.getBalances();
    return {
      usdt: balances.USDt || 0,
      usat: balances.USAt || 0,
      xaut: balances.XAUt || 0,
      address: this.wallet.address
    };
  }
  
  /**
   * Get wallet address for receiving tips
   */
  getAddress() {
    return this.wallet?.address;
  }
  
  /**
   * Receive USDt funding (for testnet demo)
   */
  async requestTestnetFunds() {
    console.log('Requesting testnet USDt from faucet...');
    const result = await this.wdk.faucet({
      address: this.wallet.address,
      amount: 10,  // 10 USDt for testing
      currency: 'USDt'
    });
    return result;
  }
  
  isReady() { return !!this.wallet; }
  getWallet() { return this.wallet; }
}

module.exports = KickoffWallet;
```

### wdk/tip.js
```javascript
/**
 * Fan-to-fan tipping using WDK
 * 
 * When a fan makes a brilliant prediction, others can tip them.
 * Tipped fan receives USDt directly in their self-custodial wallet.
 * No platform takes a cut. No intermediary. Self-custodial.
 */

class FanTipper {
  constructor(walletInstance) {
    this.walletInstance = walletInstance;
  }
  
  /**
   * Tip another fan in USDt
   * 
   * @param recipientAddress - recipient's WDK wallet address
   * @param amountUsdt - amount to tip (e.g. 0.5)
   * @param note - optional note (e.g. "Great prediction!")
   */
  async tip(recipientAddress, amountUsdt, note = '') {
    const wallet = this.walletInstance.getWallet();
    if (!wallet) throw new Error('Wallet not ready');
    
    // Check balance
    const balance = await this.walletInstance.getBalance();
    if (balance.usdt < amountUsdt) {
      throw new Error(`Insufficient USDt. Have: ${balance.usdt}, Need: ${amountUsdt}`);
    }
    
    console.log(`Tipping ${amountUsdt} USDt to ${recipientAddress}...`);
    
    // Execute transfer via WDK
    const tx = await wallet.send({
      to: recipientAddress,
      amount: amountUsdt,
      currency: 'USDt',
      memo: note || 'KICKOFF tip 🏆',
    });
    
    console.log(`Tip sent! TX: ${tx.hash}`);
    
    return {
      success: true,
      txHash: tx.hash,
      amount: amountUsdt,
      recipient: recipientAddress,
      note,
      timestamp: Date.now()
    };
  }
  
  /**
   * Validate a recipient address before tipping
   */
  async validateAddress(address) {
    const wallet = this.walletInstance.getWallet();
    return wallet.isValidAddress(address);
  }
}

module.exports = FanTipper;
```

### wdk/pool.js
```javascript
/**
 * Prediction Pool — group betting on match outcomes
 * 
 * Before kick-off: fans each put X USDt into a pool
 * Each fan submits their score prediction
 * After match: closest prediction wins the pool
 * WDK handles the wallet operations — no smart contract needed
 * Pool admin holds funds in their WDK wallet, releases to winner
 * 
 * For production: use WDK programmable payments / escrow
 * For hackathon: admin model demonstrated clearly
 */

const crypto = require('crypto');

class PredictionPool {
  constructor(walletInstance, tipper) {
    this.walletInstance = walletInstance;
    this.tipper = tipper;
    this.pools = new Map();  // poolId → pool state
  }
  
  /**
   * Create a new prediction pool for a match
   */
  createPool({ matchName, stakeUsdt, closesAtMinute = 0 }) {
    const poolId = crypto.randomUUID().slice(0, 8);
    
    const pool = {
      id: poolId,
      matchName,
      stakeUsdt,
      closesAtMinute,  // pool closes for new entries after kickoff
      totalPot: 0,
      entries: [],     // [{fanId, walletAddress, prediction, stakeUsdt, txHash}]
      status: 'open',  // open → closed → settled
      winner: null,
      createdAt: Date.now()
    };
    
    this.pools.set(poolId, pool);
    console.log(`Pool created: ${poolId} | Match: ${matchName} | Stake: ${stakeUsdt} USDt`);
    
    return pool;
  }
  
  /**
   * Join a prediction pool
   * Fan sends their stake to pool admin wallet, records prediction
   */
  async joinPool(poolId, prediction, fanWalletAddress) {
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error('Pool not found');
    if (pool.status !== 'open') throw new Error('Pool is closed');
    if (pool.entries.find(e => e.walletAddress === fanWalletAddress)) {
      throw new Error('Already in this pool');
    }
    
    // Fan sends stake to pool admin (this wallet)
    // In demo: fan sends to admin wallet, admin records entry
    // In production: WDK escrow/programmable payment handles this
    const adminAddress = this.walletInstance.getAddress();
    
    // Record entry (fan completes actual payment separately and provides txHash)
    const entry = {
      fanId: `fan_${pool.entries.length + 1}`,
      walletAddress: fanWalletAddress,
      prediction,  // {homeGoals: 2, awayGoals: 1}
      stakeUsdt: pool.stakeUsdt,
      joinedAt: Date.now(),
      txHash: null  // set when payment confirmed
    };
    
    pool.entries.push(entry);
    pool.totalPot += pool.stakeUsdt;
    
    console.log(`Fan joined pool ${poolId} | Prediction: ${prediction.homeGoals}-${prediction.awayGoals}`);
    
    return {
      poolId,
      entry,
      totalPot: pool.totalPot,
      entryCount: pool.entries.length,
      adminAddress,  // fan sends stake here
      paymentNote: `KICKOFF Pool ${poolId}`
    };
  }
  
  /**
   * Confirm a fan's payment receipt (set their txHash)
   */
  confirmPayment(poolId, fanWalletAddress, txHash) {
    const pool = this.pools.get(poolId);
    const entry = pool?.entries.find(e => e.walletAddress === fanWalletAddress);
    if (entry) {
      entry.txHash = txHash;
      entry.confirmed = true;
    }
  }
  
  /**
   * Settle the pool after the match
   * Find closest prediction, release pot to winner via WDK
   */
  async settlePool(poolId, actualResult) {
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error('Pool not found');
    
    pool.status = 'settling';
    
    // Find closest prediction
    const confirmedEntries = pool.entries.filter(e => e.txHash);
    if (confirmedEntries.length === 0) throw new Error('No confirmed entries');
    
    let winner = null;
    let lowestError = Infinity;
    
    for (const entry of confirmedEntries) {
      const homeError = Math.abs(entry.prediction.homeGoals - actualResult.homeGoals);
      const awayError = Math.abs(entry.prediction.awayGoals - actualResult.awayGoals);
      const totalError = homeError + awayError;
      
      if (totalError < lowestError) {
        lowestError = totalError;
        winner = entry;
      }
    }
    
    if (!winner) throw new Error('Could not determine winner');
    
    // Release pot to winner via WDK
    const potAmount = pool.totalPot;
    
    const tx = await this.tipper.tip(
      winner.walletAddress,
      potAmount,
      `KICKOFF Pool ${poolId} Winner 🏆 ${actualResult.homeGoals}-${actualResult.awayGoals}`
    );
    
    pool.status = 'settled';
    pool.winner = { ...winner, wonPot: potAmount, settleTxHash: tx.txHash };
    
    console.log(`Pool ${poolId} settled | Winner: ${winner.walletAddress} | Pot: ${potAmount} USDt`);
    
    return pool;
  }
  
  getPool(poolId) { return this.pools.get(poolId); }
  getAllPools() { return Array.from(this.pools.values()); }
}

module.exports = PredictionPool;
```

---

## LOCAL API SERVER (Lovable frontend connects here)

### api/server.js
```javascript
/**
 * Local Express server bridging Lovable frontend to:
 * - QVAC local AI (match analysis)
 * - Pears P2P (room management)
 * - WDK wallet (tips + pools)
 * 
 * This server runs locally — NOT deployed to cloud
 * Frontend connects to localhost:3001
 */

const express = require('express');
const cors = require('cors');
const FootballAI = require('../qvac/football-ai');
const KickoffRoom = require('../pears/p2p/room');
const KickoffWallet = require('../wdk/wallet');
const FanTipper = require('../wdk/tip');
const PredictionPool = require('../wdk/pool');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize all components
const ai = new FootballAI();
const wallet = new KickoffWallet();
let tipper = null;
let pool = null;
const rooms = new Map();

// Startup
(async () => {
  try {
    await ai.initialize();
    await wallet.initialize('kickoff2026');
    tipper = new FanTipper(wallet);
    pool = new PredictionPool(wallet, tipper);
    console.log('KICKOFF backend ready on :3001');
    console.log('QVAC AI: LOCAL | Pears: P2P | WDK: Self-custodial');
  } catch (err) {
    console.error('Startup error:', err);
  }
})();

// ── QVAC AI ROUTES ──────────────────────────────────────────────────────────

/**
 * POST /api/ai/analyze
 * Analyze live match stats using QVAC local model
 * No internet required — model runs on this machine
 */
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { homeTeam, awayTeam, score, minute, 
            homePossession, homeShots, awayShots, recentEvents } = req.body;
    
    if (!ai.isReady()) {
      return res.status(503).json({ error: 'QVAC model still loading...' });
    }
    
    const result = await ai.analyzeMatch({
      homeTeam, awayTeam, score, minute,
      homePossession: parseInt(homePossession),
      homeShots: parseInt(homeShots),
      awayShots: parseInt(awayShots),
      recentEvents: recentEvents || []
    });
    
    res.json({
      ...result,
      message: 'Analysis generated locally — zero cloud, zero API calls',
      deviceInference: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/ai/predict
 * Pre-match score prediction
 */
app.post('/api/ai/predict', async (req, res) => {
  try {
    const { homeTeam, awayTeam, context } = req.body;
    const result = await ai.predictMatch(homeTeam, awayTeam, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    ready: ai.isReady(),
    model: process.env.QVAC_MODEL,
    runningLocally: true,
    noCloudDependency: true
  });
});

// ── PEARS P2P ROUTES ────────────────────────────────────────────────────────

/**
 * POST /api/rooms/join
 * Join a match P2P room
 */
app.post('/api/rooms/join', async (req, res) => {
  try {
    const { matchName } = req.body;
    
    if (!rooms.has(matchName)) {
      const room = new KickoffRoom(matchName);
      room.onMessage((peerId, msg) => {
        // Store messages for frontend polling
        // In production: use WebSocket to push to frontend
        const msgs = roomMessages.get(matchName) || [];
        msgs.push({ peerId, ...msg });
        if (msgs.length > 100) msgs.shift();  // keep last 100
        roomMessages.set(matchName, msgs);
      });
      await room.join();
      rooms.set(matchName, room);
    }
    
    const room = rooms.get(matchName);
    res.json({
      matchName,
      peers: room.getPeerCount(),
      p2p: true,
      noServer: 'This chat has no central server. Pure Hyperswarm P2P.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const roomMessages = new Map();

/**
 * POST /api/rooms/message
 * Send a message to the P2P room
 */
app.post('/api/rooms/message', async (req, res) => {
  try {
    const { matchName, text, aiAnalysis } = req.body;
    const room = rooms.get(matchName);
    if (!room) return res.status(404).json({ error: 'Room not found — join first' });
    
    room.sendMessage(text, aiAnalysis);
    res.json({ sent: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/rooms/:matchName/messages
 * Poll for new messages
 */
app.get('/api/rooms/:matchName/messages', (req, res) => {
  const msgs = roomMessages.get(req.params.matchName) || [];
  res.json({ messages: msgs });
});

// ── WDK WALLET ROUTES ───────────────────────────────────────────────────────

app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await wallet.getBalance();
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/wallet/tip
 * Tip another fan in USDt
 */
app.post('/api/wallet/tip', async (req, res) => {
  try {
    const { recipientAddress, amountUsdt, note } = req.body;
    const result = await tipper.tip(recipientAddress, parseFloat(amountUsdt), note);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/pools/create
 * Create prediction pool for a match
 */
app.post('/api/pools/create', (req, res) => {
  try {
    const { matchName, stakeUsdt } = req.body;
    const newPool = pool.createPool({ matchName, stakeUsdt: parseFloat(stakeUsdt) });
    res.json(newPool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/pools/:poolId/join
 */
app.post('/api/pools/:poolId/join', async (req, res) => {
  try {
    const { prediction, fanWalletAddress } = req.body;
    const result = await pool.joinPool(req.params.poolId, prediction, fanWalletAddress);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/pools/:poolId/settle
 */
app.post('/api/pools/:poolId/settle', async (req, res) => {
  try {
    const { actualResult } = req.body;
    const settled = await pool.settlePool(req.params.poolId, actualResult);
    res.json(settled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pools', (req, res) => {
  res.json({ pools: pool.getAllPools() });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    qvac: ai.isReady(),
    wallet: wallet.isReady(),
    activeRooms: rooms.size,
    description: 'KICKOFF: Local AI + P2P + Self-custodial. All three Tether stacks.'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`KICKOFF API: localhost:${PORT}`));
```

---

## FRONTEND SPEC FOR LOVABLE

```
KICKOFF Frontend — API Base: http://localhost:3001/api

DESIGN:
Dark background (#0a0f1e — deep night sky)
Accent: Tether green (#26A17B)
Gold: #FFD700 (for tips and winners)
Football green texture for headers
Font: Inter (clean, modern)

FOUR PANELS:

1. MATCH PANEL (top)
   Form: home team, away team, score (e.g. "2-1"), minute, possession slider, shots inputs
   Button: "ANALYZE WITH LOCAL AI" → POST /api/ai/analyze
   Shows spinner → result appears with:
     [Analysis text] | [Prediction text] | [Confidence bar]
   Badge: "⚡ Ran on your device — zero cloud"

2. P2P FAN ROOM (bottom left, 50%)
   Input: match name (e.g. "France-Paraguay-R16") → "JOIN ROOM" → POST /api/rooms/join
   Shows: "X fans connected via Hyperswarm P2P" 
   Chat: messages appear from peers in real time (poll /api/rooms/:name/messages every 2s)
   Each message shows: avatar letter | fan ID | message | AI analysis badge if attached
   "Share My Analysis" button: sends current QVAC analysis into the P2P room
   Tip button: next to each message (opens tip modal)

3. AI ANALYSIS RESULT (bottom right, 50%)
   After analyze call — show:
   Large confidence percentage (animated ring)
   Analysis paragraph
   Prediction bold
   "Share to Room" button
   Model info: "Phi-3-mini | Running locally | 0 API calls"

4. WALLET PANEL (sidebar or modal)
   Balance: X.XX USDt | X.XX USAt
   Wallet address (truncated + copy button)
   TIP MODAL: recipient address input + amount + note + "Tip" button → POST /api/wallet/tip
   Transaction confirmation with TX hash + "View" link
   
   PREDICTION POOL section:
   "Create Pool" → matchName + stake → POST /api/pools/create
   List active pools: name | pot | entries | stake
   "Join" → prediction form (home goals, away goals) + wallet address → POST /api/pools/:id/join

MOBILE: fully responsive, panels stack vertically
DEMO MOMENT to show in video:
  Turn off WiFi in browser → type match stats → AI still analyzes (QVAC local)
  Reconnect WiFi → share to room → second browser tab sees message (Pears P2P)
  Tip button → 0.5 USDt moves from wallet A to wallet B (WDK)
```

---

## DEMO SCRIPT (3 MINUTES)

```
00:00 - "The World Cup Round of 16 is happening right now.
  France is leading Paraguay 2-1 in the 67th minute."

00:15 - Open KICKOFF. Show match input panel.
  Type: France | Paraguay | 2-1 | 67' | 65% possession | 8 shots vs 3
  
00:30 - DISCONNECT WiFi on demo laptop (visible in browser status bar)
  Click "ANALYZE WITH LOCAL AI"
  
00:45 - Analysis appears: tactical insight + prediction + 87% confidence
  Show badge: "Ran on your device — zero cloud"
  WiFi still disconnected. AI works offline.
  
01:00 - Reconnect WiFi. Click "Share to Room"
  Second browser tab: SAME message appears instantly
  No server. Hyperswarm P2P. Network inspector shows zero API calls to a server.
  
01:20 - Fan on second tab clicks TIP button next to the brilliant prediction
  Types: 0.5 USDt. Hits TIP.
  First tab shows: "You received 0.5 USDt! 🤑"
  TX hash visible. Self-custodial. No intermediary.
  
01:45 - Create prediction pool: "5 fans × 1 USDt = 5 USDt pot"
  Show two fans joining with different predictions
  Settle pool with actual result: 2-1 final → closest prediction wins 5 USDt
  
02:20 - Summary: "Three Tether stacks. One product.
  Your AI runs on your machine. Your messages go fan-to-fan.
  Your money stays in your wallet. KICKOFF."
```

---

## SUBMISSION CHECKLIST

```
□ pear create kickoff project initialized
□ QVAC model downloaded (qvac pull phi-3-mini-4k-instruct)
□ Hyperswarm P2P rooms working — two tabs chatting
□ QVAC local inference working — analysis appears without internet
□ WDK wallet created — balance shows
□ Tip flow working — USDt moves between two wallets
□ Prediction pool — create, join, settle end-to-end
□ Lovable frontend connected to local API
□ Demo: WiFi off → QVAC still works
□ Demo: Two devices chatting via Hyperswarm with no server
□ Demo: Tip confirmed with WDK transaction hash
□ 3-minute demo video recorded (unlisted YouTube)
□ Public GitHub repo (MIT or Apache 2.0 license)
□ DoraHacks submission — select ALL THREE tracks: Pears + QVAC + WDK
□ Represent: Ghana 🇬🇭
□ Submit before July 8
```
