import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/theme-context.tsx'
// import { ThemeProvider } from './context/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider >
    <App />
    </ThemeProvider>
  </StrictMode>,
)


