import { Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Math from './pages/Math'
import German from './pages/German'
import English from './pages/English'
import Physics from './pages/Physics'
import History from './pages/History'

export default function App() {
  return (
    <ProgressProvider>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/math" element={<Math />} />
          <Route path="/deutsch" element={<German />} />
          <Route path="/englisch" element={<English />} />
          <Route path="/physik" element={<Physics />} />
          <Route path="/geschichte" element={<History />} />
        </Routes>
      </main>
    </div>
    </ProgressProvider>
  )
}
