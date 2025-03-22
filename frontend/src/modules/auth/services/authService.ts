import { User } from '../../dashboard/services/userService';
import Cookies from 'js-cookie';

// URL đúng cho API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';
const REDIRECT_STATE_KEY = 'auth_redirect_state';

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;  // Đổi từ token thành accessToken để khớp với API
  user: User;
}

export const authService = {
  /**
   * Lấy token từ cookie
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get(TOKEN_KEY) || null;
    }
    return null;
  },

  /**
   * Lưu token vào cookie
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Đặt cookie với hạn dùng 7 ngày và path "/"
      Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
    }
  },

  /**
   * Xóa token từ cookie
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove(TOKEN_KEY, { path: '/' });
    }
  },

  /**
   * Lấy thông tin user từ localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Lưu thông tin user vào localStorage
   */
  setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Lưu trạng thái redirect
   */
  setRedirectState(path: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REDIRECT_STATE_KEY, path);
    }
  },

  /**
   * Kiểm tra đã redirect đến đường dẫn này chưa
   */
  hasRedirectedTo(path: string): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REDIRECT_STATE_KEY) === path;
    }
    return false;
  },

  /**
   * Xóa trạng thái redirect
   */
  clearRedirectState(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REDIRECT_STATE_KEY);
    }
  },

  /**
   * Kiểm tra user đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Đăng nhập
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();
      
      // Lưu thông tin đăng nhập
      this.setToken(data.accessToken);  // Đổi từ token thành accessToken
      this.setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  },

  /**
   * Đăng ký
   */
  async register(userData: RegisterDTO): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      const data = await response.json();
      
      // Lưu thông tin đăng nhập sau khi đăng ký thành công
      this.setToken(data.accessToken);  // Đổi từ token thành accessToken
      this.setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  },

  /**
   * Đăng xuất
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      this.removeToken();
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Lấy thông tin profile của user hiện tại
   */
  async getProfile(token?: string): Promise<User> {
    const authToken = token || this.getToken();
    if (!authToken) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin profile');
      }

      const user = await response.json();
      
      // Cập nhật thông tin user trong localStorage
      this.setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Lỗi khi lấy profile:', error);
      throw error;
    }
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      throw error;
    }
  },
}; 