#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const redRoot = path.join(root, "scenarios/dual-design/red");
const manifestPath = path.join(redRoot, "manifest.json");

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const [name, expected] of Object.entries(manifest.files)) {
  const actual = sha256(path.join(redRoot, name));
  if (actual !== expected) throw new Error(`RED fixture hash changed: ${name}`);
}

const runtime = {
  runtime_activation: false,
  reason: "host isolation, attestation, cleanup, atomic final transaction, and vault evidence unavailable",
  deterministic_contract: "available"
};
console.log(JSON.stringify({ red_fixtures: "frozen", ...runtime }));
