import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = resolve(here, '../../../..')

export async function scaffold(goal: string, cwd: string): Promise<string | null> {
  const lower = goal.toLowerCase()
  if (lower.includes('rust cli')) {
    const dest = join(cwd, 'artifacts', 'rust-cli')
    await copyTree(resolve(repoRoot, 'templates/cli/rust'), dest)
    return dest
  }
  if (lower.includes('fastapi') || lower.includes('python api')) {
    const dest = join(cwd, 'artifacts', 'fastapi')
    await copyTree(resolve(repoRoot, 'templates/api/fastapi'), dest)
    return dest
  }
  if (lower.includes('uart') && (lower.includes('systemverilog') || lower.includes('verilog'))) {
    const dest = join(cwd, 'artifacts', 'uart_sv')
    await copyTree(resolve(repoRoot, 'rtl/uart_sv'), dest)
    return dest
  }
  return null
}

async function copyTree(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const e of entries) {
    const s = join(src, e.name)
    const d = join(dest, e.name)
    if (e.isDirectory()) await copyTree(s, d)
    else await fs.copyFile(s, d)
  }
}
