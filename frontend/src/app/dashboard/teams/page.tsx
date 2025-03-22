'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Chip,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge
} from '@nextui-org/react';
import { EllipsisVertical, Plus, Pencil, Trash, Users } from 'lucide-react';
import { Team } from '@/modules/dashboard/services/userService';
import { teamService } from '@/modules/dashboard/services/teamService';
import { LoadingScreen } from '@/components/loading-screen';
import TeamFormModal from '@/modules/dashboard/components/team-form-modal';
import ConfirmModal from '@/components/confirm-modal';
import TeamMembersModal from '@/modules/dashboard/components/team-members-modal';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Modals
  const { isOpen: isTeamFormOpen, onOpen: onTeamFormOpen, onClose: onTeamFormClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isTeamMembersOpen, onOpen: onTeamMembersOpen, onClose: onTeamMembersClose } = useDisclosure();

  // Load dữ liệu
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams();
        setTeams(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách nhóm:', error);
        // Hiển thị thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  // Xử lý các sự kiện
  const handleAddTeam = () => {
    setSelectedTeam(null);
    onTeamFormOpen();
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    onTeamFormOpen();
  };

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    onDeleteModalOpen();
  };

  const handleViewMembers = (team: Team) => {
    setSelectedTeam(team);
    onTeamMembersOpen();
  };

  const confirmDeleteTeam = async () => {
    if (!selectedTeam) return;
    
    try {
      await teamService.deleteTeam(selectedTeam.id);
      // Cập nhật danh sách sau khi xóa
      setTeams(teams.filter(team => team.id !== selectedTeam.id));
      onDeleteModalClose();
    } catch (error) {
      console.error('Lỗi khi xóa nhóm:', error);
      // Hiển thị thông báo lỗi
    }
  };

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    try {
      if (selectedTeam) {
        // Cập nhật nhóm
        const updatedTeam = await teamService.updateTeam(selectedTeam.id, teamData);
        setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      } else {
        // Thêm mới nhóm
        const newTeam = await teamService.createTeam(teamData as any);
        setTeams([...teams, newTeam]);
      }
      onTeamFormClose();
    } catch (error) {
      console.error('Lỗi khi lưu thông tin nhóm:', error);
      // Hiển thị thông báo lỗi
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhóm</h1>
        <Button 
          color="primary" 
          startContent={<Plus size={16} />}
          onPress={handleAddTeam}
        >
          Thêm nhóm
        </Button>
      </div>
      
      <Table aria-label="Danh sách nhóm">
        <TableHeader>
          <TableColumn>TÊN NHÓM</TableColumn>
          <TableColumn>PHÒNG BAN</TableColumn>
          <TableColumn>MÔ TẢ</TableColumn>
          <TableColumn>TRẠNG THÁI</TableColumn>
          <TableColumn>NGÀY TẠO</TableColumn>
          <TableColumn>THAO TÁC</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu nhóm">
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>
              <TableCell>{team.department || 'Chưa phân loại'}</TableCell>
              <TableCell>
                <p className="truncate max-w-xs">{team.description || 'Không có mô tả'}</p>
              </TableCell>
              <TableCell>
                <Chip color={team.isActive ? 'success' : 'default'} variant="flat">
                  {team.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </Chip>
              </TableCell>
              <TableCell>{new Date(team.createdAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light">
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Team Actions">
                    <DropdownItem 
                      startContent={<Users size={16} />}
                      onPress={() => handleViewMembers(team)}
                    >
                      Xem thành viên
                    </DropdownItem>
                    <DropdownItem 
                      startContent={<Pencil size={16} />}
                      onPress={() => handleEditTeam(team)}
                    >
                      Sửa
                    </DropdownItem>
                    <DropdownItem 
                      startContent={<Trash size={16} />} 
                      className="text-danger" 
                      color="danger"
                      onPress={() => handleDeleteTeam(team)}
                    >
                      Xóa
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Modal form thêm/sửa nhóm */}
      <TeamFormModal 
        isOpen={isTeamFormOpen} 
        onClose={onTeamFormClose}
        onSave={handleSaveTeam}
        team={selectedTeam}
      />
      
      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={confirmDeleteTeam}
        title="Xóa nhóm"
        content={`Bạn có chắc chắn muốn xóa nhóm ${selectedTeam?.name || ''}?`}
      />
      
      {/* Modal xem thành viên */}
      {selectedTeam && (
        <TeamMembersModal
          isOpen={isTeamMembersOpen}
          onClose={onTeamMembersClose}
          teamId={selectedTeam.id}
        />
      )}
    </div>
  );
} 