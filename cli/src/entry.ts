import { LONGREIN_VERSION } from './version.js';

const command = process.argv[2];
const helpTarget = command === 'help' ? process.argv[3] : undefined;

if (command === '--version' || command === '-V') {
  console.log(LONGREIN_VERSION);
} else if (command === 'extension' || helpTarget === 'extension') {
  await import('./extension-entry.js');
} else {
  await import('./index.js');
}
