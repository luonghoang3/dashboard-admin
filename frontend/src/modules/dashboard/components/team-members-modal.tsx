'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Input
} from '@nextui-org/react';
import { Search, X } from 'lucide-react';
import { teamService } from '../services/teamService';
import { userService } from '../services/userService';
import type { User as UserType } from '../services/userService';
import { LoadingScreen } from '@/components/loading-screen';

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
}

export default function TeamMembersModal({ isOpen, onClose, teamId }: TeamMembersModalProps) {
  const [members, setMembers] = useState<UserType[]>([]);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy danh sách thành viên khi mở modal
  useEffect(() => {
    if (isOpen && teamId) {
      setIsLoading(true);
      setError(null);
      setSearchTerm('');
      
      const fetchMembers = async () => {
        try {
          const users = await teamService.getUsersInTeam(teamId);
          setMembers(users);
          setFilteredMembers(users);
        } catch (error) {
          setError('Không thể tải danh sách thành viên');
          console.error('Error fetching team members:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchMembers();
    }
  }, [isOpen, teamId]);
  
  // Lọc thành viên khi nhập từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMembers(members);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = members.filter(member => 
        member.fullName.toLowerCase().includes(lowercaseSearchTerm) ||
        member.username.toLowerCase().includes(lowercaseSearchTerm) ||
        member.email.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);
  
  // Xử lý tìm kiếm người dùng để thêm vào nhóm
  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Giả định rằng có một API endpoint để tìm kiếm người dùng
      const results = await userService.getAllUsers();
      
      // Lọc kết quả để loại bỏ những người đã là thành viên
      const memberIds = members.map(member => member.id);
      const filteredResults = results.filter(user => 
        !memberIds.includes(user.id) && (
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      setError('Không thể tìm kiếm người dùng');
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Xử lý thêm người dùng vào nhóm
  const handleAddMember = async (userId: string) => {
    try {
      await teamService.addUserToTeam(teamId, userId);
      
      // Tìm người dùng vừa thêm trong kết quả tìm kiếm
      const addedUser = searchResults.find(user => user.id === userId);
      if (addedUser) {
        // Cập nhật danh sách thành viên
        setMembers(prev => [...prev, addedUser]);
        // Xóa khỏi kết quả tìm kiếm
        setSearchResults(prev => prev.filter(user => user.id !== userId));
      }
    } catch (error) {
      setError('Không thể thêm người dùng vào nhóm');
      console.error('Error adding user to team:', error);
    }
  };
  
  // Xử lý xóa người dùng khỏi nhóm
  const handleRemoveMember = async (userId: string) => {
    try {
      await teamService.removeUserFromTeam(teamId, userId);
      
      // Cập nhật danh sách thành viên
      setMembers(prev => prev.filter(member => member.id !== userId));
    } catch (error) {
      setError('Không thể xóa người dùng khỏi nhóm');
      console.error('Error removing user from team:', error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>Danh sách thành viên nhóm</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <LoadingScreen text="Đang tải danh sách thành viên..." />
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="text-danger text-center py-2">{error}</div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tìm kiếm thành viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search size={16} />}
                  className="flex-1"
                />
                <Button 
                  color="primary" 
                  onPress={handleSearch} 
                  isLoading={isSearching}
                  isDisabled={searchTerm.trim().length < 2}
                >
                  Tìm kiếm
                </Button>
              </div>
              
              {/* Kết quả tìm kiếm */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Kết quả tìm kiếm</h3>
                  <Table 
                    aria-label="Kết quả tìm kiếm" 
                    removeWrapper 
                    className="border border-default-200 rounded-md"
                  >
                    <TableHeader>
                      <TableColumn>NGƯỜI DÙNG</TableColumn>
                      <TableColumn>VAI TRÒ</TableColumn>
                      <TableColumn>THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <User
                              name={user.fullName}
                              description={user.email}
                              avatarProps={{
                                src: user.avatar || `/images/avatars/default.png`,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip color={user.role === 'admin' ? 'danger' : 'primary'} variant="flat" size="sm">
                              {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              color="primary" 
                              variant="flat"
                              onPress={() => handleAddMember(user.id)}
                            >
                              Thêm vào nhóm
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Danh sách thành viên */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Thành viên trong nhóm ({filteredMembers.length})</h3>
                {filteredMembers.length === 0 ? (
                  <p className="text-center py-4 text-default-500">
                    {members.length === 0 
                      ? 'Nhóm chưa có thành viên nào' 
                      : 'Không tìm thấy thành viên phù hợp'}
                  </p>
                ) : (
                  <Table 
                    aria-label="Danh sách thành viên" 
                    removeWrapper 
                    className="border border-default-200 rounded-md"
                  >
                    <TableHeader>
                      <TableColumn>NGƯỜI DÙNG</TableColumn>
                      <TableColumn>VAI TRÒ</TableColumn>
                      <TableColumn>TRẠNG THÁI</TableColumn>
                      <TableColumn>THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <User
                              name={member.fullName}
                              description={member.email}
                              avatarProps={{
                                src: member.avatar || `/images/avatars/default.png`,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip color={member.role === 'admin' ? 'danger' : 'primary'} variant="flat" size="sm">
                              {member.role === 'admin' ? 'Admin' : 'Người dùng'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Chip color={member.isActive ? 'success' : 'default'} variant="flat" size="sm">
                              {member.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button 
                              isIconOnly
                              size="sm" 
                              color="danger" 
                              variant="flat"
                              onPress={() => handleRemoveMember(member.id)}
                            >
                              <X size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 