import './App.css'
import './components/Auth/Auth.css'
import { useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/Auth'

function App() {
  const { isAuthenticated, isLoading, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Indoor Navigator</h1>
        <button onClick={signOut} className="logout-button">
          ログアウト
        </button>
      </header>
      <main className="app-main">
        <h2>屋内ナビゲーションアプリへようこそ</h2>
        <p>認証が完了しました。ここから屋内ナビゲーション機能を開始できます。</p>
      </main>
    </div>
  )
}

export default App
