# 🚀 Servexa — Field Service Management Platform

A full-stack **Field Service Management (FSM)** platform built with **Next.js, TypeScript, Express.js, PostgreSQL, Prisma, and bKash**.

Servexa connects customers with field technicians through a role-based workflow for service requests, work orders, technician assignments, scheduling, invoicing, payments, notifications, and administrative management.

---

## 🌐 Live Application

- **Frontend:** https://servexa-frontend.vercel.app/
- **Backend API:** https://servexa-backend.vercel.app/

### Local Backend

The backend runs on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

---

## ✨ Features

### 👥 Role-Based Access

Servexa supports three roles:

- Customer
- Technician
- Admin

Each role has its own protected dashboard and permissions.

### 👤 Customer Features

Customers can:

- Register and log in
- Sign in with Google
- Manage their profile
- Manage saved addresses
- Browse available services
- View service details
- Submit service requests
- Track service-request status
- Cancel eligible service requests
- View work orders
- Track work-order progress
- View invoices
- Make payments through bKash
- View payment history
- Receive notifications
- Mark notifications as read
- View their service-related information from the dashboard

### 🧑‍🔧 Technician Features

Technicians can:

- Log in securely
- Access a protected technician dashboard
- View assigned jobs
- View work-order details
- Update work-order status
- Manage availability
- View and update their technician profile
- View notifications
- Track their assigned field-service work

### 🛡️ Admin Features

Admins can:

- Access the admin dashboard
- View platform statistics
- Manage users
- Activate/deactivate users
- Change eligible user roles
- Manage technicians
- Activate/deactivate technicians
- Manage services
- Review service requests
- Manage work orders
- Manage technician assignments
- Create and manage invoices
- View payments
- View audit logs
- Review platform activity
- Manage notifications
- Monitor operational information through dashboard statistics and visualizations

---

## 🔄 Core Service Workflow

Servexa follows a structured field-service workflow:

```text
Customer
   ↓
Browse Services
   ↓
Create Service Request
   ↓
Admin Reviews Request
   ↓
Work Order Created
   ↓
Technician Assigned
   ↓
Technician Performs Service
   ↓
Work Order Status Updated
   ↓
Invoice Created
   ↓
Customer Makes Payment
   ↓
Payment Verified
   ↓
Invoice Updated
   ↓
Service Completed
```

This workflow allows the platform to represent a realistic field-service business process instead of functioning as a simple CRUD application.

---

## 💳 Payment System

Servexa integrates bKash for customer payments.

The payment flow includes:

1. Customer views an issued invoice.
2. Customer initiates payment.
3. Backend creates the payment request.
4. Customer is redirected to the bKash payment flow.
5. bKash processes the transaction.
6. The backend receives the payment callback.
7. Payment information is verified.
8. The payment record is updated.
9. The associated invoice is updated.
10. The customer is redirected to the payment result page.

The backend stores payment information including:

- Payment ID
- Invoice ID
- Amount
- Currency
- Provider
- Payment status
- Transaction ID
- Gateway reference
- Gateway response
- Paid timestamp
- Refund timestamp
- Creation/update timestamps

---

## 🔐 Authentication & Authorization

Servexa implements secure authentication and authorization.

### Authentication

Supported authentication methods include:

- Email/password authentication
- Google authentication
- Access-token based authentication
- Refresh-token flow
- Logout

### Authorization

Role-based authorization is implemented for:

- Customer
- Technician
- Admin

Protected API routes verify the authenticated user before allowing access.

The application also applies object-level authorization where users should only access resources belonging to them or resources assigned to their role.

---

## 🧰 Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- TanStack Query
- Zustand / Context where required
- React Hook Form
- Zod
- Sonner
- Lucide React
- Vercel

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- JWT
- Google OAuth
- bKash
- Helmet
- CORS
- Cookie Parser
- HTTP Status
- Rate Limiting
- Vercel

---

## 🏗️ Architecture

Servexa is divided into two main applications:

