# JeanPay API Documentation

A comprehensive currency conversion and wallet management API supporting NGN ↔ GHS conversions with Paystack and Mobile Money integrations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint  | Description       | Auth Required |
| ------ | --------- | ----------------- | ------------- |
| POST   | `/signup` | Register new user | No            |
| POST   | `/login`  | User login        | No            |
| POST   | `/logout` | User logout       | Yes           |

**Signup Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+234XXXXXXXXX",
  "country": "NGN"
}
```

**Login Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 📊 Dashboard Routes (`/api/dashboard`)

| Method | Endpoint    | Description              | Auth Required |
| ------ | ----------- | ------------------------ | ------------- |
| GET    | `/overview` | Get dashboard overview   | Yes           |
| GET    | `/stats`    | Get dashboard statistics | Yes           |

### 💰 Wallet Routes (`/api/wallet`)

| Method | Endpoint    | Description                    | Auth Required |
| ------ | ----------- | ------------------------------ | ------------- |
| GET    | `/balance`  | Get wallet balance             | Yes           |
| POST   | `/topup`    | Top up wallet                  | Yes           |
| POST   | `/withdraw` | Withdraw from wallet           | Yes           |
| GET    | `/history`  | Get wallet transaction history | Yes           |

**Top Up Request:**

```json
{
  "amount": 50000,
  "currency": "NGN",
  "paymentMethod": "paystack",
  "paymentReference": "ref_123456"
}
```

**Withdraw Request:**

```json
{
  "amount": 1000,
  "currency": "GHS",
  "withdrawalMethod": "momo",
  "accountDetails": {
    "momoNumber": "+233XXXXXXXXX",
    "network": "MTN"
  }
}
```

### 🔄 Currency Conversion Routes (`/api/convert`)

| Method | Endpoint     | Description                 | Auth Required |
| ------ | ------------ | --------------------------- | ------------- |
| POST   | `/exchange`  | Convert currency            | Yes           |
| GET    | `/rates`     | Get current exchange rates  | No            |
| POST   | `/calculate` | Calculate conversion amount | No            |

**Conversion Request:**

```json
{
  "fromCurrency": "NGN",
  "toCurrency": "GHS",
  "amount": 50000
}
```

### 📋 Transaction Routes (`/api/transactions`)

| Method | Endpoint       | Description                       | Auth Required |
| ------ | -------------- | --------------------------------- | ------------- |
| GET    | `/all`         | Get all transactions (Admin)      | Admin         |
| GET    | `/history`     | Get user transaction history      | Yes           |
| GET    | `/details/:id` | Get transaction details           | Yes           |
| PUT    | `/status/:id`  | Update transaction status (Admin) | Admin         |

### 🔔 Notification Routes (`/api/notifications`)

| Method | Endpoint         | Description                    | Auth Required |
| ------ | ---------------- | ------------------------------ | ------------- |
| GET    | `/all`           | Get all notifications          | Yes           |
| PUT    | `/mark-read/:id` | Mark notification as read      | Yes           |
| PUT    | `/mark-all-read` | Mark all notifications as read | Yes           |

### ⚙️ Settings Routes (`/api/settings`)

| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| PUT    | `/update`          | Update user settings    | Yes           |
| PUT    | `/change-password` | Change user password    | Yes           |
| PUT    | `/preferences`     | Update user preferences | Yes           |

### 👑 Admin Routes (`/api/admin`)

#### Authentication

| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| POST   | `/login` | Admin login | No            |

#### Dashboard

| Method | Endpoint     | Description         | Auth Required |
| ------ | ------------ | ------------------- | ------------- |
| GET    | `/dashboard` | Get admin dashboard | Admin         |

#### Transaction Management

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| GET    | `/transactions/all`         | Get all transactions      | Admin         |
| GET    | `/transactions/details/:id` | Get transaction details   | Admin         |
| POST   | `/transactions/approve/:id` | Approve transaction       | Admin         |
| POST   | `/transactions/reject/:id`  | Reject transaction        | Admin         |
| PUT    | `/transactions/status/:id`  | Update transaction status | Admin         |

#### User Management

| Method | Endpoint             | Description      | Auth Required |
| ------ | -------------------- | ---------------- | ------------- |
| GET    | `/users/all`         | Get all users    | Admin         |
| GET    | `/users/details/:id` | Get user details | Admin         |
| POST   | `/users/block/:id`   | Block user       | Admin         |
| POST   | `/users/unblock/:id` | Unblock user     | Admin         |
| DELETE | `/users/delete/:id`  | Delete user      | Admin         |

#### Rate Management

| Method | Endpoint         | Description           | Auth Required |
| ------ | ---------------- | --------------------- | ------------- |
| GET    | `/rates/get`     | Get exchange rates    | Admin         |
| PUT    | `/rates/update`  | Update exchange rates | Admin         |
| GET    | `/rates/history` | Get rate history      | Admin         |

### 🔗 Webhook Routes (`/api/webhooks`)

| Method | Endpoint    | Description                  | Auth Required |
| ------ | ----------- | ---------------------------- | ------------- |
| POST   | `/paystack` | Handle Paystack webhooks     | No            |
| POST   | `/momo`     | Handle Mobile Money webhooks | No            |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## 📝 Response Format

All API responses follow this format:

```json
{
  "error": false,
  "message": "Success message",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "error": true,
  "message": "Error message",
  "data": null
}
```

## 🗄️ Database Schemas

### User Schema

- userId (string, unique)
- firstName, lastName (string)
- email (string, unique)
- password (string, hashed)
- phoneNumber (string)
- country (enum: NGN, GHS, etc.)
- isVerified, isActive, isAdmin, isBlocked (boolean)

### Wallet Schema

- userId (string, unique)
- balanceNGN, balanceGHS (number)
- totalDeposits, totalWithdrawals, totalConversions (number)
- isActive (boolean)
- lastTransactionAt (date)

### Transaction Schema

- userId, transactionId (string)
- amount (number)
- currency (string)
- status (enum: pending, completed, failed)
- transaction_type (enum: deposit, withdrawal, conversion, transfer)
- direction (enum: NGN_GHS, GHS_NGN, DEPOSIT_NGN, etc.)
- reference (string)
- description (string)

### Conversion Schema

- userId, conversionId, transactionId (string)
- from_currency, to_currency (string)
- amount, converted_amount, fee, rate (number)
- status (enum: pending, completed, failed)
- estimatedArrival (string)

## 🎯 Features

- ✅ User registration and authentication
- ✅ JWT-based authorization
- ✅ Wallet management (NGN & GHS)
- ✅ Currency conversion with live rates
- ✅ Transaction history and tracking
- ✅ Admin panel for transaction approval
- ✅ Paystack integration for NGN payments
- ✅ Mobile Money integration for GHS payments
- ✅ Webhook handling for real-time updates
- ✅ Comprehensive validation middleware
- ✅ User settings and preferences
- ✅ Notification system
- ✅ Admin user management
- ✅ Rate management system

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jeanpay
JWT_SECRET=your_jwt_secret_here
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
MOMO_API_KEY=your_momo_api_key
MOMO_SECRET=your_momo_secret
```

