import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const root = path.resolve(import.meta.dirname, '../..');
const cli = path.join(root, 'cli/dist/index.js');

function parse(tokens) {
  const positionals = [];
  const options = new Map();
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }
    const value = tokens[index + 1]?.startsWith('--') ? true : tokens[++index] ?? true;
    const values = options.get(token) ?? [];
    values.push(value);
    options.set(token, values);
  }
  return {
    positionals,
    one: (name) => options.get(name)?.at(-1),
    many: (name) => options.get(name)?.filter((value) => value !== true),
    has: (name) => options.has(name),
  };
}

function compact(value) {
  return value === undefined || value === null || value === false || (Array.isArray(value) && value.length === 0)
    ? undefined
    : value;
}

function invocation(rawArgs) {
  const args = [...rawArgs];
  if (args[0] === 'task') args.shift();
  const action = args.shift();
  const subaction = action === 'work' ? args.shift() : undefined;
  const parsed = parse(args);
  const task = parsed.positionals[0];

  if (action === 'create') {
    return {
      tool: 'longrein_task_create',
      arguments: {
        directory: task,
        task_id: parsed.one('--id'),
        request: parsed.one('--request'),
        repository: compact(parsed.one('--repository')),
        source_ref: compact(parsed.one('--source-ref')),
        working_branch: compact(parsed.one('--working-branch')),
        target_ref: compact(parsed.one('--target-ref')),
        actor: compact(parsed.one('--actor')),
      },
      operation: 'task.create',
    };
  }
  if (action === 'list') {
    return { tool: 'longrein_task_read', arguments: { action: 'list' } };
  }
  if (action === 'show') {
    return { tool: 'longrein_task_read', arguments: { action: 'show', task } };
  }
  if (action === 'doctor') {
    if (parsed.has('--fix')) throw new Error('Task repair is not exposed through the MCP test driver');
    return { tool: 'longrein_task_read', arguments: { action: 'doctor', task }, failOnFindings: true };
  }
  if (action === 'context') {
    const commitmentValues = [
      ...(parsed.many('--goal') ?? []),
      ...(parsed.many('--scope') ?? []),
      ...(parsed.many('--non-goal') ?? []),
      ...(parsed.many('--preserve') ?? []),
    ];
    const decisionIds = [...new Set(commitmentValues.flatMap((value) => [...value.matchAll(/\[?(UD-\d{3,})\]?/g)].map((match) => match[1])))];
    return {
      tool: 'longrein_task_context',
      arguments: {
        task,
        summary: parsed.one('--summary'),
        decision: compact(parsed.one('--decision')),
        decision_sources: decisionIds.length
          ? decisionIds.map((decision) => ({
              decision,
              source: 'task-mcp-driver:test-fixture',
              quote: `Test fixture explicitly establishes ${decision}`,
            }))
          : undefined,
        goal: compact(parsed.many('--goal')),
        scope: compact(parsed.many('--scope')),
        non_goals: compact(parsed.many('--non-goal')),
        completion_evidence: compact(parsed.many('--completion')),
        must_preserve: compact(parsed.many('--preserve')),
        assumptions: compact(parsed.many('--assumption')),
        source_ref: compact(parsed.one('--source-ref')),
        working_branch: compact(parsed.one('--working-branch')),
        target_ref: compact(parsed.one('--target-ref')),
        status: compact(parsed.one('--status')),
        now: compact(parsed.one('--now')),
        next: compact(parsed.one('--next')),
        waiting_on: compact(parsed.one('--waiting-on')),
      },
      operation: 'task.context',
    };
  }
  if (action === 'work' && subaction === 'start') {
    return {
      tool: 'longrein_work_start',
      arguments: { task, now: parsed.one('--now'), next: compact(parsed.one('--next')), actor: compact(parsed.one('--actor')) },
      operation: 'task.work.start',
    };
  }
  if (action === 'work' && (subaction === 'finish' || subaction === 'block')) {
    return {
      tool: 'longrein_checkpoint',
      arguments: {
        task,
        ...(subaction === 'finish'
          ? {
              finish: {
                result: parsed.one('--result'),
                now: compact(parsed.one('--now')),
                next: compact(parsed.one('--next')),
                status: compact(parsed.one('--status')),
              },
            }
          : {
              block: {
                reason: parsed.one('--reason'),
                waiting_on: compact(parsed.one('--waiting-on')),
                next: compact(parsed.one('--next')),
              },
            }),
        actor: compact(parsed.one('--actor')),
      },
      operation: `task.work.${subaction}`,
    };
  }
  if (action === 'finding') {
    return {
      tool: 'longrein_checkpoint',
      arguments: { task, findings: [{ summary: parsed.one('--summary') }], actor: compact(parsed.one('--actor')) },
      operation: 'task.finding',
    };
  }
  if (action === 'artifact') {
    return {
      tool: 'longrein_checkpoint',
      arguments: {
        task,
        artifacts: [
          {
            type: parsed.one('--type'),
            path: parsed.one('--path'),
            status: parsed.one('--status'),
            establishes: parsed.one('--establishes'),
            next_consumer: parsed.one('--next-consumer'),
          },
        ],
        actor: compact(parsed.one('--actor')),
      },
      operation: 'task.artifact',
    };
  }
  if (action === 'evidence') {
    return {
      tool: 'longrein_checkpoint',
      arguments: {
        task,
        verification: [
          {
            evidence_id: parsed.positionals[1],
            status: parsed.one('--status'),
            proof: compact(parsed.one('--proof')),
          },
        ],
        actor: compact(parsed.one('--actor')),
      },
      operation: 'task.evidence',
    };
  }
  if (['complete', 'abandon', 'supersede'].includes(action)) {
    return {
      tool: 'longrein_task_close',
      arguments: {
        task,
        action,
        summary: parsed.one('--summary'),
        superseded_by: compact(parsed.one('--by')),
        actor: compact(parsed.one('--actor')),
      },
      operation: `task.${action}`,
    };
  }
  throw new Error(`unsupported Task test action: ${[action, subaction].filter(Boolean).join(' ')}`);
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [cli, 'mcp'],
  cwd: root,
  env: process.env,
  stderr: 'pipe',
});
const client = new Client({ name: 'longrein-runtime-test', version: '1.0.0' });

try {
  const request = invocation(process.argv.slice(2));
  await client.connect(transport);
  const result = await client.callTool({ name: request.tool, arguments: request.arguments });
  const text = result.content.find((item) => item.type === 'text')?.text;
  if (!text) throw new Error(`${request.tool} returned no text content`);
  const value = JSON.parse(text);
  if (result.isError || value.ok === false) throw new Error(value.error ?? text);
  if (request.operation) value.operation = request.operation;
  console.log(JSON.stringify(value));
  if (request.failOnFindings && value.findings?.some((finding) => finding.severity === 'error' || finding.severity === 'warn')) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await transport.close().catch(() => {});
}
