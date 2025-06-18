import './App.css'
import './components/Auth/Auth.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/Auth'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import MapEditor from './pages/MapEditor'
import MapViewer from './pages/MapViewer'
import Search from './pages/Search'
import AuthPage from './pages/Auth'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app-container">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/auth" element={<AuthModal />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map-editor" element={<MapEditor />} />
              <Route path="/map-viewer" element={<MapViewer />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
      </div>
    </Router>
  )
}

export default App
