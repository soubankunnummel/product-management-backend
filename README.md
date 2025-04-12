# Product Management Backend

This is the backend for a product management system built using the **MERN stack**. It provides APIs for managing products, categories, subcategories, and users.

## Features

- User authentication and authorization (JWT-based).
- CRUD operations for products, categories, and subcategories.
- Pagination, filtering, and search functionality for products.
- MongoDB database integration using Mongoose.
- Error handling and input validation.
- Secure API with rate limiting and CORS.

---

## Tech Stack

- **Node.js**: Backend runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB.
- **TypeScript**: Strongly typed JavaScript.
- **JWT**: Authentication and authorization.
- **Postman**: API testing and documentation.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/product-management-backend.git
   cd product-management-backend
   ```

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

```markdown
# MongoDB

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/product-management?retryWrites=true&w=majority

# JWT

JWT_SECRET=<your-secret-key>
JWT_EXPIRE=30d

# Port

PORT=8080
```

---

## Project Structure

```
src/
├── config/         # Database connection and configuration
├── controller/     # API controllers
├── middleware/     # Custom middleware (e.g., error handling, authentication)
├── models/         # Mongoose models
├── routes/         # API routes
├── service/        # Business logic and database queries
├── utils/          # Utility functions (e.g., logger)
├── validations/    # Request validation schemas
└── app.ts          # Express app setup
```

---

## API Endpoints

### Authentication

- **POST /api/v1/auth/register**: Register a new user.
- **POST /api/v1/auth/login**: Login and get a JWT token.

### Products

- **GET /api/v1/products**: Get all products (supports pagination and filtering).
- **GET /api/v1/products/:id**: Get a single product by ID.
- **POST /api/v1/products**: Create a new product.
- **PUT /api/v1/products/:id**: Update a product.
- **DELETE /api/v1/products/:id**: Delete a product.

### Categories

- **GET /api/v1/categories**: Get all categories.
- **POST /api/v1/categories**: Create a new category.
- **GET /api/v1/categories/:id/subcategories**: Get subcategories for a category.

### Search

- **GET /api/v1/products/search?q=<query>**: Search for products by title or description.

---

### **How to Use This**

1. Save the above content in a `README.md` file in the root of your project.
2. Replace placeholders like `<username>`, `<password>`, `<your-secret-key>`, and contact details with your actual information.
3. Add or remove sections as needed based on your project.

Let me know if you need further customization!