```text
Servexa
│
├── Frontend
│   ├── Next.js
│   ├── TypeScript
│   ├── App Router
│   ├── TanStack Query
│   ├── React Hook Form
│   ├── Zod
│   └── Tailwind CSS
│
└── Backend
    ├── Express.js
    ├── TypeScript
    ├── PostgreSQL
    ├── Prisma
    ├── JWT
    ├── Google Authentication
    ├── bKash
    └── REST API
```

---

## 🖥️ Frontend Architecture

The frontend uses the Next.js App Router.

Server Components are used by default, while Client Components are introduced when browser-side interactivity or client-side state is required.

The application separates public pages from dashboard pages.

A simplified structure looks like:

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── login/
│   │   ├── register/
│   │   └── payment/
│   │
│   ├── dashboard/
│   │   ├── customer/
│   │   ├── technician/
│   │   └── admin/
│   │
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
├── hooks/
├── lib/
├── providers/
├── services/
└── types/
```

---

## 📊 Data Fetching

The application uses TanStack Query for client-side server-state management where interactive client-side fetching is required.

For Server Components, server-side API utilities are used where appropriate.

The frontend API layer provides separate utilities for:

- Client-side API requests
- Server-side API requests
- Full API responses including pagination metadata

This keeps API communication consistent across the application.

---

## 🔄 API Response Structure

The backend follows a consistent API response structure.

Example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

The frontend defines reusable TypeScript types for API responses and pagination metadata.

---

## 📝 Form Handling

Forms are implemented using:

- React Hook Form
- Zod validation

This provides:

- Client-side validation
- Typed form values
- Reusable validation schemas
- Consistent error handling
- Better form-state management

---

## 🧭 Dashboard Structure

### Customer Dashboard

```text
/dashboard/customer
/dashboard/customer/services
/dashboard/customer/requests
/dashboard/customer/work-orders
/dashboard/customer/invoices
/dashboard/customer/payments
/dashboard/customer/notifications
/dashboard/customer/profile
```

### Technician Dashboard

```text
/dashboard/technician
/dashboard/technician/jobs
/dashboard/technician/availability
/dashboard/technician/earnings
/dashboard/technician/notifications
/dashboard/technician/profile
```

### Admin Dashboard

```text
/dashboard/admin
/dashboard/admin/users
/dashboard/admin/technicians
/dashboard/admin/services
/dashboard/admin/requests
/dashboard/admin/work-orders
/dashboard/admin/assignments
/dashboard/admin/invoices
/dashboard/admin/payments
/dashboard/admin/audit-logs
/dashboard/admin/notifications
```

---

## 📄 Application Pages

The application contains functional pages for the main platform workflows, including:

### Public Pages

- Home
- About
- Services
- Service Details
- Contact
- FAQ
- Login
- Register
- Payment Result
- Not Found

### Customer Pages

- Customer Dashboard
- Services
- Service Requests
- Work Orders
- Invoices
- Payments
- Notifications
- Profile / Settings

### Technician Pages

- Technician Dashboard
- My Jobs
- Availability
- Earnings / Analytics
- Notifications
- Profile / Settings

### Admin Pages

- Admin Dashboard
- Users
- Technicians
- Services
- Service Requests
- Work Orders
- Assignments
- Invoices
- Payments
- Audit Logs
- Notifications

---

## 🧩 Backend Architecture

The backend follows a modular Express.js architecture.

A simplified structure:

```text
src/
├── app/
│   ├── config/
│   ├── lib/
│   ├── middleware/
│   ├── module/
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── addresses/
│   │   ├── services/
│   │   ├── service-requests/
│   │   ├── work-orders/
│   │   ├── technicians/
│   │   ├── availability/
│   │   ├── assignments/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── notifications/
│   │   ├── notes/
│   │   └── admin/
│   │
│   └── utils/
│
├── app.ts
└── server.ts
```

Each major backend module follows a separation of concerns between:

- Routes
- Controllers
- Services
- Validation
- Interfaces / Types

---

## 🔌 API Modules

The backend exposes REST APIs under:

```text
/api/v1
```

Main API modules include:

```text
/api/v1/auth
/api/v1/customers
/api/v1/addresses
/api/v1/services
/api/v1/service-requests
/api/v1/work-orders
/api/v1/technicians
/api/v1/availabilities
/api/v1/assignments
/api/v1/invoices
/api/v1/payments
/api/v1/notifications
/api/v1/notes
/api/v1/admin
```

### 🔑 Authentication Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/google
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### 👥 Customer Endpoints

```text
GET   /api/v1/customers/me
PATCH /api/v1/customers/me
```

### 📍 Address Endpoints

```text
GET    /api/v1/addresses
POST   /api/v1/addresses
GET    /api/v1/addresses/:id
PATCH  /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
```

### 🛠️ Service Endpoints

Public service browsing:

```text
GET /api/v1/services
GET /api/v1/services/:id
```

Admin service management is also supported through the service module.

### 📋 Service Request Endpoints

```text
GET    /api/v1/service-requests
GET    /api/v1/service-requests/:id
POST   /api/v1/service-requests
PATCH  /api/v1/service-requests/:id
PATCH  /api/v1/service-requests/:id/cancel
```

These endpoints support the customer request lifecycle and administrative management.

### 🔧 Work Order Endpoints

```text
POST  /api/v1/work-orders
GET   /api/v1/work-orders
GET   /api/v1/work-orders/:id
PATCH /api/v1/work-orders/:id
PATCH /api/v1/work-orders/:id/status
```

Work orders can be viewed according to the authenticated user's role.

### 🧑‍🔧 Technician Endpoints

```text
GET   /api/v1/technicians
GET   /api/v1/technicians/:technicianId
GET   /api/v1/technicians/technician-profile/me
PATCH /api/v1/technicians/me
PATCH /api/v1/technicians/:technicianId/status
```

Technician profiles contain information such as:

- Name
- Phone
- Employee code
- Active status
- User account information

### 🗓️ Availability

Technician availability is handled through:

```text
/api/v1/availabilities
```

Technicians can manage their availability information through the protected availability workflow.

### 👷 Assignment Management

Assignments connect technicians with work orders.

```text
GET    /api/v1/assignments/work-orders/:workOrderId
POST   /api/v1/assignments/work-orders/:workOrderId
DELETE /api/v1/assignments/:assignmentId/work-orders/:workOrderId
```

This allows administrators to assign and unassign technicians from work orders.

### 🧾 Invoice Management

Customer invoices:

```text
GET /api/v1/invoices/customers/me
GET /api/v1/invoices/:id
```

Admin invoice operations include:

```text
GET   /api/v1/invoices
POST  /api/v1/invoices/work-orders/:workOrderId
PATCH /api/v1/invoices/admin/:id
GET   /api/v1/invoices/:id
```

### 💰 Payment Endpoints

Customer payment history:

```text
GET /api/v1/payments/me
```

Payment initiation:

```text
POST /api/v1/payments/invoices/:invoiceId
```

Admin payment history:

```text
GET /api/v1/admin/payments
```

### 🔔 Notification Endpoints

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
POST  /api/v1/notifications
```

