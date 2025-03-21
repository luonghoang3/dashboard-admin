'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isPageReady, setIsPageReady] = useState(false);

  // Xử lý chuyển hướng và hiển thị
  useEffect(() => {
    // Nếu đang tải, chưa làm gì cả
    if (isLoading) {
      console.log('Still loading auth state...');
      return;
    }

    // Nếu không xác thực, chuyển hướng về trang đăng nhập
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      router.replace('/login?redirect=/dashboard');
      return;
    }

    // Nếu đã xác thực và hoàn tất tải, hiển thị trang
    console.log('User authenticated, showing dashboard');
    setIsPageReady(true);
  }, [isAuthenticated, isLoading, router]);

  // Hiển thị trạng thái đang tải
  if (isLoading || !isPageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Xin chào, {user.fullName || user.username}</p>
              <p className="text-xs text-gray-500">Vai trò: {user.role}</p>
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số người dùng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      12,345
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số nhóm
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      24
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số khách hàng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      567
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số đơn hàng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      678
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Thống kê gần đây
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-center text-gray-500">
                  Biểu đồ thống kê sẽ hiển thị ở đây
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
