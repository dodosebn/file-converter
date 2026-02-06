import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/theme-context.tsx'
import { AuthProvider } from './context/authContext.tsx'
import { FileProvider } from './context/fileContext.tsx'
// import { ThemeProvider } from './context/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider >
      <AuthProvider>
  <FileProvider>
    <App />
    </FileProvider>
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)


