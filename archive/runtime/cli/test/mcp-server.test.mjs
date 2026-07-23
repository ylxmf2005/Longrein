import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const root = path.resolve(import.meta.dirname, '../..');
const cli = path.join(root, 'cli/dist/index.js');

function temporaryDirectory(prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  test.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

async function connect(longreinHome, hostHome = process.env.HOME ?? '') {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [cli, 'mcp'],
    cwd: root,
    env: {
      PATH: process.env.PATH ?? '',
      HOME: hostHome,
      LONGREIN_HOME: longreinHome,
    },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'longrein-test', version: '1.0.0' });
  await client.connect(transport);
  return { client, transport };
}

async function call(client, name, args, meta) {
  const result = await client.callTool({ name, arguments: args, ...(meta ? { _meta: meta } : {}) });
  const text = result.content.find((item) => item.type === 'text')?.text;
  assert.ok(text, `${name} returned no text content`);
  return { result, value: JSON.parse(text) };
}

function runCli(args, env, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.equal(result.status, expectedStatus, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return result;
}

test('exposes a small, annotated Task tool surface with self-contained instructions', async () => {
  const longreinHome = temporaryDirectory('longrein-mcp-home-');
  const { client, transport } = await connect(longreinHome);
  try {
    const listed = await client.listTools();
    assert.deepEqual(
      listed.tools.map((tool) => tool.name),
      [
        'longrein_task_read',
        'longrein_task_create',
        'longrein_task_context',
        'longrein_work_start',
        'longrein_session',
        'longrein_checkpoint',
        'longrein_task_close',
      ],
    );
    assert.match(client.getInstructions().slice(0, 512), /Read the current Task before mutating it/);
    assert.match(client.getInstructions().slice(0, 512), /Never edit Runtime-owned/);

    const read = listed.tools.find((tool) => tool.name === 'longrein_task_read');
    const checkpoint = listed.tools.find((tool) => tool.name === 'longrein_checkpoint');
    const close = listed.tools.find((tool) => tool.name === 'longrein_task_close');
    assert.deepEqual(read.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
    assert.equal(checkpoint.annotations.idempotentHint, false);
    assert.equal(close.annotations.destructiveHint, true);
    assert.ok(read.inputSchema);
    assert.ok(read.outputSchema);
    assert.ok(transport.pid);
  } finally {
    await client.close();
  }
});

test('binds Codex, Claude Code and Pi sessions with their native metadata', async () => {
  const longreinHome = temporaryDirectory('longrein-mcp-home-');
  const taskRoot = temporaryDirectory('longrein-mcp-session-');
  const taskDir = path.join(taskRoot, 'task');
  const hostHome = temporaryDirectory('longrein-mcp-host-home-');
  const codexId = '019f845d-2a8b-7403-8227-f73da9d9f83b';
  const claudeId = 'e6f13d11-b761-4282-89cf-c2a84eb3ebc8';
  const piId = '019f8cdb-5411-7a8a-a593-2f042abf62ec';
  const claudeTranscript = path.join(hostHome, '.claude', 'projects', 'example', `${claudeId}.jsonl`);
  fs.mkdirSync(path.dirname(claudeTranscript), { recursive: true });
  fs.writeFileSync(claudeTranscript, JSON.stringify({ sessionId: claudeId, cwd: taskRoot }) + '\n');
  const piTranscript = path.join(hostHome, '.pi', 'agent', 'sessions', 'example', `session_${piId}.jsonl`);
  fs.mkdirSync(path.dirname(piTranscript), { recursive: true });
  fs.writeFileSync(
    piTranscript,
    JSON.stringify({ type: 'session', version: 3, id: piId, cwd: taskRoot, timestamp: new Date().toISOString() }) + '\n',
  );
  const { client } = await connect(longreinHome, hostHome);
  try {
    await call(
      client,
      'longrein_task_create',
      { directory: taskDir, task_id: 'mcp-session-binding', request: 'Track participant sessions' },
      { threadId: codexId, 'x-codex-turn-metadata': { session_id: codexId, turn_id: 'turn-not-a-session' } },
    );
    await call(client, 'longrein_session', {
      task: taskDir,
      host: 'claude_code',
      session_id: claudeId,
      transcript_path: claudeTranscript,
      title: 'Review the Task',
    });
    const afterFirstBind = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
    await call(client, 'longrein_session', {
      task: taskDir,
      host: 'claude_code',
      session_id: claudeId,
    });
    await call(
      client,
      'longrein_session',
      { task: taskDir },
      {
        'x-pi-turn-metadata': {
          session_id: piId,
          transcript_path: piTranscript,
          title: 'Pi implementation session',
          cwd: taskRoot,
        },
      },
    );

    const shown = await call(client, 'longrein_task_read', { action: 'show', task: taskDir });
    assert.deepEqual(
      shown.value.task.sessions.map((session) => [session.host, session.external_session_id]),
      [
        ['codex', codexId],
        ['claude_code', claudeId],
        ['pi', piId],
      ],
    );
    assert.equal(shown.value.task.sessions[0].id, 'SES-001');
    assert.equal(shown.value.task.sessions[1].title, 'Review the Task');
    assert.equal(shown.value.task.sessions[1].cwd, taskRoot);
    assert.equal(shown.value.task.sessions[1].transcript_path, fs.realpathSync.native(claudeTranscript));
    const state = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
    assert.equal(state.sessions.length, 3);
    assert.equal(state.sessions[1].id, 'SES-002');
    assert.equal(state.sessions[2].id, 'SES-003');
    assert.equal(state.sessions[2].title, 'Pi implementation session');
    assert.equal(state.sessions[2].transcriptPath, fs.realpathSync.native(piTranscript));
    assert.equal(state.sessions[1].firstSeenAt, afterFirstBind.sessions[1].firstSeenAt);
    assert.ok(state.sessions[1].lastSeenAt >= afterFirstBind.sessions[1].lastSeenAt);
    assert.equal(state.counters.session, 3);
    assert.equal(state.events.length, 1);
    fs.rmSync(claudeTranscript);
    const doctor = await call(client, 'longrein_task_read', { action: 'doctor', task: taskDir });
    assert.equal(doctor.value.findings.some((finding) => finding.code === 'session-transcript-missing'), true);
  } finally {
    await client.close();
  }
});

test('runs a Task lifecycle in one MCP process and deduplicates an immediate checkpoint retry', async () => {
  const longreinHome = temporaryDirectory('longrein-mcp-home-');
  const taskRoot = temporaryDirectory('longrein-mcp-task-');
  const taskDir = path.join(taskRoot, 'task');
  const artifact = path.join(taskDir, 'design.md');
  const { client, transport } = await connect(longreinHome);
  try {
    const pid = transport.pid;
    const created = await call(client, 'longrein_task_create', {
      directory: taskDir,
      task_id: 'mcp-lifecycle',
      request: 'Verify the Longrein MCP lifecycle',
    });
    assert.equal(created.result.isError, undefined);
    assert.equal(created.value.task.status, 'shaping');

    const context = await call(client, 'longrein_task_context', {
      task: taskDir,
      summary: 'Establish MCP test context',
      goal: ['[UD-001] Reuse one MCP process'],
      scope: ['[UD-002] Task Runtime operations'],
      completion_evidence: ['MCP lifecycle succeeds'],
      decision_sources: [
        { decision: 'UD-001', source: 'user-message:test:1', quote: 'Reuse one MCP process' },
        { decision: 'UD-002', source: 'user-message:test:1', quote: 'Task Runtime operations' },
      ],
    });
    assert.equal(context.value.task.status, 'ready');

    await call(client, 'longrein_work_start', { task: taskDir, now: 'Exercise MCP checkpoint' });
    fs.writeFileSync(artifact, '# Design\n');
    const checkpointInput = {
      task: taskDir,
      findings: [{ summary: 'MCP calls reuse one Node process', evidence: [`pid:${pid}`] }],
      artifacts: [
        {
          type: 'shape.design',
          path: artifact,
          status: 'ready',
          establishes: 'The MCP lifecycle contract',
          next_consumer: 'review',
        },
      ],
      verification: [{ evidence_id: 'CE-001', status: 'passed', proof: 'SDK client calls succeeded' }],
      finish: { result: 'MCP lifecycle exercised', status: 'verifying' },
    };
    const first = await call(client, 'longrein_checkpoint', checkpointInput);
    const firstState = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
    const second = await call(client, 'longrein_checkpoint', checkpointInput);
    const secondState = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));

    assert.equal(first.result.isError, undefined);
    assert.deepEqual(second.value, first.value);
    assert.equal(secondState.events.length, firstState.events.length);
    assert.equal(secondState.latestEvent, firstState.latestEvent);
    assert.equal(transport.pid, pid);
    assert.equal(first.value.steps.length, 4);

    const shown = await call(client, 'longrein_task_read', { action: 'show', task: taskDir });
    assert.equal(shown.value.task.status, 'verifying');
    assert.equal(shown.value.task.findings.length, 1);
    assert.equal(shown.value.task.artifacts.length, 1);
    assert.equal('events' in shown.value.task, false);
    assert.equal('counters' in shown.value.task, false);
  } finally {
    await client.close();
  }
});

