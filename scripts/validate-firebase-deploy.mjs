import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const identityPath = resolve('deployment-identity.json')
if (!existsSync(identityPath)) {
  console.error('REFUSED: Missing Frontend Assessment deployment identity manifest.')
  process.exit(1)
}

const identity = JSON.parse(readFileSync(identityPath, 'utf8'))
const requireDist = process.argv.includes('--require-dist')
const expectedProject = process.env.FRONTEND_ASSESSMENT_FIREBASE_PROJECT_ID?.trim() || identity.firebaseProjectId
const selectedProject = (
  process.env.FIREBASE_PROJECT_ID ||
  process.env.FRONTEND_ASSESSMENT_FIREBASE_PROJECT_ID ||
  process.env.GCLOUD_PROJECT ||
  process.env.GCP_PROJECT ||
  process.env.PROJECT_ID ||
  ''
).trim()
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_FRONTEND_ASSESSMENT?.trim() ?? ''

if (!existsSync(resolve('package.json')) || !existsSync(resolve('index.html'))) {
  console.error('REFUSED: Frontend Assessment deployment validation must run from C:\\Users\\hp\\Desktop\\Frontend Assessment.')
  process.exit(1)
}

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))
const indexHtml = readFileSync(resolve('index.html'), 'utf8')

if (packageJson.name !== 'frontend-assessment-platform' || !indexHtml.includes('<title>Frontend Assessment Platform</title>')) {
  console.error('REFUSED: Current repository does not identify as the Frontend Assessment Platform.')
  process.exit(1)
}

if (!selectedProject) {
  console.error('REFUSED: FIREBASE_PROJECT_ID or FRONTEND_ASSESSMENT_FIREBASE_PROJECT_ID must be set before deploying Frontend Assessment.')
  process.exit(1)
}

if (identity.forbiddenProjectIds.includes(selectedProject)) {
  console.error('REFUSED: NexaERP Firebase project cannot receive Frontend Assessment deployments.')
  process.exit(1)
}

if (selectedProject !== expectedProject || selectedProject !== identity.firebaseProjectId) {
  console.error(`REFUSED: Firebase project "${selectedProject}" does not match Frontend Assessment project "${identity.firebaseProjectId}".`)
  process.exit(1)
}

if (serviceAccountJson) {
  let serviceAccount
  try {
    serviceAccount = JSON.parse(serviceAccountJson)
  } catch {
    console.error('REFUSED: FIREBASE_SERVICE_ACCOUNT_FRONTEND_ASSESSMENT is not valid JSON.')
    process.exit(1)
  }

  if (serviceAccount.project_id !== identity.firebaseProjectId) {
    console.error('DEPLOYMENT REFUSED — SERVICE ACCOUNT BELONGS TO A DIFFERENT FIREBASE PROJECT')
    process.exit(1)
  }
}

if (requireDist) {
  const distIndexPath = resolve('dist', 'index.html')
  const distMetaPath = resolve('dist', 'deployment-meta.json')
  if (!existsSync(distIndexPath) || !existsSync(distMetaPath)) {
    console.error('REFUSED: Build output is incomplete. Run npm run build before deployment.')
    process.exit(1)
  }

  const distIndex = readFileSync(distIndexPath, 'utf8')
  const distMeta = JSON.parse(readFileSync(distMetaPath, 'utf8'))
  const assetNames = [...distIndex.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]).filter((asset) => asset.startsWith('/assets/'))
  const payload = [
    distIndex,
    JSON.stringify(distMeta),
    ...assetNames.map((asset) => {
      const assetPath = resolve('dist', asset.replace(/^\//, ''))
      return existsSync(assetPath) ? readFileSync(assetPath, 'utf8') : ''
    }),
  ].join('\n')

  if (!payload.includes('Frontend Assessment Platform')) {
    console.error('REFUSED: Build output does not identify as Frontend Assessment Platform.')
    process.exit(1)
  }

  if (!payload.includes(identity.deploymentFingerprint) || distMeta.deploymentFingerprint !== identity.deploymentFingerprint) {
    console.error('REFUSED: Build output does not contain the Frontend Assessment deployment fingerprint.')
    process.exit(1)
  }

  if (distMeta.firebaseProjectId !== identity.firebaseProjectId || distMeta.repository !== identity.repository) {
    console.error('REFUSED: Build metadata does not match the Frontend Assessment deployment identity manifest.')
    process.exit(1)
  }

  if (/NexaERP|nexaerp-platform|nexaerp-karim-20260726/i.test(payload)) {
    console.error('REFUSED: Build output contains NexaERP identifiers.')
    process.exit(1)
  }

  if (/-----BEGIN |PRIVATE KEY|FIREBASE_SERVICE_ACCOUNT|SERVICE_ACCOUNT_JSON|API_SECRET=|CLIENT_SECRET=/i.test(payload)) {
    console.error('REFUSED: Build output appears to contain secret-like material.')
    process.exit(1)
  }
}

console.log('Frontend Assessment Firebase deployment validation passed.')
