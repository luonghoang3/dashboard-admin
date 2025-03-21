'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra trạng thái xác thực khi khởi tạo
  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    const checkAuthentication = async () => {
      try {
        // Lấy token từ localStorage hoặc cookie
        const storedToken = authService.getToken();
        
        if (!storedToken) {
          console.log('No token found, user not authenticated');
          setIsLoading(false);
          return;
        }
        
        console.log('Token found, setting token state');
        setToken(storedToken);
        
        // Lấy thông tin user profile
        try {
          console.log('Fetching user profile with token');
          const userData = await authService.getProfile(storedToken);
          console.log('User profile fetched successfully');
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Nếu token không hợp lệ, xóa token
          authService.removeToken();
          setToken(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
        console.log('AuthProvider initialization complete');
      }
    };

    checkAuthentication();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log('Login process started in AuthContext');
    
    try {
      const data = await authService.login(username, password);
      console.log('Login API call succeeded, got data:', data?.user?.username);
      
      // Lưu token - đã được lưu trong authService.login
      setToken(data.accessToken);
      
      // Cập nhật thông tin user
      setUser(data.user);
      
      console.log('Login process completed successfully');
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    // Xóa token
    authService.removeToken();
    
    // Cập nhật state
    setToken(null);
    setUser(null);
    
    console.log('User logged out, redirecting to login page');
    
    // Chuyển hướng đến trang đăng nhập - sử dụng window.location để refresh
    window.location.href = '/login';
  };

  const checkAuth = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      await authService.getProfile(token);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Debug output
  console.log('AuthContext state:', {
    isAuthenticated: !!token && !!user,
    hasToken: !!token,
    hasUser: !!user,
    isLoading
  });

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 