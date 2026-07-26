import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const identity = JSON.parse(readFileSync(resolve('deployment-identity.json'), 'utf8'))

let commitSha = 'unknown'
try {
  commitSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
} catch {
  commitSha = process.env.GITHUB_SHA || 'unknown'
}

const meta = {
  application: identity.application,
  repository: identity.repository,
  commitSha,
  buildTimestamp: new Date().toISOString(),
  firebaseProjectId: identity.firebaseProjectId,
  hostingSite: identity.hostingSite,
  deploymentFingerprint: identity.deploymentFingerprint,
}

mkdirSync(resolve('dist'), { recursive: true })
writeFileSync(resolve('dist', 'deployment-meta.json'), `${JSON.stringify(meta, null, 2)}\n`)
