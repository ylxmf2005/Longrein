import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { packageRoot } from './paths.js';

export type ExtensionComponent = 'fastctx' | 'codegraph' | 'cass' | 'cass-skill';
export type ExtensionTarget = 'codex' | 'claude' | 'pi';

// FastCtx applies last because other agent installers may reserialize Codex config.toml.
export const EXTENSION_COMPONENTS: ExtensionComponent[] = ['codegraph', 'cass', 'cass-skill', 'fastctx'];
const EXTENSION_PLUGIN_ID = 'longrein-extension@longrein';
const LEGACY_PLUGIN_ID = 'codex-setup@longrein';

export interface ExtensionCommand {
  label: string;
  command: string;
  args: string[];
}

export interface ExtensionRunOptions {
  components: ExtensionComponent[];
  targets: ExtensionTarget[];
  dryRun: boolean;
}

export function resolveExtensionComponents(values: string[]): ExtensionComponent[] {
  if (values.length === 0) return [...EXTENSION_COMPONENTS];
  const unknown = values.filter((value) => !EXTENSION_COMPONENTS.includes(value as ExtensionComponent));
  if (unknown.length) throw new Error(`unknown extension component(s): ${unknown.join(', ')}`);
  const selected = new Set(values as ExtensionComponent[]);
  return EXTENSION_COMPONENTS.filter((component) => selected.has(component));
}

function commandPath(command: string): string | null {
  const names = process.platform === 'win32' ? [`${command}.cmd`, `${command}.exe`, command] : [command];
  for (const directory of (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)) {
    for (const name of names) {
      const candidate = path.resolve(directory, name);
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        return fs.realpathSync(candidate);
      } catch {
        // Continue through PATH.
      }
    }
  }
  return null;
}

function run(command: ExtensionCommand, dryRun: boolean): void {
  console.log(`  ${dryRun ? 'plan' : 'run '}  ${command.label}`);
  console.log(`        ${[command.command, ...command.args].join(' ')}`);
  if (dryRun) return;
  execFileSync(command.command, command.args, { stdio: 'inherit' });
}

function shellCommand(label: string, source: string): ExtensionCommand {
  if (process.platform === 'win32') {
    return { label, command: 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-Command', source] };
  }
  return { label, command: 'bash', args: ['-lc', source] };
}

function installFastctx(targets: ExtensionTarget[], dryRun: boolean): void {
  const nativeTargets = targets.filter((target) => target !== 'pi');
  if (nativeTargets.length === 0) {
    console.log('  skip  FastCtx requires an MCP-capable host; Pi does not expose native MCP configuration.');
    return;
  }
  run(
    {
      label: 'Install the latest FastCtx from its official npm package',
      command: 'npm',
      args: ['install', '--global', 'fastctx@latest', '--registry=https://registry.npmjs.org/'],
    },
    dryRun,
  );

  if (nativeTargets.includes('codex')) {
    run(
      {
        label: 'Apply the upstream FastCtx standard profile to Codex',
        command: 'fastctx',
        args: ['apply', '--tier', 'standard', '--yes'],
      },
      dryRun,
    );
  }

  if (nativeTargets.includes('claude')) installClaudeFastctx(dryRun);
  run(
    nativeTargets.includes('codex')
      ? { label: 'Verify the applied FastCtx configuration', command: 'fastctx', args: ['status'] }
      : { label: 'Verify FastCtx version', command: 'fastctx', args: ['--version'] },
    dryRun,
  );
}

interface ClaudeConfig {
  mcpServers?: Record<string, { type?: string; command?: string; args?: string[] }>;
}

type ClaudeMcpEntry = NonNullable<ClaudeConfig['mcpServers']>[string];

function installClaudeFastctx(dryRun: boolean): void {
  const appliedExecutable = path.join(os.homedir(), '.fastctx', 'bin', process.platform === 'win32' ? 'fastctx.exe' : 'fastctx');
  const executable = fs.existsSync(appliedExecutable) ? fs.realpathSync(appliedExecutable) : (commandPath('fastctx') ?? 'fastctx');
  const configFile = path.join(os.homedir(), '.claude.json');
  let current: ClaudeMcpEntry | undefined;
  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8')) as ClaudeConfig;
    current = config.mcpServers?.fastctx;
  } catch {
    current = undefined;
  }

  const argsMatch = JSON.stringify(current?.args) === JSON.stringify(['serve', '--enable-shell']);
  const knownCommand =
    current?.command === executable ||
    current?.command === appliedExecutable ||
    (current?.command ? path.basename(current.command).startsWith('fastctx') : false) ||
    (current?.command ? current.command.includes(`${path.sep}node_modules${path.sep}fastctx${path.sep}`) : false);
  const managed =
    current?.type === 'stdio' &&
    knownCommand &&
    argsMatch;
  if (current && !managed) {
    throw new Error('Claude Code already has a foreign MCP server named fastctx; refusing to replace it.');
  }
  if (managed && current?.command === executable) {
    console.log('  skip  Claude Code FastCtx MCP is already current');
    return;
  }
  if (managed) {
    run(
      { label: 'Remove the previous Longrein-managed FastCtx entry from Claude Code', command: 'claude', args: ['mcp', 'remove', '--scope', 'user', 'fastctx'] },
      dryRun,
    );
  }
  run(
    {
      label: 'Register the official FastCtx stdio server in Claude Code',
      command: 'claude',
      args: ['mcp', 'add', '--scope', 'user', 'fastctx', '--', executable, 'serve', '--enable-shell'],
    },
    dryRun,
  );
}

