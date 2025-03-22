import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các đường dẫn công khai, không cần xác thực
const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

// Tên cookie lưu token
const AUTH_TOKEN_COOKIE = 'auth_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu đường dẫn là công khai, không cần xác thực
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/')
  );

  // Kiểm tra nếu người dùng đã đăng nhập (có token)
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  console.log(`Middleware - Pathname: ${pathname}, Token exists: ${!!token}, Public path: ${isPublicPath}`);

  // Nếu đường dẫn không phải công khai và không có token, chuyển hướng đến trang đăng nhập
  if (!isPublicPath && !token) {
    console.log(`Middleware - Redirecting to /login from ${pathname}`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập và cố gắng truy cập trang đăng nhập/đăng ký, chuyển hướng đến trang dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    console.log(`Middleware - Redirecting to /dashboard from ${pathname}`);
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Cấu hình middleware chạy trên tất cả các đường dẫn ngoại trừ static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 