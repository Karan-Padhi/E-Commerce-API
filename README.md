Here’s a complete and professional README.md file for your second project — the E-Commerce REST API:

---

# 🛒 E-Commerce API

A robust and secure RESTful API for managing an E-Commerce Product Catalog. Built with Node.js and Express.js, this backend project supports full CRUD operations, JWT authentication, role-based access control, and database integration using Sequelize or Mongoose.

## 📦 Project Overview

This API enables sellers and admins to manage products and categories, while customers can browse and search the catalog. It includes secure user authentication, file uploads, and advanced features like pagination, filtering, and search.

## 🧰 Tech Stack

- **Backend:** Node.js 18+, Express.js
- **Database:** MySQL (Sequelize) or MongoDB (Mongoose)
- **Authentication:** JWT with refresh tokens, bcrypt password hashing
- **Validation:** Joi or express-validator
- **Security:** Helmet, CORS, rate-limiting
- **File Uploads:** Multer

## 🗃️ Database Schemas

### Users

```json
{
  "userId": "UUID",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "hashed string",
  "role": "customer | seller | admin",
  "refreshToken": "hashed string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Categories

```json
{
  "categoryId": "UUID",
  "name": "string",
  "slug": "string",
  "description": "text",
  "parentCategoryId": "UUID (optional)",
  "createdAt": "timestamp"
}
```

### Products

```json
{
  "productId": "UUID",
  "name": "string",
  "slug": "string",
  "description": "text",
  "price": "decimal",
  "discountPrice": "decimal",
  "stock": "integer",
  "sku": "string",
  "categoryId": "UUID",
  "sellerId": "UUID",
  "images": ["string"],
  "specifications": {"key": "value"},
  "tags": ["string"],
  "rating": "decimal",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🔐 Authentication Endpoints

| Method | Endpoint               | Access   | Description                     |
|--------|------------------------|----------|---------------------------------|
| POST   | `/api/auth/register`   | Public   | Register new user               |
| POST   | `/api/auth/login`      | Public   | Login and receive tokens        |
| POST   | `/api/auth/logout`     | Auth     | Logout and invalidate tokens    |
| POST   | `/api/auth/refresh-token` | Auth | Get new access token            |

## 🛍️ Product Endpoints

| Method | Endpoint                   | Access         | Description                     |
|--------|----------------------------|----------------|---------------------------------|
| GET    | `/api/products`            | Public         | List products with filters      |
| GET    | `/api/products/:productId` | Public         | Get product details             |
| POST   | `/api/products`            | Seller/Admin   | Create product with images      |
| PUT    | `/api/products/:productId` | Owner/Admin    | Update product                  |
| DELETE | `/api/products/:productId` | Owner/Admin    | Delete product                  |

## 📂 Category & User Endpoints

- `GET /api/categories` – Public
- `POST/PUT/DELETE /api/categories` – Admin only
- `GET/PUT /api/users/profile` – Authenticated
- `PUT /api/users/change-password` – Authenticated

## 🛡️ Security Middleware

- JWT Authentication & Role Authorization
- Input Validation
- Global Error Handler
- Rate Limiting (100 req/15min/IP)
- File Upload Validation
- CORS Configuration
- Helmet for HTTP headers

## 🧪 Postman Testing

- Environment variables: `baseURL`, `accessToken`, `refreshToken`, `userId`, `productId`
- Sample test script:
  ```js
  pm.environment.set("accessToken", pm.response.json().accessToken);
  pm.test("Status is 201", () => {
    pm.response.to.have.status(201);
  });
  ```

## 📁 Deliverables

- ✅ GitHub Repo with MVC structure
- ✅ Database scripts (migrations + seed data)
- ✅ README.md with setup and API docs
- ✅ Postman Collection with tests
- ✅ `.env.example` file
- ✅ Optional: Swagger docs, Docker setup

## 🛠 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/ecommerce-api.git
   cd ecommerce-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```

4. Run migrations and seed data:
   ```bash
   npm run migrate
   npm run seed
   ```

5. Start the server:
   ```bash
   npm start
   ```
