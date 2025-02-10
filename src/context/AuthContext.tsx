import React, { createContext, useContext, useState, ReactNode } from 'react';
import md5 from 'md5';

interface AuthState {
  updateHash: () => void;
  hash: string | null;
  error: string | null;
  ts: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hash, setHash] = useState(() => '');
  const [error, setError] = useState<string | null>(null);
  const [ts, setTs] = useState(() => new Date().getTime() + '');

  const updateHash = () => {
    try {
      const privateKey = import.meta.env.VITE_PRIVATE_KEY;
      const publicKey = import.meta.env.VITE_PUBLIC_KEY;

      if (!privateKey || !publicKey) {
        throw new Error('Missing environment variables');
      }

      const ts = Math.floor(Math.random() * 10) + '';
      const hash = md5(ts + privateKey + publicKey);
      setHash(hash);
      setTs(ts);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthContext.Provider value={{ hash, ts, error, updateHash }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
