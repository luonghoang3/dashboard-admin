# Dashboard Admin

Dashboard Admin nội bộ xây dựng trên Next.js, NestJS, PostgreSQL và Docker.

## Cấu trúc dự án

```
project/
├── frontend/          # Next.js App
├── backend/           # NestJS API
├── docker-compose.yml # Docker configuration
├── .env               # Environment variables
└── temp/              # Temporary files
```

## Tính năng chính

- **User Module**: Quản lý người dùng, phân quyền
- **Team Module**: Quản lý nhóm làm việc
- **Auth Module**: Xác thực và bảo mật
- **Dashboard Module**: Thống kê tổng quan, biểu đồ và báo cáo

## Các module dự kiến phát triển sau

- **Order Module**: Quản lý đơn hàng
- **Client Module**: Quản lý khách hàng

## Cách cài đặt và chạy

### Yêu cầu

- Docker và Docker Compose
- Node.js (phát triển local)

### Cài đặt

1. Clone dự án:

```bash
git clone <repository-url>
cd dashboard-admin
```

2. Tạo file .env từ .env.example:

```bash
cp .env.example .env
```

3. Khởi động dự án bằng Docker:

```bash
docker-compose up --build
```

### Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API docs (Swagger): http://localhost:5000/api

## Phát triển

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

## Liên hệ

Nếu có câu hỏi hoặc đóng góp, vui lòng liên hệ qua email: dev@example.com
