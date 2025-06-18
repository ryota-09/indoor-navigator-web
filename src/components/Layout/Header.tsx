import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Indoor Navigator' }) => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link to="/">{title}</Link>
        </h1>
        <nav className="navigation">
          <Link to="/">ホーム</Link>
          <Link to="/map-viewer">マップ閲覧</Link>
          <Link to="/map-editor">マップ作成</Link>
          <Link to="/search">検索</Link>
          {isAuthenticated ? (
            <button onClick={signOut} className="logout-button">
              ログアウト
            </button>
          ) : (
            <Link to="/auth">ログイン</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;