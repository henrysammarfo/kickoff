/**
 * QVAC runtime configuration via environment variables.
 *
 * Optional overrides (see .env.example):
 *   QVAC_CONFIG_PATH   — explicit qvac.config.*
 *   QVAC_MODEL_PATH    — local .gguf file
 *   QVAC_HTTP_URL      — OpenAI-compatible local inference server
 *   QVAC_MODEL         — registry model key (default: LLAMA_3_2_1B_INST_Q4_0)
 *
 * linestackruntime is a separate reference project — if you run its HTTP
 * server locally, set QVAC_HTTP_URL. No automatic path detection.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

export function ensureQvacConfig() {
  if (process.env.QVAC_CONFIG_PATH) {
    return process.env.QVAC_CONFIG_PATH;
  }

  const cacheDirectory =
    process.env.QVAC_CACHE_DIRECTORY ||
    path.join(os.homedir(), ".qvac", "models");

  const configPath = path.join(REPO_ROOT, "qvac.config.json");
  const config = {
    cacheDirectory,
    loggerConsoleOutput: process.env.QVAC_LOG === "1",
  };

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  process.env.QVAC_CONFIG_PATH = configPath;
  return configPath;
}

export function getModelSource() {
  if (process.env.QVAC_MODEL_PATH && fs.existsSync(process.env.QVAC_MODEL_PATH)) {
    return {
      kind: "file",
      modelSrc: process.env.QVAC_MODEL_PATH,
      modelType: "llamacpp-completion",
    };
  }

  if (process.env.QVAC_HTTP_URL) {
    return { kind: "http", baseUrl: process.env.QVAC_HTTP_URL };
  }

  return {
    kind: "registry",
    modelKey: process.env.QVAC_MODEL || "LLAMA_3_2_1B_INST_Q4_0",
  };
}

export function describeRuntime() {
  const model = getModelSource();
  return {
    configPath: process.env.QVAC_CONFIG_PATH || null,
    model,
    cacheDirectory:
      process.env.QVAC_CACHE_DIRECTORY ||
      path.join(os.homedir(), ".qvac", "models"),
    httpUrl: process.env.QVAC_HTTP_URL || null,
  };
}
