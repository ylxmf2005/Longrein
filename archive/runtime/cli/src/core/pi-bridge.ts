import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { packageRoot, piAgentDir } from './paths.js';

export type PiBridgeState = 'missing' | 'managed' | 'unavailable';

export interface PiBridgeStatus {
  state: PiBridgeState;
  detail: string;
}

interface PiPackageEntry {
  source?: string;
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

function bridgePackage(): string {
  return path.join(packageRoot(), 'plugins', 'longrein-pi');
}

function packageSource(entry: string | PiPackageEntry): string | null {
  return typeof entry === 'string' ? entry : typeof entry.source === 'string' ? entry.source : null;
}

function resolveLocalPackage(source: string, settingsFile: string): string | null {
  if (/^(npm:|git:|https?:|ssh:)/.test(source)) return null;
  return path.resolve(path.dirname(settingsFile), source);
}

export function piBridgeStatus(): PiBridgeStatus {
  if (!commandPath('pi')) return { state: 'unavailable', detail: 'Pi CLI is not available on PATH.' };
  const settingsFile = path.join(piAgentDir(), 'settings.json');
  if (!fs.existsSync(settingsFile)) return { state: 'missing', detail: 'Longrein Pi bridge is not installed.' };
  try {
    const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')) as {
      packages?: Array<string | PiPackageEntry>;
    };
    const expected = path.resolve(bridgePackage());
    const installed = (settings.packages ?? []).some((entry) => {
      const source = packageSource(entry);
      const resolved = source ? resolveLocalPackage(source, settingsFile) : null;
      return resolved === expected;
    });
    return installed
      ? { state: 'managed', detail: 'Pi loads the Longrein tool bridge.' }
      : { state: 'missing', detail: 'Longrein Pi bridge is not installed.' };
  } catch (error) {
    return {
      state: 'unavailable',
      detail: `Pi settings could not be read: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function installPiBridge(): PiBridgeStatus {
  const pi = commandPath('pi');
  if (!pi) return { state: 'unavailable', detail: 'Pi CLI is not available on PATH.' };
  const current = piBridgeStatus();
  if (current.state === 'managed') return { ...current, detail: 'Longrein Pi bridge is already current.' };
  try {
    execFileSync(pi, ['install', bridgePackage()], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    return piBridgeStatus();
  } catch (error) {
    return {
      state: 'unavailable',
      detail: `Could not install the Longrein Pi bridge: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function uninstallPiBridge(): PiBridgeStatus {
  const pi = commandPath('pi');
  if (!pi) return { state: 'unavailable', detail: 'Pi CLI is not available on PATH.' };
  const current = piBridgeStatus();
  if (current.state === 'missing') return current;
  try {
    execFileSync(pi, ['remove', bridgePackage()], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    const after = piBridgeStatus();
    return after.state === 'missing' ? { state: 'missing', detail: 'Removed the Longrein Pi bridge.' } : after;
  } catch (error) {
    return {
      state: 'unavailable',
      detail: `Could not remove the Longrein Pi bridge: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