Notifications provide role-aware communication throughout the platform.

### 📝 Work Order Notes

Notes can be used as part of work-order/service workflows.

The backend exposes the notes module under:

```text
/api/v1/notes
```

### 🛡️ Admin Endpoints

Admin dashboard:

```text
GET /api/v1/admin/dashboard
```

User management:

```text
GET   /api/v1/admin/users
PATCH /api/v1/admin/users/:userId/status
PATCH /api/v1/admin/users/:userId/role
```

Technician management:

```text
GET   /api/v1/admin/technicians
PATCH /api/v1/admin/technicians/:technicianId/status
```

Payment management:

```text
GET /api/v1/admin/payments
```

Audit logs:

```text
GET /api/v1/admin/audit-logs
```

All admin endpoints require administrator authorization.

---

## 🗃️ Database

Servexa uses:

- PostgreSQL
- Prisma ORM

The database contains entities supporting:

- Users
- Customers
- Technicians
- Addresses
- Services
- Service Requests
- Work Orders
- Assignments
- Availability
- Invoices
- Payments
- Notifications
- Notes
- Audit Logs

Prisma is responsible for:

- Database schema management
- Type-safe database queries
- Relations
- Transactions
- Data persistence

### 💳 Payment Model

The payment database model contains:

```text
Payment
├── id
├── invoiceId
├── amount
├── currency
├── provider
├── status
├── transactionId
├── gatewayReference
├── gatewayResponse
├── paidAt
├── refundedAt
├── createdAt
└── updatedAt
```

