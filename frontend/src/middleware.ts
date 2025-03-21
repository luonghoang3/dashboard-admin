import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các đường dẫn công khai, không cần xác thực
const publicPaths = ['/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu đường dẫn là công khai, không cần xác thực
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith('/api/')
  );

  // Kiểm tra nếu người dùng đã đăng nhập (có token)
  const token = request.cookies.get('token')?.value;

  // Nếu đường dẫn không phải công khai và không có token, chuyển hướng đến trang đăng nhập
  if (!isPublicPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?redirect=${pathname}`;
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập và cố gắng truy cập trang đăng nhập, chuyển hướng đến trang dashboard
  if (pathname === '/login' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Cấu hình middleware chạy trên tất cả các đường dẫn ngoại trừ những đường dẫn nào
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 