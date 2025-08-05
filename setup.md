# CRM System Setup Instructions

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. **Create PostgreSQL Database**
   ```bash
   # Create a new database
   createdb crm_db
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy environment template
   cp backend/env.example backend/.env
   
   # Edit .env file with your database credentials
   DATABASE_URL="postgresql://username:password@localhost:5432/crm_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

3. **Setup Database Schema**
   ```bash
   cd backend
   npm run db:setup
   npm run db:seed
   ```

### 3. Start Development Servers

```bash
# From root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:5173

## Test Credentials

After running the seed script, you can login with:
- **Email**: admin@example.com
- **Password**: password123

## Project Structure

```
crm-system/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & error handling
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Sample data
│   └── package.json
├── frontend/               # React/TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── main.tsx        # App entry point
│   └── package.json
└── README.md
```

## Features Implemented

### Backend API
- ✅ User authentication (JWT)
- ✅ Customer management (CRUD)
- ✅ Contact history tracking
- ✅ Sales pipeline management
- ✅ Task management
- ✅ Dashboard analytics
- ✅ Security middleware
- ✅ Error handling

### Frontend
- ✅ User authentication
- ✅ Dashboard with statistics
- ✅ Customer management interface
- ✅ Customer detail pages
- ✅ Task management
- ✅ Responsive design
- ✅ TypeScript integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List customers (with search/pagination)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Contacts
- `GET /api/contacts/customer/:customerId` - Get customer contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Pipeline
- `GET /api/pipeline/customer/:customerId` - Get customer pipeline
- `POST /api/pipeline` - Create/update pipeline
- `PUT /api/pipeline/:id` - Update pipeline

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/pipeline` - Get pipeline summary

## Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:setup     # Setup database
npm run db:seed      # Seed sample data

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Root
npm run dev          # Start both servers
npm run build        # Build both projects
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/crm_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in .env
3. Verify database exists: `createdb crm_db`

### Port Conflicts
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.ts

### Build Issues
1. Clear node_modules and reinstall
2. Check TypeScript errors
3. Verify all dependencies are installed

## Production Deployment

### Backend (Railway/Render)
1. Set environment variables
2. Deploy with `npm run build`
3. Run `npm run db:setup` on first deploy

### Frontend (Vercel/Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set API URL environment variable

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement proper CORS settings
- Add rate limiting for production
- Use environment variables for all secrets

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the development process documentation
4. Verify all prerequisites are met 