## 🚦 Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📋 Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Filtering

- `status` - Filter by status (pending, completed, failed)
- `type` - Filter by type (deposit, withdrawal, conversion)
- `currency` - Filter by currency (NGN, GHS)
- `fromDate` - Start date filter (ISO string)
- `toDate` - End date filter (ISO string)
- `search` - Search term for transactions/users

## 🛠️ Development

### Project Structure

```
src/
├── controllers/          # Route controllers
├── services/            # Business logic
├── middleware/          # Auth & validation middleware
├── routes/             # API routes
├── database/
│   └── schemas/        # MongoDB schemas
├── libs/               # Utility libraries
├── types/              # TypeScript type definitions
└── common/
    ├── constants/      # App constants
    └── util/          # Utility functions
```

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create service in `src/services/`
3. Add route paths to `src/common/constants/Paths.ts`
4. Create route file in `src/routes/pages/`
5. Import and use in `src/routes/index.ts`

## 🔄 Webhook Integration

### Paystack Webhook Example

```json
{
  "event": "charge.success",
  "data": {
    "reference": "ref_123456",
    "amount": 5000000,
    "currency": "NGN",
    "customer": {...}
  }
}
```

### Mobile Money Webhook Example

```json
{
  "event": "payment.success",
  "data": {
    "reference": "ref_123456",
    "amount": 1000,
    "currency": "GHS"
  }
}
```

## 📞 Support

For API support and questions, please contact the development team or refer to the project documentation.
