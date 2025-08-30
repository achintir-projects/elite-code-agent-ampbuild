import { promises as fs } from 'fs';
import { join } from 'path';
import { RunResult } from '../types.js';

export async function writeRunRecord(cwd: string, log: any, result: RunResult) {
  const dir = join(cwd, 'artifacts');
  await fs.mkdir(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.writeFile(join(dir, `run-${ts}.json`), JSON.stringify({ log, result }, null, 2), 'utf8');
}
