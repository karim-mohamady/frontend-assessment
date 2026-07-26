# Firebase Incident Response

FIREBASE DEPLOYMENTS FROZEN DURING INCIDENT RESPONSE.

The Frontend Assessment Platform may deploy only to Firebase Hosting project `frontend-assessment-react`. NexaERP owns `nexaerp-karim-20260726`.

## Evidence

- This repository had no tracked GitHub Actions deployment workflow during the audit.
- Recent Firebase live channel metadata identified CLI deployments by the logged-in Firebase account.
- Rendered live verification showed the Frontend Assessment UI on `https://frontend-assessment-react.web.app/` and no NexaERP content.

## Safeguards

- Deployment identity is tracked in `deployment-identity.json`.
- `firebase.json` pins Hosting site `frontend-assessment-react`.
- Build output includes `dist/deployment-meta.json`.
- Builds must contain fingerprint `frontend-assessment-platform`.
- Builds must not contain `nexaerp-platform` or NexaERP identifiers.
- Deployment validation refuses `nexaerp-karim-20260726`.
- Service-account JSON is parsed when present and must have `project_id: frontend-assessment-react`.
- Local deployment must use `npm run deploy:firebase`; raw generic `firebase deploy` is forbidden.
- GitHub deployment is manual-only during incident response.

## Re-Enabling Automation

Keep live Firebase deployment manual until the user explicitly re-enables automation. If automatic live deploy is reintroduced, require branch protection, environment approval, `FIREBASE_SERVICE_ACCOUNT_FRONTEND_ASSESSMENT`, identity manifest validation, build fingerprint validation, and explicit `--project frontend-assessment-react`.
