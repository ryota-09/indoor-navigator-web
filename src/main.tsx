import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