test('requires original user sources for every new UD and preserves them for later sessions', async () => {
  const longreinHome = temporaryDirectory('longrein-mcp-home-');
  const taskRoot = temporaryDirectory('longrein-mcp-decision-source-');
  const taskDir = path.join(taskRoot, 'task');
  const { client } = await connect(longreinHome);
  try {
    await call(client, 'longrein_task_create', {
      directory: taskDir,
      task_id: 'decision-provenance',
      request: 'Keep user and agent decisions separate',
    });
    const rejected = await call(client, 'longrein_task_context', {
      task: taskDir,
      summary: 'Invent a scope without provenance',
      goal: ['[UD-001] Handle known protocol capabilities'],
      scope: ['[UD-002] Reject every hypothetical future JSON field recursively'],
      completion_evidence: ['The adapter is implemented'],
    });
    assert.equal(rejected.result.isError, true);
    assert.match(rejected.value.error, /decision_sources.*UD-001, UD-002/);

    const accepted = await call(client, 'longrein_task_context', {
      task: taskDir,
      summary: 'Establish only sourced commitments',
      goal: ['[UD-001] Handle known protocol capabilities'],
      scope: ['[UD-002] Keep the implementation minimal'],
      completion_evidence: ['The adapter is implemented'],
      decision_sources: [
        {
          decision: 'UD-001',
          source: 'transcript.jsonl:806',
          quote: '不同模型有一些问题，我能想到的只有思考强度，其他的你可以想象',
        },
        {
          decision: 'UD-002',
          source: 'transcript.jsonl:5907',
          quote: '我希望控制scope，尽量还是最小修改',
        },
      ],
    });
    assert.equal(accepted.result.isError, undefined);

    const silentlyExpanded = await call(client, 'longrein_task_context', {
      task: taskDir,
      summary: 'Turn an agent proposal into a new rejection contract',
      decision: 'UD-003',
      scope: [
        '[UD-002] Keep the implementation minimal',
        '[UD-003] Reject every hypothetical future JSON field recursively',
      ],
    });
    assert.equal(silentlyExpanded.result.isError, true);
    assert.match(silentlyExpanded.value.error, /decision_sources.*UD-003/);

    const shown = await call(client, 'longrein_task_read', { action: 'show', task: taskDir });
    assert.deepEqual(shown.value.task.decision_sources, [
      {
        decision: 'UD-001',
        source: 'transcript.jsonl:806',
        quote: '不同模型有一些问题，我能想到的只有思考强度，其他的你可以想象',
      },
      {
        decision: 'UD-002',
        source: 'transcript.jsonl:5907',
        quote: '我希望控制scope，尽量还是最小修改',
      },
    ]);
    const taskMarkdown = fs.readFileSync(path.join(taskDir, 'task.md'), 'utf8');
    assert.match(taskMarkdown, /## Decision Sources/);
    assert.match(taskMarkdown, /transcript\.jsonl:5907/);
  } finally {
    await client.close();
  }
});

test('reports checkpoint partial progress and does not replay it on an immediate retry', async () => {
  const longreinHome = temporaryDirectory('longrein-mcp-home-');
  const taskRoot = temporaryDirectory('longrein-mcp-partial-');
  const taskDir = path.join(taskRoot, 'task');
  const { client } = await connect(longreinHome);
  try {
    await call(client, 'longrein_task_create', { directory: taskDir, task_id: 'mcp-partial', request: 'Test partial failure' });
    const input = {
      task: taskDir,
      findings: [{ summary: 'First step is durable' }],
      verification: [{ evidence_id: 'CE-999', status: 'passed' }],
    };
    const first = await call(client, 'longrein_checkpoint', input);
    const firstState = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));
    const second = await call(client, 'longrein_checkpoint', input);
    const secondState = JSON.parse(fs.readFileSync(path.join(taskDir, '.runtime/state.json'), 'utf8'));

    assert.equal(first.result.isError, true);
    assert.match(first.value.error, /unknown completion evidence/);
    assert.equal(first.value.completed_steps.length, 1);
    assert.deepEqual(second.value, first.value);
    assert.equal(secondState.findings.length, 1);
    assert.equal(secondState.events.length, firstState.events.length);
  } finally {
    await client.close();
  }
});

