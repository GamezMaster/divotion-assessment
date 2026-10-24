import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Application entry point. Mounts the React tree into the #root element from
// index.html and wraps it in StrictMode, which surfaces potential problems
// (deprecated APIs, impure renders) during development without affecting
// production behaviour. The non-null assertion is safe because index.html
// always ships the #root element.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
