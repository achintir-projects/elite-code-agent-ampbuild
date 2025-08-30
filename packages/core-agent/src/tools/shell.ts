import { execFile } from 'node:child_process';

export function run(
  cmd: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string> }
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    execFile(
      cmd,
      args,
      { cwd: opts?.cwd, env: { ...process.env, ...opts?.env } },
      (err: unknown, stdout: string, stderr: string) => {
        const code = err && typeof (err as any).code === 'number' ? (err as any).code : 0;
        resolve({ code, stdout: stdout || '', stderr: stderr || '' });
      }
    );
  });
}

