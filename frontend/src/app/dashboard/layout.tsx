'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Nếu đã tải xong và không đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isLoading && !isAuthenticated && !redirected) {
      setRedirected(true);
      console.log('Không xác thực, chuyển hướng đến trang đăng nhập');
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated, redirected]);

  // Hiển thị trạng thái tải
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu không xác thực, không hiển thị nội dung
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="text-2xl font-bold mb-8">Dashboard Admin</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
                Tổng quan
              </a>
            </li>
            <li>
              <a href="/dashboard/users" className="block px-4 py-2 rounded hover:bg-gray-700">
                Người dùng
              </a>
            </li>
            <li>
              <a href="/dashboard/teams" className="block px-4 py-2 rounded hover:bg-gray-700">
                Teams
              </a>
            </li>
            <li>
              <a href="/dashboard/clients" className="block px-4 py-2 rounded hover:bg-gray-700">
                Khách hàng
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 