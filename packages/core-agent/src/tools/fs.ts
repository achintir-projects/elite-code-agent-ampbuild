import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export async function readFile(cwd: string, path: string): Promise<string> {
  return fs.readFile(join(cwd, path), 'utf8');
}

export async function writeFile(cwd: string, path: string, content: string): Promise<void> {
  await fs.mkdir(join(cwd, path, '..'), { recursive: true }).catch(() => {});
  return fs.writeFile(join(cwd, path), content, 'utf8');
}
