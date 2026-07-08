/**
 * Resolves QVAC / linestackruntime paths for local inference.
 *
 * Set one of:
 *   QVAC_LINESTACK_RUNTIME_PATH  — custom bare/linestack runtime build
 *   LINESTACK_RUNTIME_PATH       — alias
 *   QVAC_CONFIG_PATH             — explicit qvac.config.*
 *   QVAC_MODEL_PATH              — local .gguf file
 *   QVAC_HTTP_URL                — OpenAI-compatible local server (e.g. linestack HTTP)
 */

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const RUNTIME_CANDIDATES = [
  process.env.QVAC_LINESTACK_RUNTIME_PATH,
  process.env.LINESTACK_RUNTIME_PATH,
  path.join(REPO_ROOT, "linestackruntime"),
  path.join(REPO_ROOT, "..", "linestackruntime"),
  path.join(os.homedir(), "linestackruntime"),
  path.join(os.homedir(), "projects", "linestackruntime"),
  path.join(os.homedir(), "dev", "linestackruntime"),
].filter(Boolean);

export function resolveLinestackRuntimePath() {
  for (const candidate of RUNTIME_CANDIDATES) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }
  return null;
}

export function ensureQvacConfig() {
  if (process.env.QVAC_CONFIG_PATH) {
    return process.env.QVAC_CONFIG_PATH;
  }

  const runtimePath = resolveLinestackRuntimePath();
  const cacheDirectory =
    process.env.QVAC_CACHE_DIRECTORY ||
    path.join(os.homedir(), ".qvac", "models");

  const configPath = path.join(REPO_ROOT, "qvac.config.json");
  const config = {
    cacheDirectory,
    loggerConsoleOutput: process.env.QVAC_LOG === "1",
  };

  if (runtimePath) {
    config.linestackRuntimePath = runtimePath;
    process.env.QVAC_LINESTACK_RUNTIME_PATH = runtimePath;

    // If runtime ships a qvac.config, prefer it
    for (const name of ["qvac.config.json", "qvac.config.js", "qvac.config.mjs"]) {
      const nested = path.join(runtimePath, name);
      if (fs.existsSync(nested)) {
        process.env.QVAC_CONFIG_PATH = nested;
        return nested;
      }
    }
  }

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

  return { kind: "registry", modelKey: process.env.QVAC_MODEL || "LLAMA_3_2_1B_INST_Q4_0" };
}

export function describeRuntime() {
  const runtimePath = resolveLinestackRuntimePath();
  const model = getModelSource();
  return {
    configPath: process.env.QVAC_CONFIG_PATH || null,
    linestackRuntimePath: runtimePath,
    linestackRuntimeFound: Boolean(runtimePath),
    model,
    cacheDirectory:
      process.env.QVAC_CACHE_DIRECTORY ||
      path.join(os.homedir(), ".qvac", "models"),
  };
}
