import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const cli = path.join(root, 'cli/dist/index.js');

function temporaryDirectory(prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  test.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function fakePi(binDir) {
  const executable = path.join(binDir, 'pi');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(
    executable,
    `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const agentDir = process.env.PI_CODING_AGENT_DIR;
const settingsFile = path.join(agentDir, 'settings.json');
fs.mkdirSync(agentDir, { recursive: true });
let settings = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, 'utf8')) : {};
settings.packages = settings.packages || [];
const [command, source] = process.argv.slice(2);
if (command === 'install' && !settings.packages.includes(source)) settings.packages.push(source);
if (command === 'remove') settings.packages = settings.packages.filter((item) => item !== source);
fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\\n');
`,
  );
  fs.chmodSync(executable, 0o755);
}

function run(args, env, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.equal(result.status, expectedStatus, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return result;
}

test('installs Skills, instructions and the tool bridge only into Pi', () => {
  const temp = temporaryDirectory('longrein-pi-install-');
  const home = path.join(temp, 'home');
  const piAgentDir = path.join(temp, 'pi-agent');
  const binDir = path.join(temp, 'bin');
  fakePi(binDir);
  const env = {
    HOME: home,
    PI_CODING_AGENT_DIR: piAgentDir,
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}`,
  };

  const installed = run(['install', 'dev', '--pi', '--yes', '--no-extensions'], env);
  assert.match(installed.stdout, /Pi tool bridge/);
  assert.equal(fs.existsSync(path.join(piAgentDir, 'skills', 'dev', 'SKILL.md')), true);
  assert.match(fs.readFileSync(path.join(piAgentDir, 'AGENTS.md'), 'utf8'), /LONGREIN BLOCK: job/);
  assert.equal(fs.existsSync(path.join(home, '.codex', 'skills', 'dev')), false);
  assert.equal(fs.existsSync(path.join(home, '.claude', 'skills', 'dev')), false);

  const settings = JSON.parse(fs.readFileSync(path.join(piAgentDir, 'settings.json'), 'utf8'));
  assert.equal(
    settings.packages.includes(path.join(root, 'plugins', 'longrein-pi')),
    true,
  );
  assert.match(run(['status', '--pi'], env).stdout, /Pi tool bridge[\s\S]*managed/);

  run(['uninstall', '--all', '--pi'], env);
  assert.equal(fs.existsSync(path.join(piAgentDir, 'skills', 'dev')), false);
  assert.doesNotMatch(fs.readFileSync(path.join(piAgentDir, 'AGENTS.md'), 'utf8'), /LONGREIN BLOCK/);
  const after = JSON.parse(fs.readFileSync(path.join(piAgentDir, 'settings.json'), 'utf8'));
  assert.equal(after.packages.includes(path.join(root, 'plugins', 'longrein-pi')), false);
});

test('keeps Pi opt-in for non-interactive installs without target flags', () => {
  const temp = temporaryDirectory('longrein-default-targets-');
  const home = path.join(temp, 'home');
  const codexHome = path.join(temp, 'codex');
  const piAgentDir = path.join(temp, 'pi-agent');
  const binDir = path.join(temp, 'bin');
  fakePi(binDir);
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(codexHome, { recursive: true });
  const env = {
    HOME: home,
    CODEX_HOME: codexHome,
    PI_CODING_AGENT_DIR: piAgentDir,
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}`,
  };

  run(['install', 'dev', '--yes', '--no-extensions'], env);

  assert.equal(fs.existsSync(path.join(home, '.codex', 'skills', 'dev', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(home, '.claude', 'skills', 'dev', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(piAgentDir, 'skills', 'dev')), false);
  assert.equal(fs.existsSync(path.join(piAgentDir, 'settings.json')), false);
});
