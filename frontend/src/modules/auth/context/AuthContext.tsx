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
  avatar?: string;
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

  // Kiểm tra nếu người dùng đã đăng nhập
  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const userData = await authService.getProfile(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      authService.removeToken();
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Gọi API login với username:', username);
      const data = await authService.login(username, password);
      console.log('Kết quả login thành công:', data);
      const { accessToken, user: userData } = data;

      // Lưu token vào cookies và localStorage
      authService.setToken(accessToken);
      
      // Cập nhật state
      setToken(accessToken);
      setUser(userData);

      console.log('Đã lưu token và user, chuẩn bị chuyển hướng...');
      
      // Chuyển hướng đến trang Dashboard sử dụng location thay vì router
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Xóa token
    authService.removeToken();
    
    // Cập nhật state
    setToken(null);
    setUser(null);
    
    // Chuyển hướng đến trang đăng nhập
    router.push('/login');
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

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 