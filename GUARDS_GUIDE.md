# Guards & Authentication Guide

## Overview
Hệ thống guards bao gồm authentication (xác thực) và authorization (phân quyền) để bảo vệ các API endpoints.

## Authentication & Authorization System

### 1. User Roles
```typescript
enum Role {
  USER = 'user',          // Người dùng thông thường
  ADMIN = 'admin',        // Quản trị viên
  MODERATOR = 'moderator' // Người điều hành
}
```

### 2. Guards

#### JwtAuthGuard
- Xác thực JWT token
- Kiểm tra token có hợp lệ không
- Tự động skip nếu route được đánh dấu `@Public()`

#### RolesGuard
- Kiểm tra quyền truy cập dựa trên roles
- Chỉ cho phép user có đúng role mới truy cập
- Hoạt động sau JwtAuthGuard

### 3. Decorators

#### @Public()
- Đánh dấu route không cần authentication
- Bỏ qua JwtAuthGuard

#### @Roles(Role.ADMIN, Role.MODERATOR)
- Chỉ định roles được phép truy cập
- Có thể chỉ định nhiều roles

#### @CurrentUser()
- Lấy thông tin user hiện tại từ JWT token
- Có thể lấy toàn bộ user hoặc field cụ thể

## API Endpoints

### Authentication Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "role": "user"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-07-01T10:00:00.000Z",
    "updatedAt": "2025-07-01T10:00:00.000Z"
  }
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Get Profile
```bash
GET /auth/profile
Authorization: Bearer <access_token>
```

### Protected Endpoints

#### Users API

| Endpoint | Method | Roles Required | Description |
|----------|---------|----------------|-------------|
| `POST /users` | POST | Public | Register new user |
| `GET /users` | GET | ADMIN, MODERATOR | Get all users |
| `GET /users/me` | GET | Authenticated | Get own profile |
| `GET /users/:id` | GET | Own profile or ADMIN/MODERATOR | Get user by ID |
| `PATCH /users/:id` | PATCH | Own profile or ADMIN | Update user |
| `DELETE /users/:id` | DELETE | ADMIN | Delete user |

#### Products API

| Endpoint | Method | Roles Required | Description |
|----------|---------|----------------|-------------|
| `GET /products` | GET | Public | Get all products |
| `GET /products/:id` | GET | Public | Get product by ID |
| `POST /products` | POST | ADMIN, MODERATOR | Create product |
| `PATCH /products/:id` | PATCH | ADMIN, MODERATOR | Update product |
| `DELETE /products/:id` | DELETE | ADMIN | Delete product |

## Usage Examples

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "role": "admin"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }'
```

### 2. Access Protected Endpoints
```bash
# Get profile (requires token)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your_token>"

# Get all users (requires ADMIN or MODERATOR role)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <admin_token>"

# Create product (requires ADMIN or MODERATOR role)
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99
  }'
```

### 3. Error Responses

#### Unauthorized (No Token)
```json
{
  "message": "Invalid token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### Forbidden (Wrong Role)
```json
{
  "message": "Access denied. Required roles: admin, moderator",
  "error": "Forbidden", 
  "statusCode": 403
}
```

#### Invalid Credentials
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

## Security Features

### 1. Password Hashing
- Sử dụng bcryptjs với salt rounds = 10
- Passwords không bao giờ được lưu dưới dạng plain text

### 2. JWT Token
- Expire time: 1 day
- Chứa user ID, email, và role
- Secret key có thể cấu hình qua environment variables

### 3. Role-Based Access Control (RBAC)
- **USER**: Chỉ có thể xem và chỉnh sửa profile của mình
- **MODERATOR**: Có thể quản lý products, xem danh sách users
- **ADMIN**: Có thể làm tất cả, bao gồm xóa users

### 4. Route Protection
- Default: Tất cả routes đều protected
- Sử dụng `@Public()` để tạo public routes
- Guards tự động áp dụng cho toàn bộ controller

## Environment Variables

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Implementation Details

### Guard Order
1. **JwtAuthGuard**: Xác thực JWT token
2. **RolesGuard**: Kiểm tra quyền truy cập

### User Context
Sau khi authentication thành công, user object được attach vào request:
```typescript
@Get('profile')
getProfile(@CurrentUser() user: User) {
  // user object chứa thông tin từ database
  return user;
}
```

### Custom Business Logic
```typescript
@Get(':id')
findOne(@Param('id') id: number, @CurrentUser() currentUser: User) {
  // Users can only view their own profile
  if (currentUser.role === Role.USER && currentUser.id !== id) {
    throw new ForbiddenException('Access denied');
  }
  return this.usersService.findOne(id);
}
```

## Testing Guide

### 1. Create Test Users
```bash
# Create admin user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com", 
    "password": "AdminPass123!",
    "role": "admin"
  }'

# Create regular user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User",
    "email": "user@test.com",
    "password": "UserPass123!",
    "role": "user"
  }'
```

### 2. Test Different Scenarios
```bash
# Test admin access
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"AdminPass123!"}' \
  | jq -r '.access_token')

# Test user access
USER_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"UserPass123!"}' \
  | jq -r '.access_token')

# Admin can access user list
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/users

# User cannot access user list (should return 403)
curl -H "Authorization: Bearer $USER_TOKEN" http://localhost:3000/users
``` 