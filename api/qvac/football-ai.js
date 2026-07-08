/**
 * QVAC Local AI — match analysis via @qvac/sdk
 * Supports: registry models, local GGUF, linestack HTTP server, heuristic fallback.
 */

import path from "path";
import {
  FOOTBALL_ANALYST_SYSTEM,
  buildMatchPrompt,
  buildPredictionPrompt,
} from "./prompts.js";
import { ensureQvacConfig, getModelSource, describeRuntime } from "./runtime.js";

export class FootballAI {
  constructor() {
    this.modelId = null;
    this.ready = false;
    this.mode = "pending";
    this.modelLabel = process.env.QVAC_MODEL || "LLAMA_3_2_1B_INST_Q4_0";
    this.registryConstant = null;
    this.sdk = null;
    this.loadModel = null;
    this.completion = null;
    this.unloadModel = null;
  }

  async initialize() {
    ensureQvacConfig();
    const source = getModelSource();

    if (source.kind === "http") {
      this.mode = "http";
      this.ready = await this._probeHttp(source.baseUrl);
      console.log(
        `[QVAC] HTTP mode (${source.baseUrl}) ready=${this.ready}`,
      );
      return;
    }

    try {
      this.sdk = await import("@qvac/sdk");
      this.loadModel = this.sdk.loadModel;
      this.completion = this.sdk.completion;
      this.unloadModel = this.sdk.unloadModel;

      if (source.kind === "file") {
        this.mode = "qvac-file";
        this.modelLabel = path.basename(source.modelSrc);
        this.modelId = await this.loadModel({
          modelSrc: source.modelSrc,
          modelType: "llamacpp-completion",
          modelConfig: { ctx_size: 4096 },
          onProgress: this._logProgress,
        });
      } else {
        this.mode = "qvac-registry";
        this.registryConstant = this.sdk[source.modelKey];
        if (!this.registryConstant) {
          throw new Error(
            `Unknown QVAC model constant: ${source.modelKey}. Check @qvac/sdk exports.`,
          );
        }
        this.modelLabel = source.modelKey;
        this.modelId = await this.loadModel({
          modelSrc: this.registryConstant,
          onProgress: this._logProgress,
        });
      }

      this.ready = true;
      console.log(`[QVAC] Model loaded locally | mode=${this.mode} | id=${this.modelId}`);
    } catch (err) {
      console.error("[QVAC] SDK init failed:", err.message);
      console.warn("[QVAC] Falling back to heuristic local analysis (offline-capable)");
      this.mode = "heuristic";
      this.ready = true;
    }
  }

  _logProgress(p) {
    if (!p || typeof p.percentage !== "number") return;
    const mb = (n) => (n / 1e6).toFixed(1);
    const line = `[QVAC] Download ${p.percentage.toFixed(0)}% (${mb(p.downloaded)}/${mb(p.total)} MB)`;
    if (process.stderr.isTTY) {
      process.stderr.write(`\r${line}`);
      if (p.percentage >= 100) process.stderr.write("\n");
    } else {
      console.log(line);
    }
  }

