import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {APP_DEPLOYMENT_ID} from './deploymentIdentity';

document.documentElement.dataset.deploymentId = APP_DEPLOYMENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
