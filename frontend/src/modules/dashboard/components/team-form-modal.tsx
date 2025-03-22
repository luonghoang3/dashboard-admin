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
  Switch,
  Textarea
} from '@nextui-org/react';
import { Team } from '../services/userService';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamData: Partial<Team>) => void;
  team: Team | null;
}

export default function TeamFormModal({ isOpen, onClose, onSave, team }: TeamFormModalProps) {
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    description: '',
    department: '',
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form khi modal mở và có dữ liệu team
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        department: team.department,
        isActive: team.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        department: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [team, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên nhóm là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      onSave(formData);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          {team ? 'Cập nhật thông tin nhóm' : 'Thêm nhóm mới'}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Tên nhóm"
              placeholder="Nhập tên nhóm"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            
            <Input
              label="Phòng ban"
              placeholder="Nhập tên phòng ban"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
            />
            
            <Textarea
              label="Mô tả"
              placeholder="Nhập mô tả về nhóm"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              minRows={3}
            />
            
            <div className="flex items-center justify-start gap-2">
              <Switch
                isSelected={formData.isActive}
                onValueChange={handleSwitchChange}
              />
              <span>Kích hoạt nhóm</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
            {team ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 