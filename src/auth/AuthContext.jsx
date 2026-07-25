import { createContext, useContext, useState, useEffect } from 'react';
import { seedDefaultUser, authenticate, getSession, clearSession } from './userStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDefaultUser().then(() => {
      const session = getSession();
      if (session) setUser(session);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const result = await authenticate(email, password);
    if (result) {
      setUser(result);
      return { success: true };
    }
    return { success: false, error: 'Email o contraseña incorrectos' };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