function installCodegraph(targets: ExtensionTarget[], dryRun: boolean): void {
  if (commandPath('codegraph')) {
    run({ label: 'Upgrade CodeGraph with its official updater', command: 'codegraph', args: ['upgrade'] }, dryRun);
  } else if (process.platform === 'win32') {
    run(
      shellCommand(
        'Install CodeGraph with its official PowerShell installer',
        "irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex",
      ),
      dryRun,
    );
  } else {
    run(
      shellCommand(
        'Install CodeGraph with its official installer',
        'curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh',
      ),
      dryRun,
    );
  }

  const targetIds = targets.filter((target) => target !== 'pi').join(',');
  if (targetIds) {
    run(
      {
        label: 'Let the official CodeGraph installer configure the selected agents',
        command: 'codegraph',
        args: ['install', `--target=${targetIds}`, '--location=global', '--yes'],
      },
      dryRun,
    );
  } else {
    console.log('  skip  CodeGraph has no Pi host target; the CLI remains available for explicit shell use.');
  }
  run({ label: 'Verify CodeGraph version', command: 'codegraph', args: ['--version'] }, dryRun);
}

function brewHasCass(): boolean {
  const brew = commandPath('brew');
  if (!brew) return false;
  return spawnSync(brew, ['list', '--versions', 'cass'], { stdio: 'ignore' }).status === 0;
}

function installCass(dryRun: boolean): void {
  if (process.platform !== 'win32' && commandPath('brew')) {
    run(
      {
        label: brewHasCass() ? 'Upgrade cass from its official Homebrew tap' : 'Install cass from its official Homebrew tap',
        command: 'brew',
        args: [brewHasCass() ? 'upgrade' : 'install', 'dicklesworthstone/tap/cass'],
      },
      dryRun,
    );
  } else if (process.platform === 'win32') {
    run(
      shellCommand(
        'Install the latest cass with its official verified installer',
        '& ([scriptblock]::Create((irm "https://raw.githubusercontent.com/Dicklesworthstone/coding_agent_session_search/main/install.ps1"))) -EasyMode -Verify',
      ),
      dryRun,
    );
  } else {
    run(
      shellCommand(
        'Install the latest cass with its official verified installer',
        'curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/coding_agent_session_search/main/install.sh?$(date +%s)" | bash -s -- --easy-mode --verify',
      ),
      dryRun,
    );
  }
  run({ label: 'Verify cass version', command: 'cass', args: ['--version'] }, dryRun);
  run({ label: 'Check cass readiness without opening the TUI', command: 'cass', args: ['triage', '--json'] }, dryRun);
}

function jsonCommand(command: string, args: string[]): unknown {
  return JSON.parse(execFileSync(command, args, { encoding: 'utf8' }));
}

function installCodexPlugin(dryRun: boolean): void {
  const root = packageRoot();
  if (dryRun) {
    run({ label: 'Register the Longrein plugin marketplace in Codex', command: 'codex', args: ['plugin', 'marketplace', 'add', root, '--json'] }, true);
    run({ label: 'Install the Longrein Extension Skill in Codex', command: 'codex', args: ['plugin', 'add', EXTENSION_PLUGIN_ID, '--json'] }, true);
    return;
  }
  const marketplaces = jsonCommand('codex', ['plugin', 'marketplace', 'list', '--json']) as {
    marketplaces?: Array<{ name?: string; marketplaceSource?: { source?: string } }>;
  };
  const marketplace = marketplaces.marketplaces?.find((item) => item.name === 'longrein');
  if (marketplace?.marketplaceSource?.source && path.resolve(marketplace.marketplaceSource.source) !== path.resolve(root)) {
    throw new Error(`Codex marketplace "longrein" already points to ${marketplace.marketplaceSource.source}; refusing to replace it.`);
  }
  if (!marketplace) run({ label: 'Register the Longrein plugin marketplace in Codex', command: 'codex', args: ['plugin', 'marketplace', 'add', root, '--json'] }, false);

  const plugins = jsonCommand('codex', ['plugin', 'list', '--available', '--json']) as {
    installed?: Array<{ pluginId?: string }>;
  };
  if (plugins.installed?.some((item) => item.pluginId === LEGACY_PLUGIN_ID)) {
    run({ label: 'Remove the legacy Codex Setup plugin from Codex', command: 'codex', args: ['plugin', 'remove', LEGACY_PLUGIN_ID, '--json'] }, false);
  }
  if (plugins.installed?.some((item) => item.pluginId === EXTENSION_PLUGIN_ID)) {
    run({ label: 'Refresh the Longrein Extension Skill in Codex', command: 'codex', args: ['plugin', 'remove', EXTENSION_PLUGIN_ID, '--json'] }, false);
  }
  run({ label: 'Install the Longrein Extension Skill in Codex', command: 'codex', args: ['plugin', 'add', EXTENSION_PLUGIN_ID, '--json'] }, false);
}

