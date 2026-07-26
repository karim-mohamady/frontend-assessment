import { rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const expectedCwd = resolve('C:/Users/hp/Desktop/Frontend Assessment')
if (resolve(process.cwd()) !== expectedCwd) {
  console.error('REFUSED: Run npm run deploy:firebase from C:\\Users\\hp\\Desktop\\Frontend Assessment only.')
  process.exit(1)
}

const env = {
  ...process.env,
  VITE_APP_DEPLOYMENT_ID: 'frontend-assessment-platform',
  FRONTEND_ASSESSMENT_FIREBASE_PROJECT_ID: 'frontend-assessment-react',
  FIREBASE_PROJECT_ID: 'frontend-assessment-react',
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

rmSync(resolve('dist'), { recursive: true, force: true })
run('npm', ['run', 'validate:firebase-deploy'])
run('npm', ['run', 'build'])
run('npm', ['run', 'validate:firebase-deploy', '--', '--require-dist'])
run('firebase', ['deploy', '--only', 'hosting', '--project', 'frontend-assessment-react', '--non-interactive'])