  async _probeHttp(baseUrl) {
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/models`, {
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async analyzeMatch(matchData) {
    if (!this.ready) throw new Error("QVAC not initialized");

    const prompt = buildMatchPrompt(matchData);
    const startTime = Date.now();

    let text;
    if (this.mode === "http") {
      text = await this._completeHttp(prompt);
    } else if (this.mode.startsWith("qvac")) {
      text = await this._completeSdk(prompt);
    } else {
      text = this._heuristicAnalysis(matchData);
    }

    const processingTime = Date.now() - startTime;
    const analysis = this._extractSection(text, "ANALYSIS");
    const prediction = this._extractSection(text, "PREDICTION");
    const confidence = this._extractConfidence(text);

    return {
      raw: text,
      analysis: analysis || text,
      prediction: prediction || "",
      confidence: confidence ?? this._guessConfidence(matchData),
      processingTimeMs: processingTime,
      model: this.modelLabel,
      ranLocally: this.mode !== "http",
      mode: this.mode,
      deviceInference: this.mode !== "http",
    };
  }

  async predictMatch(homeTeam, awayTeam, context = "") {
    if (!this.ready) throw new Error("QVAC not initialized");

    const prompt = buildPredictionPrompt({ homeTeam, awayTeam, context });
    let text;

    if (this.mode === "http") {
      text = await this._completeHttp(prompt);
    } else if (this.mode.startsWith("qvac")) {
      text = await this._completeSdk(prompt);
    } else {
      text = `[PREDICTION] ${homeTeam} 2 - 1 ${awayTeam}. Press high, transition quickly, exploit wide channels.`;
    }

    return {
      prediction: text,
      teams: { home: homeTeam, away: awayTeam },
      ranLocally: this.mode !== "http",
      mode: this.mode,
    };
  }

  async _completeSdk(userPrompt) {
    const result = this.completion({
      modelId: this.modelId,
      history: [
        { role: "system", content: FOOTBALL_ANALYST_SYSTEM },
        { role: "user", content: userPrompt },
      ],
      stream: false,
      modelConfig: { temperature: 0.7, n_predict: 180 },
    });

    if (result.text) {
      return typeof result.text === "string" ? result.text : await result.text;
    }

    let out = "";
    for await (const token of result.tokenStream) {
      out += token;
    }
    return out.trim();
  }

  async _completeHttp(userPrompt) {
    const base = process.env.QVAC_HTTP_URL.replace(/\/$/, "");
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.QVAC_HTTP_MODEL || "local",
        messages: [
          { role: "system", content: FOOTBALL_ANALYST_SYSTEM },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 180,
      }),
    });

    if (!res.ok) {
      throw new Error(`QVAC HTTP error ${res.status}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || "";
  }

  _heuristicAnalysis(matchData) {
    const {
      homeTeam,
      awayTeam,
      score,
      minute,
      homePossession,
      homeShots,
      awayShots,
    } = matchData;
    const min = Number(minute);
    const poss = Number(homePossession);
    const leader = poss >= 50 ? homeTeam : awayTeam;
    const shotDelta = Number(homeShots) - Number(awayShots);

    const analysis = `${leader} controlling tempo at ${Math.max(poss, 100 - poss)}% possession; shot volume ${shotDelta >= 0 ? "favors" : "punishes"} ${homeTeam} (${homeShots}-${awayShots} on target).`;
    const prediction =
      min >= 75
        ? `Late-game: ${score} holds unless ${awayTeam} forces a set-piece chain.`
        : `${homeTeam} likely adds one more before the hour if they keep the press.`;
    const confidence = Math.min(
      92,
      68 + Math.abs(shotDelta) * 3 + Math.abs(poss - 50) * 0.4,
    );

    return `[ANALYSIS] ${analysis} [PREDICTION] ${prediction} [CONFIDENCE: ${Math.round(confidence)}%]`;
  }

  _guessConfidence(matchData) {
    const poss = Math.abs(Number(matchData.homePossession) - 50);
    const shots = Math.abs(
      Number(matchData.homeShots) - Number(matchData.awayShots),
    );
    return Math.min(90, Math.round(65 + poss * 0.3 + shots * 4));
  }

  isReady() {
    return this.ready;
  }

  getStatus() {
    return {
      ready: this.ready,
      mode: this.mode,
      model: this.modelLabel,
      modelId: this.modelId,
      runningLocally: this.mode !== "http",
      noCloudDependency: this.mode !== "http",
      runtime: describeRuntime(),
    };
  }

  async shutdown() {
    if (this.modelId && this.unloadModel) {
      try {
        await this.unloadModel({ modelId: this.modelId });
      } catch {
        /* ignore */
      }
    }
    this.ready = false;
  }

  _extractSection(text, tag) {
    const regex = new RegExp(`\\[${tag}\\]\\s*(.+?)(?=\\[|$)`, "si");
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  _extractConfidence(text) {
    const match = text.match(/CONFIDENCE[:\s]+(\d+)%/i);
    return match ? parseInt(match[1], 10) : null;
  }
}