test('installs, updates and removes only Longrein-managed Codex and Claude MCP entries', () => {
  const codexHome = temporaryDirectory('longrein-codex-home-');
  const hostHome = temporaryDirectory('longrein-host-home-');
  const env = { CODEX_HOME: codexHome, HOME: hostHome };

  const installed = JSON.parse(runCli(['mcp', 'install'], env).stdout);
  assert.equal(installed.codex.state, 'managed');
  assert.equal(installed.claude.state, 'managed');
  const status = JSON.parse(runCli(['mcp', 'status'], env).stdout);
  for (const host of ['codex', 'claude']) {
    assert.equal(status[host].state, 'managed');
    assert.equal(path.isAbsolute(status[host].command), true);
    assert.equal(status[host].args.at(-1), 'mcp');
    assert.equal(status[host].args.length === 1 || status[host].args[0] === fs.realpathSync(cli), true);
  }

  const removed = JSON.parse(runCli(['mcp', 'uninstall'], env).stdout);
  assert.equal(removed.codex.state, 'missing');
  assert.equal(removed.claude.state, 'missing');
  const missing = JSON.parse(runCli(['mcp', 'status'], env).stdout);
  assert.equal(missing.codex.state, 'missing');
  assert.equal(missing.claude.state, 'missing');

  const foreign = spawnSync('codex', ['mcp', 'add', 'longrein', '--', '/bin/echo', 'foreign'], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.equal(foreign.status, 0, foreign.stderr);
  const refused = JSON.parse(runCli(['mcp', 'install', 'codex'], env, 1).stdout);
  assert.equal(refused.codex.state, 'foreign');
  const unchanged = JSON.parse(runCli(['mcp', 'status', 'codex'], env).stdout);
  assert.equal(unchanged.codex.command, '/bin/echo');
  assert.deepEqual(unchanged.codex.args, ['foreign']);

  const foreignClaude = spawnSync('claude', ['mcp', 'add', '--scope', 'user', 'longrein', '--', '/bin/echo', 'foreign'], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.equal(foreignClaude.status, 0, foreignClaude.stderr);
  const refusedClaude = JSON.parse(runCli(['mcp', 'install', 'claude'], env, 1).stdout);
  assert.equal(refusedClaude.claude.state, 'foreign');
});
