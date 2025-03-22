'use client';

import { useEffect } from 'react';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    // Đăng xuất ngay khi trang được tải
    logout();
  }, [logout]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Đang đăng xuất...</h1>
        <p>Bạn sẽ được chuyển hướng đến trang đăng nhập sau vài giây.</p>
      </div>
    </div>
  );
} 