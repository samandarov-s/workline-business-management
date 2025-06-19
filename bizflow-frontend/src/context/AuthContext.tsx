import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (name: string, role: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isEmployee: () => boolean;
  isAccountant: () => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = localStorage.getItem('workline_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('workline_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (name: string, role: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Create user object with the provided name and role
      const userObj: User = {
        id: Date.now(), // Simple ID generation
        name: name.trim(),
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@workline.com`, // Generate email from name
        role: role,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      setUser(userObj);
      localStorage.setItem('workline_user', JSON.stringify(userObj));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workline_user');
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isManager = (): boolean => {
    return user?.role === 'manager';
  };

  const isEmployee = (): boolean => {
    return user?.role === 'employee';
  };

  const isAccountant = (): boolean => {
    return user?.role === 'accountant';
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    isEmployee,
    isAccountant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 