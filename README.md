# CourtMate MVP

CourtMate là một nền tảng kết nối người chơi cầu lông với các giải đấu và kèo giao lưu (vãng lai).
Dự án được cấu trúc theo dạng monorepo chứa hai thành phần chính: Frontend và Backend.

## 📁 Cấu trúc dự án
- `apps/frontend-web/`: Giao diện người dùng (React, Vite, TailwindCSS)
- `apps/backend/`: Máy chủ Backend (NestJS, Mongoose, MongoDB)

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu hệ thống
- **Node.js** (Khuyên dùng phiên bản >= 18)
- **MongoDB** (Cài đặt MongoDB local hoặc sử dụng MongoDB Atlas)

### 2. Cài đặt thư viện (Dependencies)
Cài đặt thư viện cho cả Frontend và Backend:

```bash
# Cài đặt cho frontend
cd apps/frontend-web
npm install

# Cài đặt cho backend
cd ../backend
npm install
```

### 3. Khởi chạy ứng dụng

**Khởi chạy Frontend:**
Mở một cửa sổ Terminal (Command Prompt) mới:
```bash
cd apps/frontend-web
npm run dev
```
👉 Frontend sẽ hoạt động tại: `http://localhost:5173`

**Khởi chạy Backend:**
Mở một cửa sổ Terminal (Command Prompt) mới:
```bash
cd apps/backend
npm run start:dev
```
👉 Backend sẽ hoạt động tại: `http://localhost:3000`

---

## 🔑 Đăng nhập thử nghiệm (Tùy chọn)
Trong thư mục gốc của dự án có sẵn file `mock_users.json`. Bạn có thể sử dụng MongoDB Compass để Import dữ liệu này vào bảng (collection) `users` của database. 

File này chứa sẵn 2 tài khoản (1 admin và 1 host) với mật khẩu mặc định cho cả hai là:
`123456`
