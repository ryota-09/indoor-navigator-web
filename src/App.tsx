import React from 'react'
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
  const { isAuthenticated, isLoading, enableDevMode } = useAuth()

  // URLパラメータで開発モードを自動有効化
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
      enableDevMode();
    }
  }, [enableDevMode]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    )
  }

  // 開発環境でのデバッグ用ショートカット
  const isDev = import.meta.env.DEV;

  return (
    <Router>
      <div className="app-container">
        {/* 開発モード用のバイパス */}
        {isDev && (
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, background: '#ff9800', padding: '5px 10px', borderRadius: '4px' }}>
            <button 
              onClick={() => {
                enableDevMode();
                window.location.reload();
              }}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}
            >
              🚀 Dev Mode
            </button>
          </div>
        )}
        
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
