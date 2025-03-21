'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams?.get('redirect') || '/dashboard';

  // Kiểm tra nếu đã xác thực thì chuyển hướng
  useEffect(() => {
    console.log('Login page mounted, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to:', redirect);
      window.location.href = redirect; // Dùng window.location để tránh vấn đề cache của router
    }
  }, [isAuthenticated, redirect]);

  // Hiển thị thông báo nếu đăng nhập thành công
  useEffect(() => {
    if (loginSuccess) {
      console.log('Login success, will redirect to:', redirect);
      // Đợi một chút để đảm bảo state đã được cập nhật
      const timer = setTimeout(() => {
        window.location.href = redirect;
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with username:', username, 'and password:', password ? '******' : 'empty');
      
      await login(username, password);
      console.log('Login successful in component');
      
      // Đánh dấu đăng nhập thành công để kích hoạt useEffect chuyển hướng
      setLoginSuccess(true);
    } catch (err) {
      console.error('Login error in component:', err);
      setError('Tên đăng nhập hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">Đăng nhập thành công!</h2>
            <p className="mt-2">Đang chuyển hướng đến trang Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold">Dashboard Admin</h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Đăng nhập
            </h2>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
