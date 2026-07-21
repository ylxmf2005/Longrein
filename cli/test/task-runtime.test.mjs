import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const cli = path.join(root, 'cli/dist/index.js');

function run(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(
    result.status,
    expectedStatus,
    `command failed: longrein ${args.join(' ')}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return result;
}

function temporaryWorkspace() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'longrein-task-test-'));
  test.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function initRepository(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const git = (...args) => {
    const result = spawnSync('git', ['-C', directory, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  };
  git('init', '-q');
  git('config', 'user.email', 'task-runtime@example.com');
  git('config', 'user.name', 'Task Runtime Test');
  fs.writeFileSync(path.join(directory, 'base.txt'), 'base\n');
  git('add', 'base.txt');
  git('commit', '-qm', 'init');
}

test('creates, advances and completes a task without hooks', () => {
  const temp = temporaryWorkspace();
  const repository = path.join(temp, 'repo');
  const taskDir = path.join(temp, 'task');
  initRepository(repository);

  run(['task', 'create', taskDir, '--id', '20260721-runtime', '--request', 'Build runtime', '--repository', repository]);
  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'Establish context',
    '--goal',
    '[UD-001] Show current state',
    '--scope',
    '[UD-002] Runtime and Timeline',
    '--non-goal',
    '[UD-003] No hooks',
    '--completion',
    'Lifecycle commands are executable',
    '--preserve',
    '[UD-004] Professional artifacts own conclusions',
  ]);
  run(['task', 'work', 'start', taskDir, '--now', 'Implement behavior', '--next', 'Verify it']);
  fs.writeFileSync(path.join(repository, 'changed.txt'), 'changed\n');
  run(['task', 'work', 'finish', taskDir, '--result', 'Behavior implemented', '--next', 'Check evidence', '--status', 'verifying']);
  run(['task', 'evidence', taskDir, 'CE-001', '--status', 'passed', '--proof', 'commands succeeded']);
  run(['task', 'doctor', taskDir]);
  run(['task', 'complete', taskDir, '--summary', 'Runtime verified']);

  const state = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
  assert.equal(state.status, 'complete');
  assert.equal(state.latestEvent, 'EVT-0006');
  assert.equal(state.currentWork.active, null);
  assert.equal(fs.existsSync(path.join(taskDir, 'timeline.md')), true);

  const taskMarkdown = fs.readFileSync(path.join(taskDir, 'task.md'), 'utf8');
  const timeline = fs.readFileSync(path.join(taskDir, 'timeline.md'), 'utf8');
  assert.match(taskMarkdown, /## Current Work/);
  assert.match(taskMarkdown, /## Confirmed Findings/);
  assert.match(taskMarkdown, /latest_event: "EVT-0006"/);
  assert.match(timeline, /work_started/);
  assert.match(timeline, /task_completed/);
  assert.doesNotMatch(timeline, /tool_call/);

  const terminalMutation = run(['task', 'finding', taskDir, '--summary', 'Late finding'], 1);
  assert.match(terminalMutation.stderr, /terminal task \(complete\)/);
});

test('does not overwrite a legacy task directory', () => {
  const temp = temporaryWorkspace();
  const taskDir = path.join(temp, 'legacy');
  const taskFile = path.join(taskDir, 'task.md');
  fs.mkdirSync(taskDir, { recursive: true });
  fs.writeFileSync(taskFile, 'legacy task\n');

  const rejected = run(['task', 'create', taskDir, '--id', 'new-runtime', '--request', 'Do not adopt legacy state'], 1);
  assert.match(rejected.stderr, /refusing to overwrite existing Task files/);
  assert.equal(fs.readFileSync(taskFile, 'utf8'), 'legacy task\n');
  assert.equal(fs.existsSync(path.join(taskDir, '.runtime/state.json')), false);
});

test('requires an explicit user decision to replace established commitments', () => {
  const temp = temporaryWorkspace();
  const taskDir = path.join(temp, 'task');
  run(['task', 'create', taskDir, '--id', 'scope-guard', '--request', 'Guard scope']);
  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'Initial commitments',
    '--goal',
    '[UD-001] First goal',
    '--scope',
    '[UD-002] First scope',
    '--completion',
    'Proof exists',
  ]);

  const rejected = run(
    ['task', 'context', taskDir, '--summary', 'Silent replacement', '--goal', '[UD-003] Different goal'],
    1,
  );
  assert.match(rejected.stderr, /requires --decision UD-###/);

  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'User replaced goal',
    '--goal',
    '[UD-003] Different goal',
    '--decision',
    'UD-003',
  ]);
  const state = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
  assert.equal(state.scopeRevision, 2);
  assert.equal(state.events.at(-1).kind, 'scope_changed');
});

test('allows shaping findings before the first credible Task Context', () => {
  const temp = temporaryWorkspace();
  const taskDir = path.join(temp, 'task');
  run(['task', 'create', taskDir, '--id', 'shape-first', '--request', 'Investigate before committing']);
  run(['task', 'finding', taskDir, '--summary', 'The repository uses an existing state store']);
  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'Establish commitments after shaping',
    '--goal',
    '[UD-001] Reuse the existing store',
    '--scope',
    '[UD-002] Runtime integration',
    '--completion',
    'Integration behavior is verified',
  ]);

  const state = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
  assert.equal(state.contextRevision, 2);
  assert.equal(state.scopeRevision, 1);
  assert.equal(state.events.at(-1).kind, 'context_established');
});

test('does not reconcile repository changes through work block without a started work unit', () => {
  const temp = temporaryWorkspace();
  const repository = path.join(temp, 'repo');
  const taskDir = path.join(temp, 'task');
  initRepository(repository);
  run(['task', 'create', taskDir, '--id', 'block-guard', '--request', 'Guard reconciliation', '--repository', repository]);
  fs.writeFileSync(path.join(repository, 'unexplained.txt'), 'change\n');

  const rejected = run(['task', 'work', 'block', taskDir, '--reason', 'No active unit'], 1);
  assert.match(rejected.stderr, /no active work unit/);
  const doctor = run(['task', 'doctor', taskDir], 1);
  assert.match(doctor.stdout, /repository-drift/);
});

test('detects untracked content drift even when file size and timestamps are restored', () => {
  const temp = temporaryWorkspace();
  const repository = path.join(temp, 'repo');
  const taskDir = path.join(temp, 'task');
  initRepository(repository);
  run(['task', 'create', taskDir, '--id', 'content-drift', '--request', 'Track repository content', '--repository', repository]);
  run(['task', 'work', 'start', taskDir, '--now', 'Create an untracked work file']);
  const workFile = path.join(repository, 'scratch.txt');
  fs.writeFileSync(workFile, 'aaaa\n');
  run(['task', 'work', 'finish', taskDir, '--result', 'Work file created']);
  run(['task', 'doctor', taskDir]);

  const original = fs.statSync(workFile);
  fs.writeFileSync(workFile, 'bbbb\n');
  fs.utimesSync(workFile, original.atime, original.mtime);
  const doctor = run(['task', 'doctor', taskDir], 1);
  assert.match(doctor.stdout, /repository-drift/);
});

test('requires a credible context and at least one Completion Evidence item', () => {
  const temp = temporaryWorkspace();
  const taskDir = path.join(temp, 'task');
  run(['task', 'create', taskDir, '--id', 'completion-guard', '--request', 'Guard completion']);
  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'Context without evidence',
    '--goal',
    '[UD-001] Guard completion',
    '--scope',
    '[UD-002] Completion gate',
    '--status',
    'ready',
  ]);

  const rejected = run(['task', 'complete', taskDir, '--summary', 'Should not complete'], 1);
  assert.match(rejected.stderr, /without Completion Evidence/);
});

test('detects view and artifact drift and only fixes generated views', () => {
  const temp = temporaryWorkspace();
  const taskDir = path.join(temp, 'task');
  run(['task', 'create', taskDir, '--id', 'drift-guard', '--request', 'Detect drift']);
  run([
    'task',
    'context',
    taskDir,
    '--summary',
    'Initial commitments',
    '--goal',
    '[UD-001] Detect drift',
    '--scope',
    '[UD-002] Generated views and artifacts',
    '--completion',
    'Drift is rejected',
  ]);

  fs.appendFileSync(path.join(taskDir, 'task.md'), '\nmanual edit\n');
  const viewDrift = run(['task', 'doctor', taskDir], 1);
  assert.match(viewDrift.stdout, /task-drift/);
  run(['task', 'doctor', taskDir, '--fix']);
  assert.doesNotMatch(fs.readFileSync(path.join(taskDir, 'task.md'), 'utf8'), /manual edit/);

  const artifact = path.join(taskDir, 'design.md');
  fs.writeFileSync(artifact, 'v1\n');
  run([
    'task',
    'artifact',
    taskDir,
    '--path',
    artifact,
    '--status',
    'ready',
    '--establishes',
    'Runtime contract',
    '--next-consumer',
    'dev',
  ]);
  run(['task', 'evidence', taskDir, 'CE-001', '--status', 'passed', '--proof', 'view checks passed']);
  fs.writeFileSync(artifact, 'v2\n');
  const artifactDrift = run(['task', 'doctor', taskDir], 1);
  assert.match(artifactDrift.stdout, /artifact-drift/);
  const completionRejected = run(['task', 'complete', taskDir, '--summary', 'Should fail'], 1);
  assert.match(completionRejected.stderr, /Task is inconsistent/);
});
