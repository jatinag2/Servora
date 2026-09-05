# Servora

![License](https://img.shields.io/badge/license-ISC-blue.svg)

A modern, scalable microservices-based application featuring a robust authentication system, rate limiting, user management, and automated email notifications.

---

## 🏗 Architecture Overview

Servora is composed of a React frontend and four distinct backend microservices connected via REST APIs and RabbitMQ message broker.

### 🌐 Frontend (`servora-frontend`)
*   React, Vite, TypeScript, TailwindCSS, Material UI, Redux Toolkit, and GSAP.
*   Communicates with the backend strictly through the API Gateway.

### ⚙️ Backend Microservices (`servora_backend/services`)
1.  **API Gateway** (`gateway-Service` | Port: 3000)
    *   Single entry point for client requests.
    *   Proxies requests to Auth and User services using `express-http-proxy`.
    *   Handles preliminary authentication validation.
2.  **Auth Service** (`auth-service` | Port: 3001)
    *   Core business logic for user authentication.
    *   Handles Sign-up, Login, OTP Generation, Rate Limiting, and JWT Session Management.
    *   Uses **MongoDB** for persistent records and **Redis** for caching and rate limiting.
    *   Publishes events to RabbitMQ.
3.  **Mail Service** (`mail-Service` | Port: 3002)
    *   Background worker processing email tasks.
    *   Listens to RabbitMQ queues and sends OTPs and alerts securely via Nodemailer (SMTP).
4.  **User Service** (`user-service` | Port: 3003)
    *   Handles user profile management, avatar uploads (Cloudinary).
    *   Listens/Publishes to RabbitMQ.
    *   Uses **MongoDB** for storage.

---

## 🛠 Tech Stack

**Frontend:**
*   React 19, TypeScript, Vite
*   TailwindCSS v4, Material UI, GSAP (Animations)
*   Redux Toolkit (State Management), React Router

**Backend:**
*   Node.js, Express, TypeScript
*   **Databases:** MongoDB Atlas (Mongoose)
*   **Cache & Rate Limiting:** Redis
*   **Message Broker:** RabbitMQ (`amqplib`)
*   **Media Storage:** Cloudinary
*   **Security:** bcrypt (password hashing), JWT (sessions)

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
*   [Redis](https://redis.io/) Server
*   [RabbitMQ](https://www.rabbitmq.com/) Server
*   Cloudinary Account (for image uploads)
*   Gmail / SMTP details (for sending emails)

### Installation & Setup

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies** across all services:
    ```bash
    # Install frontend dependencies
    cd servora-frontend
    npm install

    # Install backend dependencies
    cd ../servora_backend/services/gateway-Service && npm install
    cd ../auth-service && npm install
    cd ../mail-Service && npm install
    cd ../user-service && npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in each respective directory based on the templates provided in the **Environment Variables** section below.

4.  **Start the Services**:
    You need to start each service independently in separate terminal windows.
    ```bash
    # Gateway Service
    cd servora_backend/services/gateway-Service
    npm run dev

    # Auth Service
    cd servora_backend/services/auth-service
    npm run dev

    # Mail Service
    cd servora_backend/services/mail-Service
    npm run dev

    # User Service
    cd servora_backend/services/user-service
    npm run dev

    # Frontend
    cd servora-frontend
    npm run dev
    ```

---

## 🔐 Environment Variables

You must create a `.env` file in the root of each respective service.

### 1. `servora_backend/services/gateway-Service/.env`
```env
PORT=3000
SECREAT_KEY=your_jwt_secret
```

### 2. `servora_backend/services/auth-service/.env`
```env
PORT=3001
MONGOO_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
ACCESS_TOKEN_SECREAT_KEY=your_access_secret
REFRESH_TOKEN_SECREAT_KEY=your_refresh_secret
RABBITMQ_URL=amqp://localhost
```
*(Note: adjust Redis/RabbitMQ details if using hosted instances).*

### 3. `servora_backend/services/mail-Service/.env`
```env
PORT=3002
HOST_GMAIL=smtp.gmail.com
HOST_PORT=465
USER_GMAIL=your_email@gmail.com
PASS=your_app_password
RABBITMQ_URL=amqp://localhost
```

### 4. `servora_backend/services/user-service/.env`
```env
PORT=3003
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RABBITMQ_URL=amqp://localhost
```

---

## 🗄️ Database & Storage Scheme

### MongoDB (Persistent Storage)
*   **User Collection:** `fullName`, `email`, `password` (hashed), `role`, `resetToken`, `resetTokenExpiry`, `timestamps`.

### Redis (In-Memory Cache)
*   `redis_client {email}`: Stores 6-digit OTP for sign-up (5 min TTL).
*   `forgot_password_otp:{email}`: Stores OTP for password resets (5 min TTL).
*   `session:{userId}`: Stores JWT Refresh Token (7 days TTL).
*   `{ip_address}:req_count`: Tracks login attempts for rate limiting (Max 10 requests / 60 seconds).

---

## 🐛 Known Issues / Action Items
*   **Auth Middleware Bug:** The `auth-service` middleware (`src/middleware/auth.middleware.ts`) attempts to verify JWT tokens using `process.env.SECREAT_KEY`, but its `.env` file expects `ACCESS_TOKEN_SECREAT_KEY`. This needs to be patched so protected routes (like updating passwords) function properly.
