# 🚀 Backend Node.js E-commerce API

RESTful API cho hệ thống **thương mại điện tử** (E-commerce) được xây dựng bằng **Node.js**, **Express** và **MongoDB**.  
Dự án hiện đang ở giai đoạn **MVP** (Minimum Viable Product) – phù hợp để học tập, demo hoặc làm nền tảng phát triển tiếp.

![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-≥6-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat-square&logo=json-web-tokens)

## ✨ Mục tiêu & Tính năng chính (Features)

- Đăng ký / Đăng nhập / Quên mật khẩu (JWT + Refresh Token)
- Quản lý profile người dùng + phân quyền (User / Admin)
- Quản lý danh mục sản phẩm (Categories)
- Quản lý sản phẩm (CRUD + tìm kiếm, lọc, phân trang)
- Giỏ hàng (Cart) – thêm/sửa/xóa
- Đặt hàng & theo dõi đơn hàng (Orders)
- (Tương lai) Upload ảnh sản phẩm (Cloudinary/Multer)
- (Tương lai) Tích hợp thanh toán (VNPay, Momo, Stripe…)
- (Tương lai) Đánh giá & rating sản phẩm

## 🛠 Tech Stack

- **Runtime**: Node.js ≥ 18
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Environment**: dotenv
- **Security**: helmet, cors, express-rate-limit (khuyến nghị thêm)
- **Validation**: Joi hoặc Zod (khuyến nghị)
- **Dev Tools**: nodemon, ESLint + Prettier

##🔒 Best Practices & Bảo mật (đã / nên áp dụng)

Hash mật khẩu bằng bcrypt (12+ rounds)
JWT với thời hạn ngắn + Refresh Token
Rate limiting chống brute-force
Helmet bảo vệ HTTP headers
Validate input bằng Joi/Zod
Centralized error handling
Không lưu secret trong code

### Yêu cầu trước khi bắt đầu

- Node.js ≥ 18 (khuyến nghị dùng [nvm](https://github.com/nvm-sh/nvm))
- MongoDB (local hoặc [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) miễn phí)
- Git

#### Bước 1: Clone repository
- git clone https://github.com/TranDinhChuong123/backend-node-ecommerce.git
- cd backend-node-ecommerce
#### Bước 2: Cài đặt dependencies
- Bashnpm install
- hoặc yarn
- yarn install
#### Bước 3: Tạo file .env

Bước 4: Chạy server
- npm run dev
→ Server chạy tại: http://localhost:5000
#### Bước 5: Kiểm tra server hoạt động
- Mở browser hoặc Postman:
- http://localhost:5000/ → mong đợi thấy "Server is running" hoặc JSON response (nếu đã config)
- http://localhost:5000/api/health (nếu bạn đã thêm route health check)


## 🛤️ Roadmap (Hướng phát triển)

 - Hoàn thiện authentication đầy đủ (register, login, refresh, forgot password)
 - Thêm upload ảnh sản phẩm (multer + cloudinary)
 - Tích hợp thanh toán Việt Nam (VNPay / Momo)
 - Swagger / OpenAPI documentation
 - Unit + Integration tests (Jest + Supertest)
 - Docker + Docker Compose
 - Deploy miễn phí (Render / Railway / Vercel)

