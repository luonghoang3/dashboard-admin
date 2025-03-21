// URL đúng cho API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
}

export const authService = {
  /**
   * Authenticate user and get token
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    console.log('Gọi API login tại:', `${API_URL}/auth/login`);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Để đảm bảo cookies được gửi trong cross-origin request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login API error:', response.status, errorText);
        throw new Error(`Đăng nhập thất bại: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login API success, got token');
      
      // Lưu token ngay sau khi nhận được
      this.setToken(data.accessToken);
      
      return data;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(token: string) {
    console.log('Fetching user profile with token');
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include' // Để đảm bảo cookies được gửi trong cross-origin request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile API error:', response.status, errorText);
        throw new Error('Lấy thông tin người dùng thất bại');
      }

      const data = await response.json();
      console.log('Profile fetched successfully');
      return data;
    } catch (error) {
      console.error('Profile request failed:', error);
      throw error;
    }
  },

  /**
   * Set token in cookies
   */
  setToken(token: string) {
    console.log('Saving token to localStorage and cookies');
    
    // Lưu vào localStorage
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.error('Cannot save token to localStorage:', e);
    }
    
    // Lưu vào cookie với 7 ngày hết hạn
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      console.log('Token saved successfully');
    } catch (e) {
      console.error('Cannot save token to cookie:', e);
    }
  },

  /**
   * Remove token from cookies
   */
  removeToken() {
    console.log('Removing token from localStorage and cookies');
    
    // Xóa khỏi localStorage
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.error('Cannot remove token from localStorage:', e);
    }
    
    // Xóa khỏi cookies
    try {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      console.log('Token removed successfully');
    } catch (e) {
      console.error('Cannot remove token from cookie:', e);
    }
  },

  /**
   * Get token from cookies or localStorage
   */
  getToken(): string | null {
    // Trước tiên log ra tất cả cookies để debug
    console.log('All cookies:', document.cookie);
    
    // Thử lấy từ localStorage trước
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Token found in localStorage');
        return token;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    // Thử lấy từ cookies
    try {
      const cookieMatch = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
      if (cookieMatch) {
        console.log('Token found in cookie');
        return cookieMatch[1];
      }
    } catch (e) {
      console.error('Error reading cookie:', e);
    }
    
    console.log('No token found in cookie or localStorage');
    return null;
  },
}; 