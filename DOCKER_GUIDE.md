# Docker Setup Guide

## Prerequisites
- Docker và Docker Compose đã được cài đặt
- Node.js và npm (cho development)

## Quick Start

### 1. Khởi động PostgreSQL với Docker
```bash
# Khởi động database
docker-compose up -d postgres

# Hoặc khởi động cả PostgreSQL và pgAdmin
docker-compose up -d
```

### 2. Tạo file .env
```bash
# Copy file env.example
cp env.example .env
```

### 3. Chạy ứng dụng NestJS
```bash
# Development mode
npm run start:dev
```

## Docker Services

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: nestjs_app
- **Username**: postgres
- **Password**: password
- **Container**: nestjs_postgres

### pgAdmin (Database Management)
- **Image**: dpage/pgadmin4:latest
- **Port**: 5050
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin
- **Container**: nestjs_pgadmin

## Docker Commands

### Khởi động services
```bash
# Khởi động tất cả services
docker-compose up -d

# Khởi động chỉ PostgreSQL
docker-compose up -d postgres

# Khởi động với logs
docker-compose up
```

### Dừng services
```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

### Kiểm tra status
```bash
# Xem status của containers
docker-compose ps

# Xem logs
docker-compose logs postgres
docker-compose logs pgadmin
```

### Truy cập database
```bash
# Kết nối vào PostgreSQL container
docker exec -it nestjs_postgres psql -U postgres -d nestjs_app

# Hoặc sử dụng pgAdmin web interface
# Mở browser: http://localhost:5050
```

## Database Configuration

### Connection Details
- **Host**: localhost (hoặc 127.0.0.1)
- **Port**: 5432
- **Database**: nestjs_app
- **Username**: postgres
- **Password**: password

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=nestjs_app
NODE_ENV=development
PORT=3000
```

## Testing Database Connection

### 1. Kiểm tra database đã được tạo
```bash
# Kết nối vào PostgreSQL
docker exec -it nestjs_postgres psql -U postgres -d nestjs_app

# Liệt kê databases
\l

# Liệt kê tables (sau khi chạy ứng dụng)
\dt

# Thoát
\q
```

### 2. Test API endpoints
```bash
# Tạo user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'

# Tạo product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99
  }'

# Lấy danh sách users
curl http://localhost:3000/users

# Lấy danh sách products
curl http://localhost:3000/products
```

## pgAdmin Setup

### 1. Truy cập pgAdmin
- Mở browser: http://localhost:5050
- Login với: admin@admin.com / admin

### 2. Thêm server
- Click "Add New Server"
- **Name**: NestJS Database
- **Host**: postgres (hoặc localhost)
- **Port**: 5432
- **Database**: nestjs_app
- **Username**: postgres
- **Password**: password

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kiểm tra port đang sử dụng
   lsof -ti:5432
   
   # Kill process nếu cần
   kill -9 <PID>
   ```

2. **Container không start**
   ```bash
   # Xem logs
   docker-compose logs postgres
   
   # Restart container
   docker-compose restart postgres
   ```

3. **Database connection failed**
   ```bash
   # Kiểm tra container status
   docker-compose ps
   
   # Kiểm tra network
   docker network ls
   ```

### Useful Commands

```bash
# Xóa tất cả containers và volumes
docker-compose down -v

# Rebuild containers
docker-compose build

# Xem disk usage
docker system df

# Cleanup unused resources
docker system prune
```

## Production Considerations

### 1. Security
- Thay đổi default passwords
- Sử dụng environment variables
- Restrict network access

### 2. Performance
- Tune PostgreSQL settings
- Use connection pooling
- Monitor resource usage

### 3. Backup
```bash
# Backup database
docker exec nestjs_postgres pg_dump -U postgres nestjs_app > backup.sql

# Restore database
docker exec -i nestjs_postgres psql -U postgres nestjs_app < backup.sql
```

## Development vs Production

### Development
- Sử dụng `docker-compose.dev.yml`
- Auto-sync database schema
- Hot reload cho code

### Production
- Sử dụng `docker-compose.yml`
- Disable auto-sync
- Use migrations
- Proper logging
- Health checks 