Payment records are connected to invoices through a Prisma relation.

---

## 📊 Admin Dashboard

The admin dashboard provides operational statistics including:

- Total users
- Total customers
- Total technicians
- Active technicians
- Pending service requests
- Active work orders
- Completed work orders
- Issued invoices
- Paid invoices
- Pending payments
- Paid payments

The dashboard also provides visualized administrative information for easier monitoring.

---

## 🧾 Audit Logging

Servexa includes an audit-log system for tracking important administrative operations.

Audit logs contain information such as:

```text
id
actorId
action
entity
entityId
oldValue
newValue
createdAt
```

The admin audit-log page supports pagination and filtering through the backend API.

---

## 📄 Pagination

Paginated API endpoints return metadata such as:

```json
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5
}
```

The frontend has reusable TypeScript types for paginated API responses.

---

## 🔍 Search, Filtering & Query Parameters

The backend supports query-based filtering for relevant administrative resources.

For example, user management supports:

```text
page
limit
role
isActive
search
```

Audit logs support:

```text
page
limit
entity
entityId
actorId
```

The frontend synchronizes relevant filtering, searching, sorting, and pagination state with the API where applicable.

---

## 🛡️ Backend Security

The backend includes several security measures:

- JWT authentication
- Role-based authorization
- Object-level authorization
- Helmet
- CORS configuration
- Rate limiting
- Cookie parsing
- Zod request validation
- Protected routes
- Server-side permission checks
- Consistent error handling

---

## ⚠️ Error Handling

The backend uses centralized error handling.

The frontend provides:

- API error messages
- Toast notifications
- Empty states
- Loading skeletons
- Error boundaries
- Not-found handling

The goal is to ensure that API failures and unexpected UI errors do not result in confusing or broken user experiences.

---

## ⏳ Loading States

Data-fetching pages use loading states and skeleton UI where appropriate.

Examples include:

- Dashboard loading
- Table loading
- Service loading
- Invoice loading
- Payment loading
- User management loading
- Technician management loading
- Audit-log loading

---

## 📭 Empty States

List and table views provide meaningful empty states when there is no data.

Examples include:

- No service requests
- No work orders
- No invoices
- No payments
- No notifications
- No technicians
- No audit logs

---

## 📱 Responsive Design

The frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Dashboard interfaces use responsive layouts so important information remains usable across different screen sizes.

---

## ♿ Accessibility

The UI follows common accessibility practices where applicable, including:

- Semantic HTML
- Proper button usage
- Form labels
- Accessible interactive elements
- Keyboard-friendly controls
- Meaningful empty/error states

---

## 🔎 SEO

Public pages use Next.js metadata where appropriate.

The application includes a global metadata configuration with:

```text
Servexa
Field Service Management Platform
```

Public-facing pages can define page-specific metadata when necessary.

---

## 🌎 Environment Variables

### Frontend `.env.local`

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=GOOGLE CLIENT ID
```

For the deployed application, configure the corresponding environment variables in the Vercel project settings.

Do not commit `.env.local` or real credentials to the repository.

### ⚙️ Backend `.env`

Create:

```text
.env
```

The backend requires environment variables for the application's:

- Database connection
- JWT configuration
- Google authentication
- bKash configuration
- Client URL
- Server configuration

Example structure:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=YOUR_POSTGRESQL_DATABASE_URL

JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

BKASH_APP_KEY=YOUR_BKASH_APP_KEY
BKASH_APP_SECRET=YOUR_BKASH_APP_SECRET
BKASH_USERNAME=YOUR_BKASH_USERNAME
BKASH_PASSWORD=YOUR_BKASH_PASSWORD
BKASH_BASE_URL=YOUR_BKASH_BASE_URL

CLIENT_URL=http://localhost:3000
```

