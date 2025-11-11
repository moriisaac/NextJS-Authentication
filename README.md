# ALOVATE Auth System

A secure authentication and authorization system built with Next.js 14, TypeScript, NextAuth.js, Prisma, and PostgreSQL. This project demonstrates production-ready authentication with role-based access control.

## Features

- ✅ User registration and login
- ✅ Secure password hashing (bcrypt)
- ✅ JWT-based session management
- ✅ Role-based authorization (USER/ADMIN)
- ✅ Protected routes with middleware
- ✅ Type-safe database queries with Prisma
- ✅ Modern UI with TailwindCSS

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ (local installation or cloud database)
- **Git** (optional, for version control)

## Installation

### 1. Clone or Navigate to the Project

```bash
cd alovate-auth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Docker PostgreSQL Configuration (for docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=alovate_auth
POSTGRES_PORT=5433

# Database Connection String
# Use the same credentials as above for Docker setup
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Important Security Notes**: 
- **Never use default passwords in production!** Generate strong, unique passwords
- Replace `your-secure-password-here` with a strong password (use: `openssl rand -base64 32`)
- Generate a secure `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
- The default values in docker-compose.yml are for development only
- For production, always use environment variables with strong credentials

### 4. Set Up the Database

**Option A: Using Docker (Recommended for Development)**

```bash
# Start PostgreSQL container with docker-compose
docker-compose up -d

# The database will be created automatically with the credentials from .env
```

**Option B: Using Local PostgreSQL**

```bash
# Using psql
createdb alovate_auth

# Or using SQL
psql -U postgres
CREATE DATABASE alovate_auth;
```

### 5. Run Database Migrations

Generate Prisma client and create database tables:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will:
- Generate the Prisma Client
- Create the `User` table in your database
- Set up the `Role` enum

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Your First User

1. Navigate to [http://localhost:3000/register](http://localhost:3000/register)
2. Enter an email and password (minimum 6 characters)
3. Click "Sign up"
4. You'll be redirected to the login page

### Logging In

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to the dashboard

### Testing Role-Based Access

#### Create an Admin User

To test admin functionality, you need to manually update a user's role in the database:

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio
```

Or use SQL:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

#### Test Protected Routes

- **Dashboard** (`/dashboard`): Accessible to all authenticated users
- **Admin Panel** (`/admin`): Only accessible to users with ADMIN role
- **Unauthenticated users**: Redirected to `/login`

### Project Structure

```
alovate-auth/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (protected)/      # Protected pages (dashboard, admin)
│   ├── api/              # API routes
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities (auth, prisma)
├── prisma/              # Database schema
└── docs/                # Documentation
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed structure explanation.

## Testing

### Manual Testing Checklist

- [ ] Register a new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Access dashboard while authenticated
- [ ] Access dashboard while not authenticated (should redirect)
- [ ] Access admin panel as regular user (should redirect)
- [ ] Access admin panel as admin user (should work)
- [ ] Logout and verify session is cleared

### Creating Test Users

You can create test users via the registration page or directly in the database:

```sql
-- Note: Password must be bcrypt hashed
-- Use the registration API or page to create users properly
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `POSTGRES_USER` | PostgreSQL username (for Docker) | No | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password (for Docker) | No* | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name (for Docker) | No | `alovate_auth` |
| `POSTGRES_PORT` | PostgreSQL port (for Docker) | No | `5433` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NEXTAUTH_URL` | Your app's URL (http://localhost:3000 for dev) | Yes | - |
| `NEXTAUTH_SECRET` | Secret key for JWT signing | Yes | - |

\* **Security Warning**: The default password is for development only. Always set a strong password in production!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Documentation

- [Specification Document](./docs/SPECIFICATION.md) - System goals, tech choices, and flows
- [Architecture Document](./docs/ARCHITECTURE.md) - Code structure and design decisions

## Security Considerations

This implementation includes:

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ CSRF protection (NextAuth built-in)
- ✅ Secure session storage (HTTP-only cookies)
- ✅ Input validation (client and server)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ Type safety (TypeScript)

**For Production This is to be adhered to**:
- **Change all default passwords** - Never use `postgres`/`postgres` in production
- Use environment variables for all secrets (never commit `.env` files)
- Generate strong passwords using `openssl rand -base64 32`
- Enable HTTPS
- Set secure cookie flags
- Implement rate limiting
- Add email verification
- Consider 2FA for admin accounts
- Use a secrets management service (AWS Secrets Manager, HashiCorp Vault, etc.)

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -U username -d alovate_auth
```

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### NextAuth Issues

- Ensure `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your app URL
- Verify database connection

## Future Improvements

If I had more time, here's what I could have improved:

### Security Enhancements
- [ ] Email verification before account activation
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Session timeout and refresh tokens

### Features
- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] User profile management
- [ ] Password strength requirements
- [ ] Remember me functionality
- [ ] Activity logging
- [ ] Admin user management UI

### Developer Experience
- [ ] Unit tests (Jest/Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Error tracking (Sentry)
- [ ] Logging system

### Performance
- [ ] Database connection pooling
- [ ] Caching layer (Redis)
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Code splitting optimization

### UI/UX
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Form validation feedback
- [ ] Responsive design improvements
- [ ] Dark mode
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)


## License

This project is created by Mori Isaac Wesonga

## Support



For questions or issues, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
