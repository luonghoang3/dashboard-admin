import { authService } from '../../auth/services/authService';
import { User, Team } from './userService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CreateTeamDTO {
  name: string;
  description?: string;
  department?: string;
  isActive?: boolean;
}

export const teamService = {
  /**
   * Get all teams
   */
  async getAllTeams(): Promise<Team[]> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy danh sách teams: ${response.status}`);
      }

      const data = await response.json();
      return data.data || []; // API trả về { success: true, data: [...] }
    } catch (error) {
      console.error('Lỗi khi gọi API teams:', error);
      throw error;
    }
  },

  /**
   * Get team by ID
   */
  async getTeamById(id: string): Promise<Team> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin team: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API team/${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new team
   */
  async createTeam(teamData: CreateTeamDTO): Promise<Team> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi tạo team mới: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi gọi API tạo team:', error);
      throw error;
    }
  },

  /**
   * Update team
   */
  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi cập nhật team: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API cập nhật team/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete team
   */
  async deleteTeam(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi xóa team: ${response.status}`);
      }
    } catch (error) {
      console.error(`Lỗi khi gọi API xóa team/${id}:`, error);
      throw error;
    }
  },

  /**
   * Get users in team
   */
  async getUsersInTeam(id: string): Promise<User[]> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy danh sách người dùng trong team: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API team/${id}/users:`, error);
      throw error;
    }
  },

  /**
   * Add user to team
   */
  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${teamId}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi thêm người dùng vào team: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API thêm user vào team/${teamId}:`, error);
      throw error;
    }
  },

  /**
   * Remove user from team
   */
  async removeUserFromTeam(teamId: string, userId: string): Promise<Team> {
    const token = authService.getToken();
    if (!token) throw new Error('Không có token xác thực');

    try {
      const response = await fetch(`${API_URL}/teams/${teamId}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi xóa người dùng khỏi team: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi gọi API xóa user khỏi team/${teamId}:`, error);
      throw error;
    }
  },
}; 