Use the actual variable names required by the backend configuration in the project.

Never commit real secrets, API keys, database credentials, OAuth secrets, JWT secrets, or payment credentials to Git.

---

## 📦 Package Managers

The project intentionally uses different package managers for the two applications.

### Frontend

```text
Bun
```

### Backend

```text
pnpm
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd servexa
```

The frontend and backend should be available as their respective project directories.

### 🎨 Frontend Setup

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies with Bun:

```bash
bun install
```

Create `.env.local` and configure:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=GOOGLE CLIENT ID
```

Start the development server:

```bash
bun dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

### ⚙️ Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies with pnpm:

```bash
pnpm install
```

Create the backend `.env` file and configure the required environment variables.

Run Prisma migrations as required by the project:

```bash
pnpm prisma migrate dev
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Start the development server:

```bash
pnpm dev
```

The backend will run on:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api/v1
```

---

## 🏭 Production Build

### Frontend

Build the Next.js application:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

### Backend

Build the TypeScript backend:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

---

## ☁️ Deployment

### Frontend

The frontend is deployed using Vercel.

Live URL:

https://servexa-frontend.vercel.app/

Required frontend environment variables should be configured through Vercel project settings.

### Backend

The backend is deployed using Vercel.

Live URL:

https://servexa-backend.vercel.app/

The backend requires the production environment variables to be configured through the deployment platform.

---

## 🔗 Frontend ↔ Backend Communication

### Local Development

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api/v1
```

Frontend environment:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1
```

### Production

Frontend:

```text
https://servexa-frontend.vercel.app/
```

Backend:

```text
https://servexa-backend.vercel.app/
```

---

## 🧪 API Testing

The backend REST APIs can be tested using tools such as:

- Postman
- Swagger / API documentation where configured
- Browser for public GET endpoints
- Frontend application

Protected endpoints require appropriate authentication.

---

## 🔐 Demo / Test Accounts

For evaluation, use the demo credentials provided with the project/assignment submission.

The application supports role-specific access for:

- Customer
- Technician
- Admin

Replace this section with the actual demo credentials before submitting the project if the evaluator requires credentials directly inside the README.

---

## 🧑‍💻 Development Principles

The project follows several development principles:

- TypeScript-first development
- Strict typing
- No unnecessary `any`
- Modular backend architecture
- Reusable frontend components
- Reusable API utilities
- Server Components by default in Next.js
- Client Components only when interaction/state requires them
- Centralized API endpoint definitions
- Schema-based validation
- Role-based access control
- Object-level authorization
- Consistent API responses
- Centralized error handling
- Reusable loading and empty states
- Responsive UI
- Secure environment-variable handling

---

## 📁 Important Frontend Utilities

The frontend includes dedicated API utilities for different rendering environments.

### Client API

```text
src/lib/api.ts
```

Used for browser/client-side API requests.

### Server API

```text
src/lib/api-server.ts
```

Used only from Server Components/server-side code that needs access to request cookies.

### API Endpoints

```text
src/app/lib/endpoints.ts
```

Centralizes backend endpoint definitions.

### Services

```text
src/services/
```

Contains domain-specific API service functions.

### Hooks

```text
src/hooks/
```

Contains reusable client-side hooks where interactive data fetching or state management is required.

---

## 🧱 Reusable Components

The frontend uses reusable components for common UI and business functionality, including:

- Navigation
- Dashboard layout
- Tables
- Cards
- Forms
- Dialogs
- Loading skeletons
- Empty states
- Error states
- Status indicators
- Payment actions
- Service displays
- Work-order displays
- Notification UI

This avoids unnecessary duplication between dashboard pages.

---

## 🧑‍🔧 Technician Data Model

A technician is connected to a user account and can have:

```text
Technician
├── id
├── userId
├── name
├── phone
├── employeeCode
├── isActive
├── assignments
├── availabilities
├── createdAt
└── updatedAt
```

