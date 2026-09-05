# Servora

A modern microservices-based application featuring a robust authentication system, rate limiting, and email notifications.

## Architecture Overview

Servora is composed of three main backend microservices (located in `servora_backend/services`) and a React frontend.

### Microservices
* **API Gateway** (`gateway-Service` | Port: 3000)
  * Acts as the single entry point for client requests.
  * Proxies authentication requests to the Auth Service using `http-proxy-middleware`.
* **Auth Service** (`auth-service` | Port: 3001)
  * Core business logic for user management.
  * Handles Sign-up, Login, OTP Generation, Rate Limiting, and Session Management.
  * Uses MongoDB for persistent user records and Redis for caching.
* **Mail Service** (`mail-Service` | Port: 3002)
  * Transactional email worker using Nodemailer.
  * Sends OTPs and password update alerts securely via an SMTP server.

## Tech Stack
* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB Atlas (Mongoose)
* **Cache & Rate Limiting:** Redis
* **Security:** bcrypt (password hashing), JWT (session management)
* **Frontend:** React + Vite, TypeScript, Material UI

## Database & Storage Scheme

### MongoDB (Persistent Storage)
* **User Collection:** `fullName`, `email`, `password` (hashed), `role`, `resetToken`, `resetTokenExpiry`, `timestamps`.

### Redis (In-Memory Cache)
* `redis_client {email}`: Stores 6-digit OTP for sign up (5 min TTL).
* `forgot_password_otp:{email}`: Stores OTP for password resets (5 min TTL).
* `session:{userId}`: Stores JWT Refresh Token (7 days TTL).
* `{ip_address}:req_count`: Tracks login attempts for rate limiting (Max 10 requests / 60 seconds).

## Environment Setup

Each backend service requires its own `.env` file to run correctly. 

**Gateway Service (`gateway-Service/.env`)**
```env
PORT=3000
SECREAT_KEY=your_jwt_secret
```

**Auth Service (`auth-service/.env`)**
```env
PORT=3001
MONGOO_DB_URI=mongodb+srv://<user>:<password>@cluster...
REDIS_HOST=...
REDIS_PORT=...
REDIS_USERNAME=...
REDIS_PASSWORD=...
ACCESS_TOKEN_SECREAT_KEY=your_access_secret
REFRESH_TOKEN_SECREAT_KEY=your_refresh_secret
```

**Mail Service (`mail-Service/.env`)**
```env
PORT=3002
HOST_GMAIL=smtp.gmail.com
HOST_PORT=465
USER_GMAIL=your_email@gmail.com
PASS=your_app_password
```

## Known Issues / Action Items
* **Auth Middleware Bug:** The `auth-service` middleware (`src/middleware/auth.middleware.ts`) attempts to verify JWT tokens using `process.env.SECREAT_KEY`, but its `.env` file only provides `ACCESS_TOKEN_SECREAT_KEY`. This needs to be patched so protected routes (like updating passwords) function properly.

## Getting Started
1. Run `npm install` in each service directory (`gateway-Service`, `auth-service`, `mail-Service`, and `servora-frontend`).
2. Configure the respective `.env` files for each service as outlined above.
3. Start each service using its standard dev script (typically `npm run dev` or `npm start` depending on `package.json` config).
4. Run the frontend application via Vite.
