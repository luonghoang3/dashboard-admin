'use client';

import { useState, useEffect } from 'react';
import { User, Team } from '@/modules/dashboard/services/userService';
import { userService } from '@/modules/dashboard/services/userService';
import { teamService } from '@/modules/dashboard/services/teamService';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    isActive: true,
    password: ''
  });
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load data
  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      // Xóa thông báo lỗi nếu có
      if (message.type === 'error' && message.text.includes('tải danh sách')) {
        setMessage({ text: '', type: '' });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      setMessage({ 
        text: 'Không thể tải danh sách người dùng. Bấm vào đây để thử lại.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhóm:', error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      fullName: '',
      role: 'user',
      isActive: true,
      password: ''
    });
    setSelectedTeams([]);
    setIsEditing(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role || 'user',
      isActive: user.isActive
    });
    setSelectedTeams(user.teams?.map(team => team.id) || []);
    setIsEditing(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      return;
    }
    
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setMessage({ text: 'Xóa người dùng thành công', type: 'success' });
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      setMessage({ text: 'Không thể xóa người dùng', type: 'error' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' }); // Clear previous messages
    
    try {
      // Prepare form data
      const userDataToSend = { ...formData };
      
      if (selectedUser) {
        // Update existing user
        const updatedUser = await userService.updateUser(selectedUser.id, userDataToSend);
        
        // Handle team assignments
        const currentTeamIds = selectedUser.teams?.map(team => team.id) || [];
        
        // Track if all team operations succeed
        let teamAssignmentSuccess = true;
        let teamChanges = false;
        let hasUpdatedTeams = false;
        let updatedUserWithTeams = updatedUser;
        
        // Có sự thay đổi về team
        if (JSON.stringify(currentTeamIds.sort()) !== JSON.stringify([...selectedTeams].sort())) {
          teamChanges = true;
          
          // Add user to new teams - chỉ gán những team mới
          const teamsToAdd = selectedTeams.filter(teamId => !currentTeamIds.includes(teamId));
          for (const teamId of teamsToAdd) {
            try {
              await userService.assignUserToTeam(selectedUser.id, teamId);
              hasUpdatedTeams = true;
            } catch (error: any) {
              // Only consider it an actual error if it's not a 409 conflict
              if (!error.message?.includes('409')) {
                console.error(`Lỗi khi gán người dùng vào team ${teamId}:`, error);
                teamAssignmentSuccess = false;
              }
            }
          }
          
          // Remove user from teams not selected - chỉ xóa khỏi những team cũ
          const teamsToRemove = currentTeamIds.filter(teamId => !selectedTeams.includes(teamId));
          for (const teamId of teamsToRemove) {
            try {
              await userService.removeUserFromTeam(selectedUser.id, teamId);
              hasUpdatedTeams = true;
            } catch (error) {
              console.error(`Lỗi khi xóa người dùng khỏi team ${teamId}:`, error);
              teamAssignmentSuccess = false;
            }
          }
        }
        
        // Nếu đã cập nhật teams, lấy thông tin user với teams mới
        if (hasUpdatedTeams) {
          try {
            // Đợi một chút để đảm bảo server đã cập nhật thông tin
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const userWithTeams = await userService.getUserWithTeams(selectedUser.id);
            updatedUserWithTeams = userWithTeams;
          } catch (error) {
            console.warn('Không thể lấy thông tin teams mới:', error);
          }
        }
        
        // Nếu user có teams từ trước và không lấy được thông tin mới
        if (selectedUser.teams && !updatedUserWithTeams.teams) {
          updatedUserWithTeams = {
            ...updatedUserWithTeams,
            teams: selectedUser.teams.filter(team => selectedTeams.includes(team.id))
          };
        }
        
        // Cập nhật danh sách users
        setUsers(users.map(user => user.id === updatedUserWithTeams.id ? updatedUserWithTeams : user));
        
        setMessage({ 
          text: `Cập nhật người dùng thành công${!teamAssignmentSuccess ? ', nhưng có lỗi khi cập nhật nhóm' : ''}`, 
          type: 'success' 
        });
      } else {
        // Create new user
        const newUser = await userService.createUser(userDataToSend as User);
        
        // Track if all team operations succeed
        let teamAssignmentSuccess = true;
        let newUserWithTeams = newUser;
        
        // Assign teams to new user
        if (selectedTeams.length > 0) {
          let hasAssignedTeams = false;
          
          for (const teamId of selectedTeams) {
            try {
              await userService.assignUserToTeam(newUser.id, teamId);
              hasAssignedTeams = true;
            } catch (error: any) {
              // Only consider it an actual error if it's not a 409 conflict
              if (!error.message?.includes('409')) {
                console.error(`Lỗi khi gán người dùng vào team ${teamId}:`, error);
                teamAssignmentSuccess = false;
              }
            }
          }
          
          // If teams were assigned, try to get the full user info with teams
          if (hasAssignedTeams) {
            try {
              // Đợi một chút để đảm bảo server đã cập nhật thông tin
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const userWithTeams = await userService.getUserWithTeams(newUser.id);
              newUserWithTeams = userWithTeams;
            } catch (error) {
              console.warn('Không thể lấy thông tin teams mới:', error);
              
              // Nếu không lấy được thông tin teams từ API, tạo thông tin teams tạm thời
              if (selectedTeams.length > 0 && teams.length > 0) {
                const selectedTeamObjects = teams
                  .filter(team => selectedTeams.includes(team.id))
                  .map(team => ({ 
                    id: team.id, 
                    name: team.name,
                    description: team.description,
                    department: team.department,
                    isActive: team.isActive,
                    createdAt: team.createdAt,
                    updatedAt: team.updatedAt
                  } as Team));
                
                newUserWithTeams = {
                  ...newUser,
                  teams: selectedTeamObjects
                };
              }
            }
          }
        }
        
        // Cập nhật danh sách users
        setUsers(prev => [...prev.filter(u => u.id !== newUser.id), newUserWithTeams]);
        
        setMessage({ 
          text: `Thêm người dùng mới thành công${!teamAssignmentSuccess ? ', nhưng có lỗi khi gán nhóm' : ''}`, 
          type: 'success' 
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin người dùng:', error);
      setMessage({ text: 'Không thể lưu thông tin người dùng', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        {!isEditing && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleAddUser}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Thêm người dùng
          </button>
        )}
      </div>
      
      {message.text && (
        <div 
          className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} ${message.type === 'error' ? 'cursor-pointer' : ''}`}
          onClick={() => message.type === 'error' && message.text.includes('tải danh sách') ? fetchUsers() : null}
        >
          {message.text}
        </div>
      )}
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">{selectedUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Họ tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {!selectedUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    required={!selectedUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                  Kích hoạt tài khoản
                </label>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium mb-1">Phân nhóm</label>
                <div className="border border-gray-300 rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {teams.length === 0 ? (
                    <p className="text-sm text-gray-500">Không có nhóm nào</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {teams.map(team => (
                        <div
                          key={team.id}
                          onClick={() => handleTeamToggle(team.id)}
                          className={`px-3 py-1 rounded-full text-sm cursor-pointer m-1 ${
                            selectedTeams.includes(team.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {team.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {selectedUser ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có dữ liệu người dùng
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || `/images/avatars/default.png`}
                            alt={user.fullName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {user.teams && user.teams.length > 0 ? (
                          user.teams.map(team => (
                            <span key={team.id} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                              {team.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">Chưa gán nhóm</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}