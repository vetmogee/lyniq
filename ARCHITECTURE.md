# Architecture Decisions

This document explains key architectural decisions made in building this nail salon management system.

## 🏗️ File Structure Rationale

### Route Groups
- `(public)` - Groups public-facing pages together for organization
- `(auth)` - Separate layout for authentication pages (no Navbar/Footer)

### Component Organization
- `components/ui/` - Reusable, framework-agnostic UI components
- `components/layout/` - Layout-specific components (Navbar, Footer)
- `components/admin/` - Admin-specific components (Sidebar)

### Separation of Concerns
- **Server Components by default** - Better performance, SEO, and security
- **Client Components only when needed** - For interactivity, hooks, or browser APIs
- **API routes** - Server-side logic and data mutations

## 🔐 Authentication Architecture

### Why Supabase Auth?
- Built-in session management
- Secure cookie handling
- Easy integration with Next.js middleware
- No need to build auth from scratch

### Middleware Protection
- Runs on every request (except static assets)
- Refreshes expired sessions automatically
- Redirects unauthorized users before page loads
- More secure than client-side checks

### Server-Side Auth Checks
- `requireAuth()` helper ensures user is authenticated
- Used in Server Components and API routes
- Throws redirect if not authenticated
- Prevents unauthorized data access

## 🗄️ Database Architecture

### Why Prisma?
- Type-safe database queries
- Excellent TypeScript support
- Migration management
- Works seamlessly with Supabase PostgreSQL

### Prisma Client Singleton
- Prevents multiple instances in development
- Properly handles Next.js hot reloading
- Configured with appropriate logging levels

### Schema Design
- **Admin** - Links to Supabase Auth users (email matching)
- **Service** - Flexible service management with categories
- **Appointment** - Full appointment lifecycle tracking

## 🎨 Design System

### Sharp, Angular Aesthetic
- **No rounded corners** - All components use `border-radius: 0`
- **2px borders** - High contrast, bold lines
- **Black/White/Gray** - Minimalist color palette
- **No shadows** - Flat design approach

### Tailwind-Only Approach
- No external UI libraries (MUI, ShadCN, DaisyUI)
- Full control over styling
- Smaller bundle size
- Consistent design language

### Component Design Principles
- **Composable** - Components can be combined
- **Reusable** - Single responsibility, flexible props
- **Accessible** - Proper ARIA labels, keyboard navigation
- **Type-safe** - Full TypeScript support

## 📱 Responsive Design

### Mobile-First Approach
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Custom `useMobile` hook for responsive logic
- Breakpoints: sm (640px), md (768px), lg (1024px)

### Hook Design
- Safe for SSR (no window access on server)
- Returns multiple breakpoint flags
- Can be used in any Client Component

## 🔄 Data Flow

### Public Pages
1. Server Component fetches data from Prisma
2. Renders with data (no loading states needed)
3. Client Components handle interactivity

### Admin Pages
1. Middleware checks authentication
2. Layout component verifies auth again
3. Page component fetches data
4. Client Components handle mutations

### API Routes
- Protected by `requireAuth()`
- Handle data mutations
- Return JSON responses
- Can be called from Client Components

## 🛡️ Security Considerations

### Environment Variables
- Sensitive data never committed
- `.env.local` for local development
- Platform-specific env vars for production

### Database Security
- Prisma uses prepared statements (SQL injection protection)
- Direct database access only on server
- No client-side database queries

### Authentication Security
- Sessions managed by Supabase
- Secure HTTP-only cookies
- Server-side validation always
- No client-side auth checks alone

## ⚡ Performance Optimizations

### Server Components
- Reduced JavaScript bundle size
- Faster initial page load
- Better SEO (content in HTML)

### Image Optimization
- Sharp configured for Next.js Image
- Automatic format optimization
- Responsive image sizing

### Code Splitting
- Automatic with Next.js App Router
- Route-based code splitting
- Component-level lazy loading

## 🧪 Development Experience

### Type Safety
- Full TypeScript throughout
- Prisma generates types from schema
- Type-safe API routes
- Type-safe components

### Developer Tools
- Prisma Studio for database inspection
- Next.js DevTools
- ESLint for code quality
- Hot module replacement

## 🚀 Deployment Considerations

### Build Process
1. TypeScript compilation
2. Prisma client generation
3. Next.js build
4. Static optimization

### Environment Setup
- Database migrations run separately
- Environment variables configured
- Supabase project connected
- Admin user created

### Monitoring
- Error tracking (add Sentry/LogRocket)
- Performance monitoring
- Database query monitoring
- User analytics

## 🔮 Future Enhancements

### Potential Additions
- Email notifications (Resend/SendGrid)
- File uploads (Supabase Storage)
- Real-time updates (Supabase Realtime)
- Payment processing (Stripe)
- Calendar integration
- SMS notifications

### Scalability Considerations
- Database indexing (already added)
- Caching strategy (Redis)
- CDN for static assets
- Database connection pooling
- Rate limiting on API routes
