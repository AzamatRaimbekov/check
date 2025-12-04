import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESTORE_AUTH'; payload: { user: User; token: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'RESTORE_AUTH':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore auth state from localStorage on app start
  useEffect(() => {
    const restoreAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          dispatch({ type: 'RESTORE_AUTH', payload: { user, token } });
        } else {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    restoreAuth();
  }, []);

  const login = async (email: string, _password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Иван',
        lastName: 'Петров',
        role: 'curator',
        phone: '+996 555 123 456',
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Save to localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: mockUser, token: mockToken } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
