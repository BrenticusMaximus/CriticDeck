// Regenerates src/build-info.json with the current UTC build timestamp, so the
// "Current build" line in Settings reflects the actual build, not a stale
// value that was last hand-edited and then forgotten.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pad = (value) => value.toString().padStart(2, '0')

const now = new Date()
const timestamp =
  `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}` +
  `-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}-UTC`

const outPath = fileURLToPath(new URL('../src/build-info.json', import.meta.url))
writeFileSync(outPath, JSON.stringify({ timestamp }, null, 2) + '\n')
