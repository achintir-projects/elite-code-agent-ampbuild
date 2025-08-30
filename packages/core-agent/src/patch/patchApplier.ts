import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export async function applyPatch(cwd: string, unifiedDiff: string): Promise<boolean> {
  try {
    const tmp = join(cwd, `.agent-patch-${Date.now()}.diff`);
    await fs.writeFile(tmp, unifiedDiff, 'utf8');
    // Try using `git apply --check` then `git apply`
    await exec('git', ['apply', '--check', tmp], { cwd });
    await exec('git', ['apply', tmp], { cwd });
    await fs.unlink(tmp).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

function exec(cmd: string, args: string[], opts: { cwd: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd: opts.cwd }, (err) => (err ? reject(err) : resolve()));
  });
}
