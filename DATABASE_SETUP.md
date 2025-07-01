# Database Setup Guide

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm

## Database Configuration

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database and User
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE nestjs_app;

# Create user (optional)
CREATE USER nestjs_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nestjs_app TO nestjs_user;

# Exit PostgreSQL
\q
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=nestjs_app

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Application
```bash
npm run start:dev
```

## Database Features

### Auto Migration
- In development mode (`NODE_ENV=development`), TypeORM will automatically create tables
- Set `synchronize: false` in production

### Entities
- **User Entity**: `src/users/entities/user.entity.ts`
- **Product Entity**: `src/products/entities/product.entity.ts`

### Database Tables
- `users` table with columns: id, name, email, password, phone, address, created_at, updated_at
- `products` table with columns: id, name, description, price, category, stock, created_at, updated_at

## Testing Database Connection

### 1. Check if tables are created
```bash
# Connect to PostgreSQL
psql -U postgres -d nestjs_app

# List tables
\dt

# View table structure
\d users
\d products

# Exit
\q
```

### 2. Test API endpoints
```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'

# Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99
  }'

# Get all users
curl http://localhost:3000/users

# Get all products
curl http://localhost:3000/products
```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Make sure PostgreSQL is running
   - Check if port 5432 is correct
   - Verify username/password

2. **Database does not exist**
   - Create the database manually
   - Check database name in .env file

3. **Permission denied**
   - Grant proper privileges to the user
   - Check if user exists

### Useful Commands

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check if port 5432 is listening
netstat -tlnp | grep 5432

# Connect to database
psql -U postgres -d nestjs_app -h localhost
```

## Production Considerations

1. **Disable auto-synchronization**
   ```typescript
   synchronize: false
   ```

2. **Use migrations**
   ```bash
   npm run typeorm migration:generate
   npm run typeorm migration:run
   ```

3. **Environment variables**
   - Use proper environment variables in production
   - Never commit .env files to version control

4. **Connection pooling**
   - Configure connection pool settings
   - Monitor database performance 