import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const cli = path.join(root, 'cli/dist/index.js');

function isolatedHome(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'longrein-targets-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const home = path.join(temp, 'home');
  fs.mkdirSync(home, { recursive: true });
  return {
    home,
    env: {
      HOME: home,
      CODEX_HOME: path.join(home, '.codex'),
      PI_CODING_AGENT_DIR: path.join(home, '.pi', 'agent'),
    },
  };
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

function hostPaths(home) {
  return [
    {
      label: 'Claude Code',
      skill: path.join(home, '.claude', 'skills', 'shape'),
      instructions: path.join(home, '.claude', 'CLAUDE.md'),
    },
    {
      label: 'Codex',
      skill: path.join(home, '.codex', 'skills', 'shape'),
      instructions: path.join(home, '.codex', 'AGENTS.md'),
    },
    {
      label: 'Pi',
      skill: path.join(home, '.pi', 'agent', 'skills', 'shape'),
      instructions: path.join(home, '.pi', 'agent', 'AGENTS.md'),
    },
  ];
}

test('default install and status cover Claude Code, Codex and Pi', (t) => {
  const { home, env } = isolatedHome(t);
  run(['install', 'shape', '--yes'], env);

  for (const host of hostPaths(home)) {
    assert.equal(fs.existsSync(host.skill), true, `${host.label} Skill should be installed`);
    assert.doesNotMatch(fs.readFileSync(host.instructions, 'utf8'), /LONGREIN BLOCK/);
  }

  const status = run(['status'], env);
  assert.match(status.stdout, /Claude Code/);
  assert.match(status.stdout, /Codex/);
  assert.match(status.stdout, /Pi/);
});

test('default update refreshes a stale Pi copy', (t) => {
  const { home, env } = isolatedHome(t);
  run(['install', 'shape', '--yes'], env);
  const piSkill = path.join(home, '.pi', 'agent', 'skills', 'shape');
  const changedFile = path.join(piSkill, 'local-change.txt');
  fs.writeFileSync(changedFile, 'make the managed copy stale\n');

  const before = run(['status', '--pi'], env);
  assert.match(before.stdout, /stale/);

  run(['update'], env);
  assert.equal(fs.existsSync(changedFile), false);
  assert.doesNotMatch(run(['status', '--pi'], env).stdout, /stale/);
});

test('default doctor inspects Pi', (t) => {
  const { home, env } = isolatedHome(t);
  const foreignSkill = path.join(home, '.pi', 'agent', 'skills', 'shape');
  fs.mkdirSync(foreignSkill, { recursive: true });
  fs.writeFileSync(path.join(foreignSkill, 'foreign.txt'), 'not managed by Longrein\n');
  const claudeSkills = path.join(home, '.claude', 'skills');
  fs.mkdirSync(claudeSkills, { recursive: true });
  fs.symlinkSync(path.join(home, 'another-tool', 'missing-skill'), path.join(claudeSkills, 'foreign-broken-link'));

  const result = run(['doctor'], env);
  assert.match(result.stdout, /Pi: "shape" exists .*not managed by longrein/);
  assert.doesNotMatch(result.stdout, /foreign-broken-link/);
});

test('default skill uninstall covers all hosts', (t) => {
  const { home, env } = isolatedHome(t);
  run(['install', 'shape', '--yes'], env);
  run(['uninstall', 'shape'], env);

  for (const host of hostPaths(home)) {
    assert.equal(fs.existsSync(host.skill), false, `${host.label} Skill should be removed`);
  }
});

test('an explicit host selection does not affect other hosts', (t) => {
  const { home, env } = isolatedHome(t);
  run(['install', 'shape', '--yes', '--codex'], env);

  const hosts = hostPaths(home);
  assert.equal(fs.existsSync(hosts[1].skill), true);
  assert.equal(fs.existsSync(hosts[0].skill), false);
  assert.equal(fs.existsSync(hosts[2].skill), false);
});
