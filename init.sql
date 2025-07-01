-- Create database if not exists
SELECT 'CREATE DATABASE nestjs_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nestjs_app')\gexec

-- Connect to the database
\c nestjs_app;

-- Create extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a dedicated user for the application (optional)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'nestjs_user') THEN
        CREATE USER nestjs_user WITH PASSWORD 'nestjs_password';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nestjs_app TO nestjs_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nestjs_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nestjs_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO nestjs_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nestjs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO nestjs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO nestjs_user; 