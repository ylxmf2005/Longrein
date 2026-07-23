import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { packageRoot, piAgentDir, TargetId } from './paths.js';

export interface CleanupResult {
  state: 'removed' | 'absent' | 'skipped' | 'failed';
  label: string;
  detail: string;
}

const absentPattern = /not installed|not found|no .* named|unknown marketplace|does not exist|not configured|already absent/i;

function runRemoval(label: string, command: string, args: string[]): CleanupResult {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.error && (result.error as NodeJS.ErrnoException).code === 'ENOENT') {
    return { state: 'skipped', label, detail: `${command} is not available` };
  }
  const detail = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  if (result.status === 0) return { state: 'removed', label, detail: detail || 'removed' };
  if (absentPattern.test(detail)) return { state: 'absent', label, detail: detail || 'not installed' };
  return { state: 'failed', label, detail: detail || `exit ${result.status}` };
}

function codexHome(): string {
  return path.resolve(process.env.CODEX_HOME?.trim() || path.join(os.homedir(), '.codex'));
}

function codexMcpState(): 'managed' | 'absent' | 'foreign' {
  const file = path.join(codexHome(), 'config.toml');
  if (!fs.existsSync(file)) return 'absent';
  const text = fs.readFileSync(file, 'utf8');
  const section = text.match(/(?:^|\n)\[mcp_servers\.longrein\]\n([\s\S]*?)(?=\n\[|$)/)?.[1];
  if (!section) return 'absent';
  const managedCommand = /^command\s*=\s*"[^"]*longrein"\s*$/m.test(section);
  const managedArgs = /^args\s*=\s*\[\s*"mcp"\s*\]\s*$/m.test(section);
  return managedCommand && managedArgs ? 'managed' : 'foreign';
}

function claudeMcpState(): 'managed' | 'absent' | 'foreign' {
  const file = path.join(os.homedir(), '.claude.json');
  if (!fs.existsSync(file)) return 'absent';
  try {
    const config = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      mcpServers?: Record<string, { command?: string; args?: string[] }>;
    };
    const entry = config.mcpServers?.longrein;
    if (!entry) return 'absent';
    const managedCommand = entry.command ? path.basename(entry.command).startsWith('longrein') : false;
    const managedArgs = JSON.stringify(entry.args) === JSON.stringify(['mcp']);
    return managedCommand && managedArgs ? 'managed' : 'foreign';
  } catch {
    return 'foreign';
  }
}

function cleanupCodex(): CleanupResult[] {
  const results = [
    runRemoval('Codex Longrein Extension plugin', 'codex', ['plugin', 'remove', 'longrein-extension@longrein', '--json']),
    runRemoval('Codex legacy setup plugin', 'codex', ['plugin', 'remove', 'codex-setup@longrein', '--json']),
    runRemoval('Codex Longrein marketplace', 'codex', ['plugin', 'marketplace', 'remove', 'longrein', '--json']),
  ];
  const mcp = codexMcpState();
  if (mcp === 'managed') results.push(runRemoval('Codex legacy Longrein MCP', 'codex', ['mcp', 'remove', 'longrein']));
  else if (mcp === 'foreign') {
    results.push({ state: 'skipped', label: 'Codex MCP named longrein', detail: 'configuration is not managed by Longrein' });
  } else results.push({ state: 'absent', label: 'Codex legacy Longrein MCP', detail: 'not configured' });
  return results;
}

function cleanupClaude(): CleanupResult[] {
  const results = [
    runRemoval('Claude Code Longrein Extension plugin', 'claude', [
      'plugin',
      'uninstall',
      'longrein-extension@longrein',
      '--scope',
      'user',
    ]),
    runRemoval('Claude Code legacy setup plugin', 'claude', [
      'plugin',
      'uninstall',
      'codex-setup@longrein',
      '--scope',
      'user',
    ]),
    runRemoval('Claude Code Longrein marketplace', 'claude', [
      'plugin',
      'marketplace',
      'remove',
      'longrein',
      '--scope',
      'user',
    ]),
  ];
  const mcp = claudeMcpState();
  if (mcp === 'managed') {
    results.push(runRemoval('Claude Code legacy Longrein MCP', 'claude', ['mcp', 'remove', 'longrein', '--scope', 'user']));
  } else if (mcp === 'foreign') {
    results.push({ state: 'skipped', label: 'Claude Code MCP named longrein', detail: 'configuration is not managed by Longrein' });
  } else results.push({ state: 'absent', label: 'Claude Code legacy Longrein MCP', detail: 'not configured' });
  return results;
}

function cleanupPi(): CleanupResult[] {
  const settingsFile = path.join(piAgentDir(), 'settings.json');
  if (!fs.existsSync(settingsFile)) return [{ state: 'absent', label: 'Pi Longrein packages', detail: 'settings not found' }];
  try {
    const config = JSON.parse(fs.readFileSync(settingsFile, 'utf8')) as { packages?: string[] };
    const packages = config.packages ?? [];
    const root = packageRoot();
    const retained = packages.filter((source) => {
      if (source.startsWith('npm:')) return true;
      const resolved = path.resolve(piAgentDir(), source);
      const insideLongrein = resolved === root || resolved.startsWith(`${root}${path.sep}`);
      const packageName = path.basename(resolved);
      return !(insideLongrein && (packageName === 'longrein-extension' || packageName === 'longrein-pi'));
    });
    if (retained.length === packages.length) {
      return [{ state: 'absent', label: 'Pi Longrein packages', detail: 'not configured' }];
    }
    config.packages = retained;
    fs.writeFileSync(settingsFile, `${JSON.stringify(config, null, 2)}\n`);
    return [{ state: 'removed', label: 'Pi Longrein packages', detail: settingsFile }];
  } catch (error) {
    return [{ state: 'failed', label: 'Pi Longrein packages', detail: error instanceof Error ? error.message : String(error) }];
  }
}

function cleanupLegacyServices(): CleanupResult[] {
  if (process.platform !== 'darwin') return [];
  const uid = process.getuid?.();
  if (uid === undefined) return [];
  for (const label of ['com.longrein.dashboard', 'com.ethan.longrein-sync']) {
    spawnSync('launchctl', ['bootout', `gui/${uid}/${label}`], { stdio: 'ignore' });
    spawnSync('launchctl', ['disable', `gui/${uid}/${label}`], { stdio: 'ignore' });
  }
  for (const file of [
    path.join(os.homedir(), 'Library', 'LaunchAgents', 'com.longrein.dashboard.plist'),
    path.join(os.homedir(), 'Library', 'LaunchAgents', 'com.ethan.longrein-sync.plist'),
  ]) {
    fs.rmSync(file, { force: true });
  }
  spawnSync('pkill', ['-TERM', '-f', 'longrein mcp'], { stdio: 'ignore' });
  spawnSync('pkill', ['-TERM', '-f', 'cli/dist/index.js dashboard'], { stdio: 'ignore' });
  return [{ state: 'removed', label: 'Legacy Longrein services', detail: 'stopped and disabled where present' }];
}

export function cleanupLongreinIntegrations(activeTargets: TargetId[], includeLegacyServices: boolean): CleanupResult[] {
  const results: CleanupResult[] = [];
  if (activeTargets.includes('codex')) results.push(...cleanupCodex());
  if (activeTargets.includes('claude')) results.push(...cleanupClaude());
  if (activeTargets.includes('pi')) results.push(...cleanupPi());
  if (includeLegacyServices) results.push(...cleanupLegacyServices());
  return results;
}
