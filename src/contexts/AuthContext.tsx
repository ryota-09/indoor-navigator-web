import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  enableDevMode: () => void;
}

// 開発モード用のフラグ
const DEV_MODE_KEY = 'indoor-navigator-dev-mode';
const getDevMode = () => {
  try {
    return localStorage.getItem(DEV_MODE_KEY) === 'true';
  } catch {
    return false;
  }
};
const setDevMode = (enabled: boolean) => {
  try {
    localStorage.setItem(DEV_MODE_KEY, enabled.toString());
  } catch {
    console.warn('Could not access localStorage');
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [devMode, setDevModeState] = useState(getDevMode());
  
  // Convex認証は開発モードでない場合のみ使用
  let convexAuthenticated = false;
  let isLoading = false;
  let authSignIn: any = null;
  let authSignOut: any = null;
  
  try {
    const convexAuth = useConvexAuth();
    const authActions = useAuthActions();
    convexAuthenticated = convexAuth.isAuthenticated;
    isLoading = convexAuth.isLoading;
    authSignIn = authActions.signIn;
    authSignOut = authActions.signOut;
  } catch (error) {
    console.warn('Convex Auth error:', error);
    // Convex認証でエラーが発生した場合は開発モードにフォールバック
    if (import.meta.env.DEV) {
      setDevModeState(true);
      setDevMode(true);
    }
  }
  
  // ローカルストレージの変更を監視
  useEffect(() => {
    const handleStorageChange = () => {
      setDevModeState(getDevMode());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // 開発モードまたはConvex認証の状態を使用
  const isAuthenticated = devMode || convexAuthenticated;

  const signIn = async (email: string, password: string) => {
    if (devMode) {
      console.log('Development mode: Sign in bypassed');
      return;
    }
    
    if (!authSignIn) {
      throw new Error('Authentication not available');
    }
    
    try {
      console.log('Attempting sign in with:', { email, provider: 'password' });
      await authSignIn("password", { email, password, flow: "signIn" });
      console.log('Sign in successful');
    } catch (error) {
      console.error('Sign in error details:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (devMode) {
      console.log('Development mode: Sign up bypassed');
      return;
    }
    
    if (!authSignIn) {
      throw new Error('Authentication not available');
    }
    
    try {
      const params: Record<string, string> = { email, password, flow: "signUp" };
      if (name) {
        params.name = name;
      }
      console.log('Attempting sign up with:', { email, name, provider: 'password' });
      await authSignIn("password", params);
      console.log('Sign up successful');
    } catch (error) {
      console.error('Sign up error details:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // 開発モードの場合はローカルストレージをクリア
      if (devMode) {
        setDevMode(false);
        setDevModeState(false);
        window.location.reload();
      } else if (authSignOut) {
        await authSignOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const enableDevMode = () => {
    setDevMode(true);
    setDevModeState(true);
    console.log('Development mode enabled - authentication bypassed');
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user: null, // TODO: ユーザー情報の取得を後で追加
    signIn,
    signUp,
    signOut,
    enableDevMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};