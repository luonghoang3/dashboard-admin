'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../../dashboard/services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra xác thực khi ứng dụng khởi chạy
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra xác thực bằng token
        const token = authService.getToken();
        
        if (token) {
          console.log('Token được tìm thấy, đang lấy thông tin người dùng...');
          try {
            // Lấy thông tin user từ API
            const userData = await authService.getProfile();
            setUser(userData);
            console.log('Lấy thông tin người dùng thành công:', userData);
          } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            // Xóa token nếu không hợp lệ hoặc hết hạn
            authService.logout();
            setUser(null);
          }
        } else {
          console.log('Không tìm thấy token, người dùng chưa đăng nhập');
          setUser(null);
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra xác thực:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Đăng nhập
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await authService.login({ username, password });
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const register = async (email: string, password: string, username: string, fullName: string): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await authService.register({ email, password, username, fullName });
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 