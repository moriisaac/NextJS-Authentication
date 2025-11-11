# Architecture Document

## Folder Structure

```
alovate-auth/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Route group for auth pages (doesn't affect URL)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page component
│   │   └── register/
│   │       └── page.tsx           # Registration page component
│   ├── (protected)/               # Route group for protected pages
│   │   ├── dashboard/
│   │   │   └── page.tsx          # User dashboard (authenticated users)
│   │   └── admin/
│   │       └── page.tsx          # Admin panel (ADMIN role only)
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth catch-all route
│   │   │       └── route.ts       # NextAuth API handler
│   │   └── register/
│   │       └── route.ts           # User registration endpoint
│   ├── layout.tsx                 # Root layout (wraps all pages)
│   ├── page.tsx                   # Home/landing page
│   └── globals.css                # Global styles
├── components/                    # React components
│   ├── auth/
│   │   └── LogoutButton.tsx       # Logout button component
│   ├── providers/
│   │   └── SessionProvider.tsx    # NextAuth session provider wrapper
│   └── ui/                        # Reusable UI components
│       ├── Button.tsx             # Button component
│       └── Input.tsx              # Input field component
├── lib/                           # Utility libraries
│   ├── auth.ts                    # NextAuth configuration
│   └── prisma.ts                  # Prisma client singleton
├── prisma/
│   └── schema.prisma              # Database schema definition
├── types/
│   └── next-auth.d.ts             # NextAuth TypeScript type extensions
├── middleware.ts                  # Next.js middleware (route protection)
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Component Explanation

### Route Groups

Next.js route groups (folders wrapped in parentheses like `(auth)`) allow us to organize routes without affecting the URL structure. This is useful for:
- Grouping related routes together
- Applying layouts to specific route groups
- Organizing code without changing URLs

**Example**: `app/(auth)/login/page.tsx` is accessible at `/login`, not `/(auth)/login`

### Server Components vs Client Components

**Server Components** (default):
- Run on the server only
- Can directly access databases and APIs
- Don't send JavaScript to the client
- Faster initial page load
- Example: `app/(protected)/dashboard/page.tsx`

**Client Components** (`'use client'`):
- Run in the browser
- Can use React hooks (useState, useEffect)
- Can handle user interactions
- Example: `components/auth/LogoutButton.tsx`

### Key Components

#### `app/layout.tsx`
Root layout that wraps all pages. Includes:
- SessionProvider to make auth session available throughout the app
- Global styles and fonts
- HTML structure

#### `middleware.ts`
Runs on every request before the page renders. Handles:
- Authentication checks
- Role-based route protection
- Redirects for unauthorized users

#### `lib/auth.ts`
NextAuth configuration including:
- Credentials provider (email/password)
- Password verification logic
- JWT token customization
- Session callbacks

#### `lib/prisma.ts`
Singleton Prisma client instance. Prevents multiple database connections in development.

#### `components/ui/Button.tsx` & `components/ui/Input.tsx`
Reusable UI components with consistent styling. Follow the composition pattern for flexibility.

## API Layer Design

### Endpoints

#### `POST /api/auth/[...nextauth]`
NextAuth catch-all route that handles:
- `/api/auth/signin` - Login endpoint
- `/api/auth/signout` - Logout endpoint
- `/api/auth/session` - Get current session
- `/api/auth/csrf` - CSRF token

**Security**: Built-in CSRF protection, secure cookie handling

#### `POST /api/register`
User registration endpoint.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "User with this email already exists"
}
```

**Security**:
- Input validation
- Password hashing (bcrypt)
- Email uniqueness check
- Error messages don't leak information

### Middleware

The `middleware.ts` file uses NextAuth's `withAuth` helper to:
1. Check authentication status on protected routes
2. Extract user role from JWT token
3. Enforce role-based access control
4. Redirect unauthorized users

**Protected Routes**:
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires ADMIN role

**Public Routes**:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Security Measures

1. **CSRF Protection**: NextAuth.js includes built-in CSRF protection
2. **Password Hashing**: bcrypt with 10 salt rounds
3. **Session Security**: JWT tokens signed with secret, stored in HTTP-only cookies
4. **Input Validation**: Both client and server-side validation
5. **SQL Injection Prevention**: Prisma uses parameterized queries
6. **Type Safety**: TypeScript prevents many runtime errors

## Data Flow

### Registration Flow

```
User → Register Page (Client)
  ↓
Form Submit → /api/register (Server)
  ↓
Validate Input → Check Existing User
  ↓
Hash Password (bcrypt) → Create User (Prisma)
  ↓
Return Success → Redirect to /login
```

### Login Flow

```
User → Login Page (Client)
  ↓
Form Submit → NextAuth signIn()
  ↓
NextAuth → authorize() in lib/auth.ts
  ↓
Query Database (Prisma) → Verify Password (bcrypt)
  ↓
Create JWT Token → Set HTTP-only Cookie
  ↓
Redirect to /dashboard
```

### Protected Route Access

```
User → Protected Route (/admin)
  ↓
Middleware Intercepts Request
  ↓
Check Session Token → Extract Role from JWT
  ↓
Verify Role Permission
  ↓
If Authorized → Render Page
If Unauthorized → Redirect to /dashboard
```

### Session Management

```
Page Load → getServerSession(authOptions)
  ↓
NextAuth Reads Cookie → Verify JWT Signature
  ↓
Decode Token → Extract User Data
  ↓
Return Session Object → Available in Component
```

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP Request
       ↓
┌─────────────────┐
│   Middleware    │ ← Checks auth & role
└──────┬──────────┘
       │
       │ If authorized
       ↓
┌─────────────────┐
│  Page Component │ ← Server Component
│  (Dashboard)    │
└──────┬──────────┘
       │
       │ getServerSession()
       ↓
┌─────────────────┐
│  NextAuth API   │ ← Verifies JWT
└──────┬──────────┘
       │
       │ Query
       ↓
┌─────────────────┐
│  Prisma Client  │
└──────┬──────────┘
       │
       │ SQL Query
       ↓
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

## Design Patterns

### Singleton Pattern
`lib/prisma.ts` uses the singleton pattern to ensure only one Prisma client instance exists, preventing connection pool exhaustion.

### Provider Pattern
`components/providers/SessionProvider.tsx` wraps the app to provide session context to all components.

### Composition Pattern
UI components (`Button`, `Input`) are composed with props for flexibility and reusability.

### Middleware Pattern
`middleware.ts` intercepts requests to add cross-cutting concerns (authentication, authorization) without modifying individual pages.

## Error Handling

### Client-Side
- Form validation with immediate feedback
- Try-catch blocks around async operations
- User-friendly error messages
- Loading states during async operations

### Server-Side
- Input validation before processing
- Database error handling
- Generic error messages (don't leak information)
- Proper HTTP status codes

### Error Flow
```
Error Occurs → Catch Block
  ↓
Log Error (Server) → Return Error Response
  ↓
Client Receives Error → Display to User
```

## Type Safety

TypeScript types are defined throughout:
- `types/next-auth.d.ts` - Extends NextAuth types with role
- Prisma generates types from schema
- Component props are typed
- API responses are typed

This ensures:
- Compile-time error detection
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring


