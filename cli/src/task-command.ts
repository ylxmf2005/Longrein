import fs from 'node:fs';
import { Command, OptionValues } from 'commander';
import pc from 'picocolors';
import {
  blockTaskWork,
  completeTask,
  createTask,
  finishTaskWork,
  fixTaskViews,
  inspectTaskHealth,
  loadTaskState,
  recordTaskFinding,
  setTaskCompletionEvidence,
  setTaskContext,
  startTaskWork,
  TASK_STATUSES,
  taskSummary,
  upsertTaskArtifact,
} from './core/task-runtime.js';

function collect(value: string, previous: string[] | undefined): string[] {
  return [...(previous ?? []), value];
}

function optionalFile(file: string | undefined): string | null | undefined {
  if (file === undefined) return undefined;
  if (file === '-') return fs.readFileSync(0, 'utf8');
  return fs.readFileSync(file, 'utf8');
}

function run(action: () => void): void {
  try {
    action();
  } catch (error) {
    console.error(pc.red(`error: ${error instanceof Error ? error.message : String(error)}`));
    process.exitCode = 1;
  }
}

function evidenceOptions(command: Command): Command {
  return command
    .option('--actor <name>', 'actor recorded in timeline.md')
    .option('--evidence-ref <reference>', 'evidence path or identifier (repeatable)', collect);
}

function printCreated(state: ReturnType<typeof loadTaskState>, verb: string): void {
  console.log(pc.green(`${verb}: ${state.workspace}`));
  console.log(taskSummary(state));
}

