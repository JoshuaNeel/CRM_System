# CRM System Deployment Guide

This guide will help you deploy your CRM application to get a runnable URL for your lead.

## Deployment Options

### Option 1: Railway (Recommended - Easiest)
Railway is a modern platform that makes it easy to deploy full-stack applications.

#### Prerequisites
1. GitHub account
2. Railway account (free at [railway.app](https://railway.app))

#### Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy Backend to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect it's a Node.js project

3. **Set Environment Variables in Railway**
   In your Railway project dashboard, go to "Variables" tab and add:
   ```
   NODE_ENV=production
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   CORS_ORIGIN=https://your-frontend-domain.railway.app
   ```

4. **Add PostgreSQL Database**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

5. **Deploy Frontend to Railway**
   - Create a new Railway project for the frontend
   - Connect to the same GitHub repository
   - Set the root directory to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-backend-domain.railway.app`

### Option 2: Vercel + Railway
Deploy frontend to Vercel and backend to Railway.

#### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-domain.railway.app`

#### Backend (Railway)
Follow the Railway steps above for the backend.

### Option 3: Render
Render is another good option for full-stack deployments.

## Environment Variables Setup

### Backend Environment Variables
Create a `.env` file in the backend directory:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret_key
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://your-backend-domain.com
```

## Database Setup

### PostgreSQL (Recommended)
1. Use Railway's PostgreSQL service
2. Or use Supabase (free tier available)
3. Or use Neon (free tier available)

### Database Migration
After deployment, run the database setup:
```bash
cd backend
npm run db:setup
```

## Testing Your Deployment

1. **Health Check**: Visit `https://your-backend-domain.com/health`
2. **Frontend**: Visit your frontend URL
3. **Register**: Create a new user account
4. **Login**: Test the authentication
5. **Features**: Test all CRM features (customers, contacts, tasks, etc.)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set correctly
   - Check that the frontend URL is allowed in backend CORS configuration

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from your deployment platform

3. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation succeeds

4. **Environment Variables**
   - Verify all required environment variables are set
   - Check for typos in variable names

### Getting Help
- Check the deployment platform's logs
- Verify environment variables are set correctly
- Test locally with production environment variables

## Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret
2. **Database**: Use a secure database connection
3. **CORS**: Only allow necessary origins
4. **Rate Limiting**: Keep rate limiting enabled in production
5. **HTTPS**: Ensure your deployment uses HTTPS

## Cost Considerations

- **Railway**: Free tier includes 500 hours/month
- **Vercel**: Free tier for frontend hosting
- **Supabase**: Free tier for database
- **Render**: Free tier available

## Final Steps

1. Test all functionality thoroughly
2. Document any custom configurations
3. Share the frontend URL with your lead
4. Provide admin credentials if needed
5. Monitor the application for any issues

## Quick Deploy Commands

```bash
# Build the application
npm run build

# Test production build locally
npm start

# Deploy to Railway (after connecting GitHub repo)
# Railway will automatically deploy on push to main branch
``` 