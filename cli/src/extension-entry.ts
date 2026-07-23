import { Command } from 'commander';
import pc from 'picocolors';
import {
  ExtensionComponent,
  ExtensionTarget,
  extensionStatus,
  installExtension,
  resolveExtensionComponents,
} from './core/recommended-extension.js';

const program = new Command();

function targets(options: { codex?: boolean; claude?: boolean; pi?: boolean }): ExtensionTarget[] {
  if (options.codex || options.claude || options.pi) {
    return [options.codex ? 'codex' : null, options.claude ? 'claude' : null, options.pi ? 'pi' : null].filter(
      Boolean,
    ) as ExtensionTarget[];
  }
  return ['codex', 'claude'];
}

program.name('longrein extension').description('Install optional agent extensions from official upstream channels.');

program
  .command('install [components...]')
  .description('install or update FastCtx, CodeGraph, cass and the coding-agent-session-search Skill')
  .option('--codex', 'only configure Codex')
  .option('--claude', 'only configure Claude Code')
  .option('--pi', 'only configure Pi')
  .option('--dry-run', 'print the official commands without executing them', false)
  .option('-y, --yes', 'confirm execution of upstream installers', false)
  .action(async (values: string[], options) => {
    const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
    let selected: ExtensionComponent[];
    if (values.length === 0 && interactive) {
      const { pickExtensionComponents } = await import('./ui/Picker.js');
      const picked = await pickExtensionComponents(true);
      if (picked === null) {
        console.log(pc.dim('cancelled'));
        return;
      }
      if (picked.length === 0) {
        console.log(pc.dim('nothing selected'));
        return;
      }
      selected = picked;
    } else {
      selected = resolveExtensionComponents(values);
    }
    if (!options.yes && !options.dryRun && !interactive) {
      console.error(pc.red('refusing to run upstream installers without --yes; use --dry-run to inspect the commands'));
      process.exitCode = 1;
      return;
    }
    installExtension({ components: selected, targets: targets(options), dryRun: options.dryRun });
    console.log(
      options.dryRun
        ? pc.cyan('\nDry run complete; no installers or host configuration were changed.\n')
        : pc.green('\nExtension installation finished. Restart the selected hosts before using newly installed capabilities.\n'),
    );
  });

program
  .command('status')
  .description('show installed versions of the recommended upstream tools')
  .action(() => {
    for (const item of extensionStatus()) {
      console.log(`${item.installed ? pc.green('✓') : pc.red('✗')} ${item.component.padEnd(10)} ${item.detail}`);
    }
  });

program.parse(['node', 'longrein extension', ...process.argv.slice(3)]);