The user account controls authentication and role information, while the technician entity stores technician-specific information.

---

## 👤 User Management

Admins can manage users through:

```text
/dashboard/admin/users
```

Supported operations include:

- User listing
- Pagination
- Search
- Role filtering
- Active/inactive filtering
- User activation/deactivation
- Eligible role changes

Changing a user's role to `TECHNICIAN` can create or activate the corresponding technician profile.

---

## 🧑‍🔧 Technician Management

Admins can manage technicians through:

```text
/dashboard/admin/technicians
```

The technician management workflow supports:

- Technician listing
- Technician details
- Active/inactive status
- Technician account information
- Technician-specific profile data

---

## 📝 Service Request Lifecycle

A service request can move through its business workflow according to the backend's supported statuses.

The customer can:

```text
Create Request
      ↓
Track Request
      ↓
Wait for Admin Review
      ↓
Cancel When Eligible
```

After administrative processing, a work order can be created from the service request.

---

## 🔧 Work Order Lifecycle

Work orders support operational statuses such as:

```text
OPEN
SCHEDULED
ASSIGNED
EN_ROUTE
IN_PROGRESS
ON_HOLD
COMPLETED
```

The exact allowed transitions are enforced by the backend business logic.

---

## 🧾 Invoice & Payment Relationship

The payment system is connected to invoices.

The relationship is:

```text
Work Order
    ↓
Invoice
    ↓
Payment
    ↓
bKash
```

This allows Servexa to keep the billing lifecycle connected to the service lifecycle.

---

## 🔔 Notifications

Notifications provide a centralized way to communicate important updates to users.

Users can:

- View notifications
- Mark individual notifications as read
- Mark all notifications as read

Admins can create notifications through the protected administrative workflow.

---

## 🧠 Business Logic

The project contains business logic beyond basic CRUD operations, including:

- Role-based workflows
- Service-request processing
- Work-order creation
- Technician assignment
- Technician availability
- Invoice generation
- Payment initiation
- Payment verification
- Invoice/payment status synchronization
- User role changes
- Technician profile creation
- Audit logging
- Notification management

---

## 📌 API Base URL

All backend APIs are prefixed with:

```text
/api/v1
```

Local:

```text
http://localhost:5000/api/v1
```

Production:

```text
https://servexa-backend.vercel.app/api/v1
```

---

## 📜 License

This project was developed as a full-stack Field Service Management application project.

---

## 👨‍💻 Author

**Abdul Rehman Aarmaan**

Full-Stack / MERN Developer

- GitHub: https://github.com/abdulrehmanaarmaan
- LinkedIn: https://www.linkedin.com/in/abdul-rehman-aarmaan/

---

## ⭐ Servexa

Servexa is designed to demonstrate a complete field-service management workflow with:

```text
Authentication
      +
Role-Based Access Control
      +
Service Management
      +
Service Requests
      +
Work Orders
      +
Technician Assignment
      +
Availability
      +
Invoices
      +
bKash Payments
      +
Notifications
      +
Audit Logs
      +
Admin Analytics
```

The platform combines a modern Next.js frontend with a modular Express.js backend and PostgreSQL database to provide an end-to-end field-service management solution.


Need to check Google Auth.
Need to link for url query.


payment - invoice - work order - service request - service - admin

nEED TO add adrrss for customer.

Need to check the refresh button in each of the dasboard routes.

Need to explain the workflow in demo video.

Need to verify paginations.

Need to show services in the services route

Need to work in the profile's dashboard of the 3 roles.
Need to think for he patch api of the customer's address.
Need to add the feature of role changing in admin dashboard and modify the registration form.
Need to check the dashboard sidebar and topbar for samller deices.
Need to check work-order's route of customer.
Need to check the payment's route of admin dashboard.

Need to work on the replace function after login and registration...

20 commits and demo video.

Need to redirect the user based on the value of callback in login.

frontend modification for changing status of work order.

In production, need to check backing after redirection after login

Better to show clear error toasts in production...