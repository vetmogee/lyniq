# Nail Salon Management System

A production-ready Next.js web application for managing a nail salon business with a sharp, angular design aesthetic.

## 🧱 Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (utility-first, no external UI kits)
- **Prisma ORM**
- **Supabase** (PostgreSQL + Auth)
- **Sharp** (image optimization)

## 🎨 Design Philosophy

- Sharp angles, straight edges, clipped corners
- High contrast black, white, and gray color scheme
- Mobile-first responsive design
- No rounded corners or soft shadows

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Landing page
│   │   ├── services/      # Services page
│   │   ├── gallery/       # Gallery page
│   │   └── contact/       # Contact page
│   ├── admin/             # Admin routes (protected)
│   │   ├── login/         # Admin login
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── services/      # Manage services
│   │   ├── appointments/  # Manage appointments
│   │   └── layout.tsx     # Admin layout (auth protected)
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── admin/             # Admin-specific components
│
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── prisma.ts         # Prisma client singleton
│   ├── supabase/         # Supabase client/server utilities
│   └── auth.ts           # Auth helpers
│
├── prisma/
│   └── schema.prisma     # Database schema
│
└── styles/
    └── theme.ts          # Theme configuration
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### 3. Set Up Database

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

- Admin-only access via Supabase Auth
- No public signups
- Protected routes via middleware
- Server-side session validation

### Creating Admin Users

Admin users must be created directly in Supabase:
1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email/password
3. The user will be able to log in at `/admin/login`

## 📊 Database Models

- **Admin** - Admin user information (linked to Supabase Auth)
- **Service** - Salon services with pricing and duration
- **Appointment** - Customer appointments linked to services

## 🎯 Features

### Public Website
- Landing page with hero section
- Services listing with pricing
- Gallery showcase
- Contact form

### Admin Panel
- Dashboard with overview statistics
- Service management (CRUD)
- Appointment management
- Protected routes with authentication

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

## 📝 Code Quality

- Server Components by default
- Client Components only when needed (interactivity, hooks)
- Proper TypeScript typing throughout
- Clean Tailwind class organization
- Reusable, composable components

## 🎨 Design System

- **Colors**: Black (#000000), White (#FFFFFF), Gray scale
- **Borders**: 2px solid black for emphasis
- **Typography**: Sharp, bold headings; clean body text
- **Spacing**: Consistent Tailwind spacing scale
- **Components**: Angular, no rounded corners

## 🔒 Security

- Middleware protects admin routes
- Server-side authentication checks
- Environment variables for sensitive data
- Prisma prepared statements (SQL injection protection)

## 📱 Responsive Design

- Mobile-first approach
- Custom `useMobile` hook for responsive logic
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🚧 Next Steps

1. Set up Supabase project and configure authentication
2. Run database migrations
3. Create initial admin user
4. Add service images to gallery
5. Implement appointment booking API
6. Add email notifications
7. Deploy to production

## 📄 License

Private - All rights reserved
