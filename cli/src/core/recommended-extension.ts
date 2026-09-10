import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { packageRoot } from './paths.js';

export type ExtensionComponent = 'cass' | 'cass-skill';
export type ExtensionTarget = 'codex' | 'claude' | 'pi';

export const EXTENSION_COMPONENTS: ExtensionComponent[] = ['cass', 'cass-skill'];
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
    if (component === 'cass') installCass(options.dryRun);
    else installPlugin(options.targets, options.dryRun);
  }
}

export function extensionStatus(): Array<{ component: string; installed: boolean; detail: string }> {
  const commands: Array<[string, string[]]> = [
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
