'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Chip,
  Divider
} from '@nextui-org/react';
import { teamService } from '../services/teamService';
import { userService } from '../services/userService';
import { Team } from '../services/userService';
import { LoadingScreen } from '@/components/loading-screen';

interface AssignTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function AssignTeamModal({ isOpen, onClose, userId }: AssignTeamModalProps) {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy danh sách tất cả nhóm và các nhóm của người dùng khi mở modal
  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      setError(null);
      
      const fetchData = async () => {
        try {
          // Lấy tất cả nhóm
          const teams = await teamService.getAllTeams();
          setAllTeams(teams);
          
          // Lấy người dùng với danh sách nhóm
          const user = await userService.getUserWithTeams(userId);
          
          // Lấy danh sách id của các nhóm mà người dùng đã tham gia
          const userTeamIds = user.teams?.map(team => team.id) || [];
          setUserTeams(userTeamIds);
          setSelectedTeams(userTeamIds);
        } catch (error) {
          setError('Không thể tải dữ liệu, vui lòng thử lại');
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, userId]);
  
  // Xử lý khi chọn/bỏ chọn nhóm
  const handleSelectionChange = (teamId: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };
  
  // Xử lý lưu thay đổi
  const handleSave = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Xác định nhóm nào cần thêm mới
      const teamsToAdd = selectedTeams.filter(teamId => !userTeams.includes(teamId));
      
      // Xác định nhóm nào cần xóa
      const teamsToRemove = userTeams.filter(teamId => !selectedTeams.includes(teamId));
      
      // Thực hiện các thao tác thêm người dùng vào nhóm
      for (const teamId of teamsToAdd) {
        await teamService.addUserToTeam(teamId, userId);
      }
      
      // Thực hiện các thao tác xóa người dùng khỏi nhóm
      for (const teamId of teamsToRemove) {
        await teamService.removeUserFromTeam(teamId, userId);
      }
      
      // Đóng modal sau khi hoàn thành
      onClose();
    } catch (error) {
      setError('Đã xảy ra lỗi khi cập nhật nhóm');
      console.error('Error updating teams:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Kiểm tra xem có thay đổi gì so với ban đầu không
  const hasChanges = () => {
    if (userTeams.length !== selectedTeams.length) return true;
    
    for (const teamId of userTeams) {
      if (!selectedTeams.includes(teamId)) return true;
    }
    
    for (const teamId of selectedTeams) {
      if (!userTeams.includes(teamId)) return true;
    }
    
    return false;
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>Phân nhóm cho người dùng</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <LoadingScreen text="Đang tải dữ liệu nhóm..." />
          ) : error ? (
            <div className="text-danger text-center py-4">{error}</div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-default-500">
                Chọn các nhóm mà bạn muốn người dùng này tham gia.
              </p>
              
              <Divider />
              
              {allTeams.length === 0 ? (
                <p className="text-center py-2">Không có nhóm nào</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto p-1">
                  {allTeams.map(team => (
                    <div key={team.id} className="flex items-center justify-between p-2 rounded hover:bg-default-100">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          isSelected={selectedTeams.includes(team.id)}
                          onValueChange={() => handleSelectionChange(team.id)}
                        />
                        <div>
                          <p className="text-sm font-medium">{team.name}</p>
                          {team.department && (
                            <p className="text-xs text-default-500">{team.department}</p>
                          )}
                        </div>
                      </div>
                      
                      {team.isActive ? (
                        <Chip size="sm" color="success" variant="flat">Đang hoạt động</Chip>
                      ) : (
                        <Chip size="sm" variant="flat">Không hoạt động</Chip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} disabled={isSaving}>
            Hủy
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave} 
            isLoading={isSaving}
            isDisabled={isLoading || !hasChanges()}
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 