#!/usr/bin/env node
import { argv, exit } from 'node:process'

function help() {
  console.log(`Elite Windows Packager\n\nUsage:\n  elite-pack <path-to-web-app> --target=msi|msix|exe --wrapper=tauri|electron\n`)
}

async function main() {
  const pairs = argv.slice(2).map((s) => s.split('=') as [string, string?])
  const args = Object.fromEntries(pairs) as Record<string, string | undefined>
  if (!args['--target']) return help()
  console.log('Packager stub: would package', args)
}

main().catch((e) => {
  console.error(e)
  exit(1)
})
