'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Checkbox,
  Chip
} from '@nextui-org/react';
import { User, Team } from '../services/userService';
import { teamService } from '../services/teamService';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  user: User | null;
}

export default function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  
  // Reset form khi modal mở và có dữ liệu user
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role || 'user',
        isActive: user.isActive,
      });
      
      // Nếu có thông tin teams trong user, cập nhật danh sách team được chọn
      if (user.teams && user.teams.length > 0) {
        setSelectedTeams(user.teams.map(team => team.id));
      } else {
        setSelectedTeams([]);
      }
    } else {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        role: 'user',
        isActive: true,
        password: '',
      });
      setSelectedTeams([]);
    }
    setErrors({});
  }, [user, isOpen]);
  
  // Tải danh sách team khi mở modal
  useEffect(() => {
    if (isOpen) {
      const fetchTeams = async () => {
        setIsLoadingTeams(true);
        try {
          const data = await teamService.getAllTeams();
          setTeams(data);
        } catch (error) {
          console.error('Lỗi khi tải danh sách nhóm:', error);
        } finally {
          setIsLoadingTeams(false);
        }
      };
      
      fetchTeams();
    }
  }, [isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };
  
  const handleRoleChange = (value: any) => {
    setFormData(prev => ({
      ...prev,
      role: value.toString()
    }));
  };
  
  const handleTeamChange = (teamId: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }
    
    if (!user && !formData.password?.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc cho người dùng mới';
    } else if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Chuẩn bị dữ liệu form để gửi đi
        const userData = { ...formData };
        
        // Thêm thông tin teams vào dữ liệu gửi đi
        (userData as any).selectedTeams = selectedTeams;
        
        // Gọi hàm onSave để lưu thông tin người dùng
        await onSave(userData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "m-0 p-0 max-w-[95%] md:max-w-[600px]",
        body: "p-5",
        footer: "p-4 justify-end"
      }}
    >
      <ModalContent>
        <ModalHeader>
          {user ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới'}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.username}
              errorMessage={errors.username}
            />
            
            <Input
              label="Email"
              placeholder="Nhập địa chỉ email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            
            <Input
              label="Họ tên"
              placeholder="Nhập họ tên"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.fullName}
              errorMessage={errors.fullName}
              className="md:col-span-2"
            />
            
            {!user && (
              <Input
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ''}
                onChange={handleChange}
                isRequired
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                endContent={
                  <Checkbox
                    isSelected={showPassword}
                    onValueChange={setShowPassword}
                    size="sm"
                    icon={({ isSelected }) => 
                      isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                      )
                    }
                  />
                }
              />
            )}
            
            <Select
              label="Vai trò"
              selectedKeys={formData.role ? [formData.role] : ["user"]}
              onSelectionChange={(keys) => {
                const role = Array.from(keys)[0] as string || 'user';
                handleRoleChange(role);
              }}
              disallowEmptySelection
              className="md:col-span-1"
            >
              <SelectItem key="user" value="user">Người dùng</SelectItem>
              <SelectItem key="admin" value="admin">Quản trị viên</SelectItem>
            </Select>
            
            <div className="flex items-center justify-start gap-2 md:col-span-1">
              <Switch
                isSelected={formData.isActive}
                onValueChange={handleSwitchChange}
                color="success"
                size="md"
              />
              <span>Kích hoạt tài khoản</span>
            </div>
            
            {/* Phần chọn nhóm */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-medium mb-2">Phân nhóm</h3>
              {isLoadingTeams ? (
                <p className="text-sm text-default-500">Đang tải danh sách nhóm...</p>
              ) : teams.length === 0 ? (
                <p className="text-sm text-default-500">Không có nhóm nào</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-3 border border-default-200 rounded-md">
                  {teams.map(team => (
                    <Chip
                      key={team.id}
                      variant={selectedTeams.includes(team.id) ? "solid" : "bordered"}
                      color={selectedTeams.includes(team.id) ? "success" : "default"}
                      className={`cursor-pointer m-1 ${selectedTeams.includes(team.id) ? 'shadow-sm' : ''}`}
                      size="md"
                      onClick={() => handleTeamChange(team.id)}
                    >
                      {team.name}
                    </Chip>
                  ))}
                </div>
              )}
              <p className="text-xs text-default-400 mt-1">
                Chọn các nhóm mà người dùng sẽ tham gia.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button variant="flat" onPress={onClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
            {user ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 