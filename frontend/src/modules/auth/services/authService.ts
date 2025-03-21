const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Đăng nhập thất bại');
    }

    return response.json();
  },

  /**
   * Get current user profile
   */
  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Lấy thông tin người dùng thất bại');
    }

    return response.json();
  },

  /**
   * Set token in cookies
   */
  setToken(token: string) {
    // For client-side usage
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    // Also store in localStorage as backup
    localStorage.setItem('token', token);
  },

  /**
   * Remove token from cookies
   */
  removeToken() {
    // Clear from cookies
    document.cookie = 'token=; path=/; max-age=0';
    
    // Also clear from localStorage
    localStorage.removeItem('token');
  },

  /**
   * Get token from cookies or localStorage
   */
  getToken(): string | null {
    // Try to get from cookies first
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) return match[2];
    
    // Fallback to localStorage
    return localStorage.getItem('token');
  },
}; 