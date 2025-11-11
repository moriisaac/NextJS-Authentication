# Specification Document

## System Goals

The ALOVATE Auth System is designed to provide a secure, production-ready authentication and authorization solution for SaaS applications. The primary goals are:

1. **Secure Authentication**: Implement robust user authentication with password hashing and secure session management
2. **Role-Based Authorization**: Control access to resources based on user roles (USER/ADMIN)
3. **Protected Routes**: Ensure only authenticated users can access certain pages
4. **Scalable Architecture**: Build a modular, maintainable codebase that can grow with the application
5. **Developer Experience**: Provide clear, well-documented code that's easy to understand and extend

## Features

### Core Features

- **User Registration**: New users can create accounts with email and password
- **User Login**: Existing users can authenticate with their credentials
- **User Logout**: Users can securely sign out, clearing their session
- **Role-Based Access Control**: Two roles (USER and ADMIN) with different permissions
- **Protected Routes**: Middleware and server-side checks protect sensitive pages
- **Session Management**: Secure JWT-based sessions managed by NextAuth.js

### Security Features

- Password hashing using bcrypt (10 salt rounds)
- CSRF protection (built into NextAuth.js)
- Secure session storage
- Input validation on both client and server
- SQL injection prevention via Prisma ORM

## Technology Choices

### Next.js 14+ (App Router)

**Why**: Next.js App Router provides modern React patterns with server components, API routes, and built-in optimizations. The App Router simplifies routing and enables better performance through server-side rendering.

**Benefits**:
- Server components reduce client-side JavaScript
- Built-in API routes for backend functionality
- Route groups for organizing protected/public routes
- Middleware support for route protection

### TypeScript

**Why**: TypeScript adds static type checking, catching errors at compile time rather than runtime. This improves code quality, maintainability, and developer experience.

**Benefits**:
- Type safety prevents common bugs
- Better IDE autocomplete and refactoring
- Self-documenting code through types
- Easier to onboard new developers

### NextAuth.js v4

**Why**: NextAuth.js is the industry standard for authentication in Next.js applications. It handles complex security concerns like CSRF protection, session management, and token handling.

**Benefits**:
- Battle-tested security practices
- JWT and database session support
- Easy to extend with custom providers
- Built-in CSRF protection
- TypeScript support

### Prisma

**Why**: Prisma is a type-safe ORM that generates TypeScript types from your database schema. It prevents SQL injection and provides excellent developer experience.

**Benefits**:
- Type-safe database queries
- Automatic migrations
- Excellent TypeScript integration
- Prevents SQL injection
- Database-agnostic (easy to switch databases)

### PostgreSQL

**Why**: PostgreSQL is a reliable, open-source relational database with ACID compliance. It's production-ready and widely supported.

**Benefits**:
- ACID compliance for data integrity
- Excellent performance
- Rich feature set
- Strong community support
- Works well with Prisma

### TailwindCSS

**Why**: TailwindCSS is a utility-first CSS framework that enables rapid UI development without writing custom CSS.

**Benefits**:
- Fast development
- Consistent design system
- Small bundle size (purges unused styles)
- Responsive design utilities
- Easy to maintain

## Authentication Flows

### Registration Flow

1. User visits `/register` page
2. User enters email and password (with confirmation)
3. Client validates password match and length
4. Form submits to `/api/register` endpoint
5. Server validates input and checks for existing user
6. Password is hashed using bcrypt (10 rounds)
7. User is created in database with default role `USER`
8. User is redirected to `/login` page

**Security Considerations**:
- Passwords are never stored in plain text
- Email uniqueness is enforced at database level
- Input validation on both client and server

### Login Flow

1. User visits `/login` page
2. User enters email and password
3. Form submits credentials to NextAuth.js
4. NextAuth calls the `authorize` function in `lib/auth.ts`
5. Server queries database for user by email
6. Password is verified using bcrypt.compare()
7. If valid, NextAuth creates a JWT session token
8. Session token is stored in HTTP-only cookie
9. User is redirected to `/dashboard`

**Security Considerations**:
- Passwords are compared using bcrypt (timing-safe)
- Generic error messages prevent user enumeration
- Session tokens are signed and encrypted
- HTTP-only cookies prevent XSS attacks

### Logout Flow

1. User clicks "Sign out" button
2. Client calls `signOut()` from NextAuth
3. NextAuth invalidates the session token
4. Cookie is cleared from browser
5. User is redirected to home page

### Authorization Flow

1. User attempts to access protected route (e.g., `/admin`)
2. Middleware intercepts the request
3. Middleware checks for valid session token
4. If no token, redirect to `/login`
5. If token exists, extract user role from JWT
6. Check if role has permission for the route
7. If ADMIN route and user is not ADMIN, redirect to `/dashboard`
8. If authorized, allow request to proceed

**Multiple Layers of Protection**:
- Middleware (first line of defense)
- Server-side session check in page components
- API route authentication checks

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

**Field Descriptions**:
- `id`: Unique identifier (CUID format)
- `email`: User's email address (unique, used for login)
- `password`: Hashed password (bcrypt hash)
- `role`: User's authorization level (USER or ADMIN)
- `createdAt`: Timestamp when user was created
- `updatedAt`: Timestamp when user was last updated

**Indexes**:
- `email` is unique (enforced at database level)

**Security Notes**:
- Passwords are hashed, never stored in plain text
- Email is unique to prevent duplicate accounts
- Default role is USER (admin must be set manually in database)


**Total Duration: 16 hours**

### Sprint 1: Project Setup (3 hours)
- Initialize Next.js project with TypeScript
- Install and configure dependencies
- Set up Prisma with PostgreSQL
- Create database schema
- Generate Prisma client

**Deliverables**: Working project structure, database connection

### Sprint 2: Authentication Flow (5 hours)
- Configure NextAuth.js
- Implement registration API endpoint
- Build login and register pages
- Set up session management
- Test authentication flows

**Deliverables**: Users can register and login

### Sprint 3: Authorization & Protected Routes (5 hours)
- Create middleware for route protection
- Implement role-based access control
- Build protected dashboard page
- Build admin-only page
- Test authorization logic

**Deliverables**: Protected routes with role-based access

### Sprint 4: Polish & Documentation (3 hours)
- Improve UI/UX
- Add error handling
- Write documentation (Spec, Architecture, README)
- Code review and refactoring
- Final testing

**Deliverables**: Complete, documented, production-ready system

## Success Criteria

- [x] Users can register with email and password
- [x] Users can login with valid credentials
- [x] Users can logout securely
- [x] Protected routes require authentication
- [x] Admin routes require ADMIN role
- [x] Passwords are securely hashed
- [x] Sessions are managed securely
- [x] Code is well-documented and type-safe
- [x] All documentation is complete


