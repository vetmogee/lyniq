# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (Supabase PostgreSQL)
# Get these from your Supabase project settings > Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
DIRECT_URL="postgresql://user:password@host:port/database?schema=public"

# Supabase
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Next.js (optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Copy your service role key (keep this secret!)
5. Go to Project Settings > Database
6. Copy your connection string (use the "Connection string" tab, "URI" option)

### 3. Configure Database Connection

Update your `.env.local` with the Supabase credentials from step 2.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Push Database Schema

```bash
npm run db:push
```

This will create the following tables in your Supabase database:
- `admins`
- `services`
- `appointments`

### 6. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Enter an email and password
4. Save the credentials (you'll need them to log in)

### 7. (Optional) Generate Supabase TypeScript Types

For better type safety with Supabase, generate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your Supabase project ID (found in project settings).

### 8. Start Development Server

```bash
npm run dev
```

### 9. Access the Application

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Database Schema Overview

### Admin
- Stores admin user information (linked to Supabase Auth users)
- Fields: id, email, name, timestamps

### Service
- Salon services offered
- Fields: id, name, description, price, duration, category, imageUrl, isActive, timestamps

### Appointment
- Customer appointments
- Fields: id, customerName, customerEmail, customerPhone, serviceId, dateTime, status, notes, timestamps
- Status options: pending, confirmed, completed, cancelled

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure the connection string uses the correct format

### Authentication Issues

- Verify Supabase credentials in `.env.local`
- Check that middleware is properly configured
- Ensure admin user exists in Supabase Auth

### Prisma Issues

- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development (or `db:migrate` for production)
- Check Prisma logs for detailed error messages

## Production Deployment

1. Set environment variables in your hosting platform
2. Run `npm run build` to verify the build works
3. Run migrations: `npm run db:migrate`
4. Deploy your application
5. Verify admin login works in production

## Next Steps

- Add service images
- Implement appointment booking API endpoints
- Add email notifications
- Customize styling to match your brand
- Add more admin features as needed