function installClaudePlugin(dryRun: boolean): void {
  const root = packageRoot();
  if (dryRun) {
    run({ label: 'Register the Longrein plugin marketplace in Claude Code', command: 'claude', args: ['plugin', 'marketplace', 'add', root] }, true);
    run({ label: 'Install the Longrein Extension Skill in Claude Code', command: 'claude', args: ['plugin', 'install', EXTENSION_PLUGIN_ID, '--scope', 'user'] }, true);
    return;
  }
  const marketplaces = jsonCommand('claude', ['plugin', 'marketplace', 'list', '--json']) as Array<{
    name?: string;
    source?: string;
    path?: string;
  }>;
  const marketplace = marketplaces.find((item) => item.name === 'longrein');
  if (marketplace?.path && path.resolve(marketplace.path) !== path.resolve(root)) {
    throw new Error(`Claude Code marketplace "longrein" already points to ${marketplace.path}; refusing to replace it.`);
  }
  if (!marketplace) run({ label: 'Register the Longrein plugin marketplace in Claude Code', command: 'claude', args: ['plugin', 'marketplace', 'add', root] }, false);

  const pluginOutput = jsonCommand('claude', ['plugin', 'list', '--json']) as
    | Array<{ id?: string }>
    | { installed?: Array<{ id?: string }> };
  const installed = Array.isArray(pluginOutput) ? pluginOutput : (pluginOutput.installed ?? []);
  if (installed.some((item) => item.id === LEGACY_PLUGIN_ID)) {
    run({ label: 'Remove the legacy Codex Setup plugin from Claude Code', command: 'claude', args: ['plugin', 'uninstall', LEGACY_PLUGIN_ID, '--scope', 'user'] }, false);
  }
  if (installed.some((item) => item.id === EXTENSION_PLUGIN_ID)) {
    run({ label: 'Update the Longrein Extension Skill in Claude Code', command: 'claude', args: ['plugin', 'update', EXTENSION_PLUGIN_ID, '--scope', 'user'] }, false);
  } else {
    run({ label: 'Install the Longrein Extension Skill in Claude Code', command: 'claude', args: ['plugin', 'install', EXTENSION_PLUGIN_ID, '--scope', 'user'] }, false);
  }
}

function installPiPlugin(dryRun: boolean): void {
  const plugin = path.join(packageRoot(), 'plugins', 'longrein-extension');
  run(
    {
      label: 'Install the Longrein Extension package in Pi',
      command: 'pi',
      args: ['install', plugin],
    },
    dryRun,
  );
}

function installPlugin(targets: ExtensionTarget[], dryRun: boolean): void {
  if (targets.includes('codex')) installCodexPlugin(dryRun);
  if (targets.includes('claude')) installClaudePlugin(dryRun);
  if (targets.includes('pi')) installPiPlugin(dryRun);
}

export function installExtension(options: ExtensionRunOptions): void {
  for (const component of options.components) {
    console.log(`\n${component}`);
    if (component === 'fastctx') installFastctx(options.targets, options.dryRun);
    else if (component === 'codegraph') installCodegraph(options.targets, options.dryRun);
    else if (component === 'cass') installCass(options.dryRun);
    else installPlugin(options.targets, options.dryRun);
  }
}

export function extensionStatus(): Array<{ component: string; installed: boolean; detail: string }> {
  const commands: Array<[string, string[]]> = [
    ['fastctx', ['--version']],
    ['codegraph', ['--version']],
    ['cass', ['--version']],
  ];
  return commands.map(([command, args]) => {
    const executable = commandPath(command);
    if (!executable) return { component: command, installed: false, detail: 'not found on PATH' };
    const result = spawnSync(executable, args, { encoding: 'utf8' });
    const detail = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() || `exit ${result.status}`;
    return { component: command, installed: result.status === 0, detail };
  });
}
