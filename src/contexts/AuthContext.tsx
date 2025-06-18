import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useConvexAuth } from 'convex/react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

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
  const { isAuthenticated, isLoading } = useConvexAuth();
  const signInAction = useAction(api.auth.signIn);
  const signOutAction = useAction(api.auth.signOut);

  const signIn = async (email: string, password: string) => {
    try {
      await signInAction({
        provider: "password",
        params: { email, password, flow: "signIn" },
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      await signInAction({
        provider: "password",
        params: { email, password, flow: "signUp", name },
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user: null, // TODO: ユーザー情報の取得を後で追加
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};