export function registerTaskCommands(program: Command): void {
  const task = program.command('task').description('create, update, inspect and verify persistent Longrein Tasks');

  task
    .command('create <directory>')
    .description('create a Runtime-owned task.md, timeline.md and .runtime/state.json')
    .requiredOption('--id <task-id>', 'stable task id')
    .requiredOption('--request <text>', 'original user request')
    .option('--repository <path>', 'repository associated with the task')
    .option('--source-ref <ref>', 'intended source ref')
    .option('--working-branch <branch>', 'intended working branch')
    .option('--target-ref <ref>', 'intended target ref')
    .option('--actor <name>', 'actor recorded in timeline.md')
    .action((directory: string, opts: OptionValues) =>
      run(() => {
        const state = createTask({
          directory,
          taskId: opts.id,
          request: opts.request,
          repository: opts.repository,
          sourceRef: opts.sourceRef,
          workingBranch: opts.workingBranch,
          targetRef: opts.targetRef,
          actor: opts.actor,
        });
        printCreated(state, 'created');
      }),
    );

  const context = evidenceOptions(
    task
      .command('context <task>')
      .description('establish or revise Task Context through the Runtime')
      .requiredOption('--summary <text>', 'timeline summary for this context change')
      .option('--decision <UD-###>', 'required when replacing established commitments')
      .option('--goal <item>', 'goal item (repeatable)', collect)
      .option('--scope <item>', 'scope item (repeatable)', collect)
      .option('--non-goal <item>', 'non-goal item (repeatable)', collect)
      .option('--completion <item>', 'completion evidence item (repeatable)', collect)
      .option('--preserve <item>', 'must-preserve item (repeatable)', collect)
      .option('--assumption <item>', 'assumption or evidence gap (repeatable)', collect)
      .option('--envelope-file <path>', 'Markdown body for Task Operating Envelope; use - for stdin')
      .option('--source-ref <ref>', 'intended source ref')
      .option('--working-branch <branch>', 'intended working branch')
      .option('--target-ref <ref>', 'intended target ref')
      .option('--status <status>', 'set shaping or ready')
      .option('--now <text>', 'current work after applying this context')
      .option('--next <text>', 'next work after applying this context')
      .option('--waiting-on <text>', 'person or external condition currently awaited'),
  );
  context.action((taskPath: string, opts: OptionValues) =>
    run(() => {
      if (opts.status && !['shaping', 'ready'].includes(opts.status)) {
        throw new Error('context --status must be shaping or ready');
      }
      const state = setTaskContext(taskPath, {
        summary: opts.summary,
        actor: opts.actor,
        decision: opts.decision,
        evidence: opts.evidenceRef,
        goal: opts.goal,
        scope: opts.scope,
        nonGoals: opts.nonGoal,
        completionEvidence: opts.completion,
        mustPreserve: opts.preserve,
        assumptions: opts.assumption,
        operatingEnvelopeMarkdown: optionalFile(opts.envelopeFile),
        sourceRef: opts.sourceRef,
        workingBranch: opts.workingBranch,
        targetRef: opts.targetRef,
        status: opts.status,
        now: opts.now,
        next: opts.next,
        waitingOn: opts.waitingOn,
      });
      console.log(taskSummary(state));
    }),
  );

  const work = task.command('work').description('record explicit work-unit boundaries without hooks');

  evidenceOptions(
    work
      .command('start <task>')
      .description('start one work unit and capture its repository baseline')
      .requiredOption('--now <text>', 'work being performed now')
      .option('--next <text>', 'expected next action'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      const state = startTaskWork(taskPath, {
        now: opts.now,
        next: opts.next,
        actor: opts.actor,
        evidence: opts.evidenceRef,
      });
      console.log(taskSummary(state));
    }),
  );

  evidenceOptions(
    work
      .command('finish <task>')
      .description('finish the active work unit and reconcile repository changes')
      .requiredOption('--result <text>', 'observable result of the work unit')
      .option('--now <text>', 'current action after finishing; defaults to none')
      .option('--next <text>', 'next action')
      .option('--status <status>', 'ready or verifying', 'ready'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      if (!['ready', 'verifying'].includes(opts.status)) throw new Error('work finish --status must be ready or verifying');
      const state = finishTaskWork(taskPath, {
        result: opts.result,
        now: opts.now,
        next: opts.next,
        status: opts.status,
        actor: opts.actor,
        evidence: opts.evidenceRef,
      });
      console.log(taskSummary(state));
    }),
  );

  evidenceOptions(
    work
      .command('block <task>')
      .description('end the active work unit as blocked or waiting')
      .requiredOption('--reason <text>', 'why progress cannot safely continue')
      .option('--waiting-on <text>', 'person or external condition being awaited')
      .option('--next <text>', 'next action after the blocker clears'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      const state = blockTaskWork(taskPath, {
        reason: opts.reason,
        waitingOn: opts.waitingOn,
        next: opts.next,
        actor: opts.actor,
        evidence: opts.evidenceRef,
      });
      console.log(taskSummary(state));
    }),
  );

  evidenceOptions(
    task
      .command('finding <task>')
      .description('record a confirmed finding that changes subsequent judgment')
      .requiredOption('--summary <text>', 'confirmed finding'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      const state = recordTaskFinding(taskPath, {
        summary: opts.summary,
        evidence: opts.evidenceRef,
        actor: opts.actor,
      });
      console.log(taskSummary(state));
    }),
  );

  evidenceOptions(
    task
      .command('artifact <task>')
      .description('publish or refresh an Artifact Map entry and its content hash')
      .requiredOption('--path <path>', 'artifact path, relative to the Task workspace or absolute')
      .requiredOption('--status <status>', 'planned, active, ready, verified, stale or superseded')
      .requiredOption('--establishes <text>', 'what this artifact establishes')
      .requiredOption('--next-consumer <text>', 'who should read it next'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      const state = upsertTaskArtifact(taskPath, {
        artifactPath: opts.path,
        status: opts.status,
        establishes: opts.establishes,
        nextConsumer: opts.nextConsumer,
        actor: opts.actor,
        evidence: opts.evidenceRef,
      });
      console.log(taskSummary(state));
    }),
  );

  evidenceOptions(
    task
      .command('evidence <task> <evidence-id>')
      .description('record the result for one Completion Evidence item')
      .requiredOption('--status <status>', 'pending, passed, failed or blocked')
      .option('--proof <text>', 'short proof summary'),
  ).action((taskPath: string, evidenceId: string, opts: OptionValues) =>
    run(() => {
      const state = setTaskCompletionEvidence(taskPath, evidenceId, {
        status: opts.status,
        proof: opts.proof,
        evidence: opts.evidenceRef,
        actor: opts.actor,
      });
      console.log(taskSummary(state));
    }),
  );

  task
    .command('show <task>')
    .description('show current Task status')
    .option('--json', 'print Runtime state as JSON', false)
    .action((taskPath: string, opts: OptionValues) =>
      run(() => {
        const state = loadTaskState(taskPath);
        console.log(opts.json ? JSON.stringify(state, null, 2) : taskSummary(state));
      }),
    );

  task
    .command('doctor <task>')
    .description('detect drift between Runtime state, task.md, timeline.md, artifacts and repository')
    .option('--fix', 'regenerate task.md and timeline.md from Runtime state', false)
    .option('--json', 'print findings as JSON', false)
    .action((taskPath: string, opts: OptionValues) =>
      run(() => {
        const findings = opts.fix ? fixTaskViews(taskPath) : inspectTaskHealth(taskPath);
        if (opts.json) {
          console.log(JSON.stringify(findings, null, 2));
        } else if (findings.length === 0) {
          console.log(pc.green('✓ Task state is consistent'));
        } else {
          for (const finding of findings) {
            const label =
              finding.severity === 'error'
                ? pc.red('error')
                : finding.severity === 'warn'
                  ? pc.yellow('warn ')
                  : pc.cyan('info ');
            console.log(`${label} ${finding.code}: ${finding.message}`);
          }
        }
        if (findings.some((finding) => finding.severity === 'error' || finding.severity === 'warn')) {
          process.exitCode = 1;
        }
      }),
    );

  evidenceOptions(
    task
      .command('complete <task>')
      .description('complete a Task only after evidence and consistency gates pass')
      .requiredOption('--summary <text>', 'completion summary'),
  ).action((taskPath: string, opts: OptionValues) =>
    run(() => {
      const state = completeTask(taskPath, {
        summary: opts.summary,
        actor: opts.actor,
        evidence: opts.evidenceRef,
      });
      console.log(pc.green('✓ Task complete'));
      console.log(taskSummary(state));
    }),
  );

  task.addHelpText(
    'after',
    `\nLifecycle statuses: ${TASK_STATUSES.join(', ')}\nCore state files are Runtime-owned; use these commands instead of editing task.md or timeline.md directly.\n`,
  );
}
