import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './specimen/specimen.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Signal the slow-load fallback (index.html) that the app booted, so it hides
// the lightweight #lite version and shows the full app.
declare global { interface Window { __appReady?: boolean } }
window.__appReady = true
document.documentElement.classList.remove('slow')
setTimeout(() => document.getElementById('lite')?.remove(), 600)
