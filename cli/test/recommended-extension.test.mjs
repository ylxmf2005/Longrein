import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cli = path.join(root, 'cli/dist/index.js');

function run(args, expectedStatus = 0, env = {}) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.equal(result.status, expectedStatus, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return result;
}

test('extension install refuses external installers without explicit confirmation', () => {
  const result = run(['extension', 'install', 'cass'], 1);
  assert.match(result.stderr, /without --yes/);
});

test('extension dry-run prints upstream commands', () => {
  const result = run(['extension', 'install', '--dry-run']);
  assert.match(result.stdout, /dicklesworthstone\/tap\/cass|coding_agent_session_search\/main\/install/);
  assert.match(result.stdout, /longrein-extension@longrein/);
  assert.match(result.stdout, /pi install .*longrein-extension/);
});

test('extension rejects an unknown component', () => {
  const result = run(['extension', 'install', 'unknown', '--codex', '--dry-run'], 1);
  assert.match(result.stderr, /unknown extension component/);
});

test('extension keeps canonical order when selected components are passed in another order', () => {
  const result = run(['extension', 'install', 'cass-skill', 'cass', '--dry-run']);
  assert.ok(result.stdout.indexOf('\ncass\n') < result.stdout.indexOf('\ncass-skill\n'));
});

test('extension status is read-only and reports all upstream CLIs', () => {
  const result = run(['extension', 'status']);
  assert.match(result.stdout, /cass/);
});

test('extension installs the cass Skill plugin into explicitly selected Codex and Claude homes', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'longrein-extension-plugin-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const home = path.join(temp, 'home');
  const codexHome = path.join(temp, 'codex');
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(codexHome, { recursive: true });

  const result = run(['extension', 'install', 'cass-skill', '--codex', '--claude', '--yes'], 0, {
    HOME: home,
    CODEX_HOME: codexHome,
  });
  assert.match(result.stdout, /Longrein Extension/);
  const codexList = spawnSync('codex', ['plugin', 'list', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, HOME: home, CODEX_HOME: codexHome },
  });
  assert.equal(codexList.status, 0, codexList.stderr);
  assert.match(codexList.stdout, /longrein-extension@longrein/);
  const claudeList = spawnSync('claude', ['plugin', 'list', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, HOME: home, CODEX_HOME: codexHome },
  });
  assert.equal(claudeList.status, 0, claudeList.stderr);
  assert.match(claudeList.stdout, /longrein-extension@longrein/);
});

test('an explicit Extension host selection does not affect other hosts', () => {
  const result = run(['extension', 'install', 'cass-skill', '--codex', '--dry-run']);
  assert.match(result.stdout, /codex plugin add longrein-extension@longrein/);
  assert.doesNotMatch(result.stdout, /claude plugin install|pi install/);
});

test('ordinary non-interactive install does not opt into the Extension', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'longrein-no-extension-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const home = path.join(temp, 'home');
  const codexHome = path.join(temp, 'codex');
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(codexHome, { recursive: true });

  const result = run(['install', '--yes', '--codex'], 0, { HOME: home, CODEX_HOME: codexHome });
  assert.doesNotMatch(result.stdout, /optional Extension|longrein-extension/);
});

test('main install exposes component selection and rejects unknown components before installing', () => {
  const help = run(['install', '--help']);
  assert.match(help.stdout, /--extension-components <components\.\.\.>/);

  const result = run(['install', '--yes', '--codex', '--extension-components', 'unknown'], 1);
  assert.match(result.stderr, /unknown extension component/);
});
