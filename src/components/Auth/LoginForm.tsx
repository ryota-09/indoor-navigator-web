import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, enableDevMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      console.error('Login failed:', err);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevMode = () => {
    console.log('Dev mode button clicked');
    enableDevMode();
    // ページをリロードして状態を確実に更新
    window.location.reload();
  };

  return (
    <div className="auth-form">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      <p>
        アカウントをお持ちでない方は{' '}
        <button type="button" onClick={onToggleMode} className="link-button">
          新規登録
        </button>
      </p>
      {import.meta.env.DEV && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#fffacd', border: '1px solid #ddd', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
            開発モード: 認証をスキップしてアプリケーションをテストできます
          </p>
          <button 
            type="button" 
            onClick={handleDevMode}
            style={{ 
              padding: '5px 10px', 
              fontSize: '12px', 
              background: '#ff9800', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            開発モードで続行
          </button>
        </div>
      )}
    </div>
  );
};