import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Math from './pages/Math'
import German from './pages/German'
import English from './pages/English'
import Physics from './pages/Physics'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import AuthCallback from './pages/AuthCallback'

// ---------------------------------------------------------------------------
// Public shell — Navbar always visible, no auth redirect
// ---------------------------------------------------------------------------
function PublicShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Protected shell — redirects to /login if not authenticated
// ---------------------------------------------------------------------------
function ProtectedShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <VercelAnalytics />
        <Routes>
          {/* Public auth pages — no shell */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Auth callback — no shell, no auth required */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public landing — navbar but no redirect */}
          <Route element={<PublicShell />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Protected: all subject + account pages */}
          <Route element={<ProtectedShell />}>
            <Route path="/math" element={<Math />} />
            <Route path="/deutsch" element={<German />} />
            <Route path="/englisch" element={<English />} />
            <Route path="/physik" element={<Physics />} />
            <Route path="/geschichte" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  )
}
