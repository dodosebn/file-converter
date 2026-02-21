import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/theme-context.tsx'
import { AuthProvider } from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileProvider } from './context/fileContext.tsx'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
    <ThemeProvider >
      <AuthProvider>
  <FileProvider>
    <QueryClientProvider client={queryClient}>

    <App />
    </QueryClientProvider>
    </FileProvider>
    </AuthProvider>
    </ThemeProvider>
)


