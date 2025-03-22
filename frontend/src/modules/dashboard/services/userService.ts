import { authService } from '../../auth/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
  password?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}

export const userService = {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      // Sử dụng endpoint thông thường
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy danh sách người dùng: ${response.status}`);
      }

      // Lấy danh sách users thông thường
      const users = await response.json();
      
      // Thêm thông tin teams nếu cần (cho những user đang được hiển thị trong table)
      // Tối đa 10 user để tránh quá nhiều request
      const maxUsersToFetch = Math.min(users.length, 10);
      const usersToFetch = users.slice(0, maxUsersToFetch);
      
      try {
        // Chạy song song các request lấy thông tin teams
        const usersWithTeams = await Promise.all(
          usersToFetch.map(async (user: User) => {
            try {
              return await this.getUserWithTeams(user.id);
            } catch (error) {
              console.warn(`Không thể lấy thông tin teams cho user ${user.id}:`, error);
              return user;
            }
          })
        );
        
        // Cập nhật lại những user đã lấy được teams
        return users.map((user: User) => {
          const userWithTeams = usersWithTeams.find(u => u.id === user.id);
          return userWithTeams || user;
        });
      } catch (error) {
        console.warn('Không thể lấy thông tin teams cho users:', error);
        return users;
      }
    } catch (error) {
      console.error('Lỗi khi gọi API users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin người dùng: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API user/${id}:`, error);
      throw error;
    }
  },

  /**
   * Get user with teams
   */
  async getUserWithTeams(id: string): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      // Try to get user with teams
      try {
        const response = await fetch(`${API_URL}/users/${id}/with-teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`Không thể lấy user ${id} với teams qua endpoint /users/${id}/with-teams, sẽ thử cách khác:`, error);
      }

      // Fallback: Get basic user info
      const userResponse = await fetch(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Lỗi khi lấy thông tin người dùng: ${userResponse.status}`);
      }

      const user = await userResponse.json();

      // Try to get teams for user
      try {
        const teamsResponse = await fetch(`${API_URL}/users/${id}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (teamsResponse.ok) {
          const teams = await teamsResponse.json();
          return { ...user, teams };
        }
      } catch (error) {
        console.warn(`Không thể lấy teams cho user ${id}:`, error);
      }

      // Return user without teams if we couldn't get them
      return user;
    } catch (error) {
      console.error(`Lỗi khi gọi API user/${id}/with-teams:`, error);
      throw error;
    }
  },

  /**
   * Create new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi tạo người dùng mới: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi gọi API tạo user:', error);
      throw error;
    }
  },

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi cập nhật người dùng: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API cập nhật user/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi xóa người dùng: ${response.status}`);
      }
    } catch (error) {
      console.error(`Lỗi khi gọi API xóa user/${id}:`, error);
      throw error;
    }
  },

  /**
   * Assign user to team
   */
  async assignUserToTeam(userId: string, teamId: string): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      // First check if user is already in this team
      try {
        const user = await this.getUserWithTeams(userId);
        const isAlreadyInTeam = user.teams?.some(team => team.id === teamId);
        
        // If already in team, return the user without making the API call
        if (isAlreadyInTeam) {
          return user;
        }
      } catch (err) {
        // If we can't check teams, proceed with assignment anyway
        console.warn('Không thể kiểm tra team hiện tại của user:', err);
      }
      
      // Proceed with team assignment
      const response = await fetch(`${API_URL}/users/${userId}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        const error = new Error(`Lỗi khi gán người dùng vào team: ${response.status}`);
        if (response.status === 409) {
          // User is already in team - this is fine, just return current user
          return this.getUserWithTeams(userId);
        }
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      if (!error.message?.includes('409')) {
        console.error(`Lỗi khi gọi API gán user/${userId} vào team:`, error);
      }
      throw error;
    }
  },

  /**
   * Remove user from team
   */
  async removeUserFromTeam(userId: string, teamId: string): Promise<User> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      // First check if user is actually in this team
      try {
        const user = await this.getUserWithTeams(userId);
        const isInTeam = user.teams?.some(team => team.id === teamId);
        
        // If not in team, return the user without making the API call
        if (!isInTeam) {
          return user;
        }
      } catch (err) {
        // If we can't check teams, proceed with removal anyway
        console.warn('Không thể kiểm tra team hiện tại của user:', err);
      }
      
      // Proceed with team removal
      const response = await fetch(`${API_URL}/users/${userId}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = new Error(`Lỗi khi xóa người dùng khỏi team: ${response.status}`);
        if (response.status === 404) {
          // User is not in team - this is fine, just return current user
          return this.getUserWithTeams(userId);
        }
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      if (!error.message?.includes('404')) {
        console.error(`Lỗi khi gọi API xóa user/${userId} khỏi team/${teamId}:`, error);
      }
      throw error;
    }
  },
}; 