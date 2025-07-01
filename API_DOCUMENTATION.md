# API Documentation

## Base URL
```
http://localhost:3000
```

## Users API

### 1. Create User
**POST** `/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "123 Main St",
  "createdAt": "2025-07-01T08:07:22.846Z",
  "updatedAt": "2025-07-01T08:07:22.846Z"
}
```

### 2. Get All Users
**GET** `/users`

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "phone": "0123456789",
    "address": "123 Main St",
    "createdAt": "2025-07-01T08:07:22.846Z",
    "updatedAt": "2025-07-01T08:07:22.846Z"
  }
]
```

### 3. Get User by ID
**GET** `/users/:id`

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "123 Main St",
  "createdAt": "2025-07-01T08:07:22.846Z",
  "updatedAt": "2025-07-01T08:07:22.846Z"
}
```

### 4. Update User
**PATCH** `/users/:id`

**Request Body:**
```json
{
  "name": "John Smith",
  "address": "456 Oak St"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "456 Oak St",
  "createdAt": "2025-07-01T08:07:22.846Z",
  "updatedAt": "2025-07-01T08:07:37.026Z"
}
```

### 5. Delete User
**DELETE** `/users/:id`

**Response:**
```json
{
  "message": "User with ID 1 has been deleted"
}
```

## Products API

### 1. Create Product
**POST** `/products`

**Request Body:**
```json
{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50
}
```

**Response:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "createdAt": "2025-07-01T08:07:25.579Z",
  "updatedAt": "2025-07-01T08:07:25.579Z"
}
```

### 2. Get All Products
**GET** `/products`

### 3. Get Product by ID
**GET** `/products/:id`

### 4. Update Product
**PATCH** `/products/:id`

### 5. Delete Product
**DELETE** `/products/:id`

## Testing with cURL

### Create a user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "phone": "0123456789"
  }'
```

### Create a product:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50
  }'
```

### Get all users:
```bash
curl http://localhost:3000/users
```

### Get all products:
```bash
curl http://localhost:3000/products
```

### Update a user:
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "address": "123 Main St"
  }'
```

### Delete a user:
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Validation Rules

### User Validation:
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, string, minimum 6 characters
- `phone`: Optional, string
- `address`: Optional, string

### Product Validation:
- `name`: Required, string
- `description`: Required, string
- `price`: Required, number, minimum 0
- `category`: Optional, string
- `stock`: Optional, number, minimum 0 