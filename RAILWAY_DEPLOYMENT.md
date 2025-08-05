# Railway Deployment Guide

## Prerequisites
- GitHub repository with your CRM system code
- Railway account (free tier available)
- Git configured with proper authentication

## Step 1: Set Up Railway Project

### 1.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your repository: `JoshuaNeel/CRM_System`

### 1.2 Add PostgreSQL Database
1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. Note the database connection details

## Step 2: Configure Environment Variables

### 2.1 Backend Environment Variables
In your Railway project, go to the backend service and add these environment variables:

```env
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway

# Server Configuration
NODE_ENV=production
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.2 Frontend Environment Variables (if deploying frontend separately)
```env
VITE_API_URL=https://your-backend-domain.railway.app
```

## Step 3: Configure Build Settings

### 3.1 Backend Service Configuration
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run deploy`
- **Start Command**: `npm start`

### 3.2 Database Setup
The deployment script will automatically:
1. Generate Prisma client
2. Push database schema
3. Seed with sample data
4. Build the application

## Step 4: Deploy

### 4.1 Initial Deployment
1. Railway will automatically detect your project structure
2. It will build and deploy your backend
3. The database will be set up automatically

### 4.2 Verify Deployment
1. Check the deployment logs in Railway dashboard
2. Visit your backend URL: `https://your-backend-domain.railway.app/health`
3. Test the API endpoints

## Step 5: Database Management

### 5.1 View Database
1. In Railway dashboard, click on your PostgreSQL service
2. Go to "Connect" tab to see connection details
3. Use "Query" tab to run SQL commands

### 5.2 Database Migrations
If you need to update the database schema:
1. Update your Prisma schema locally
2. Push changes to GitHub
3. Railway will automatically redeploy and update the database

### 5.3 Backup Database
1. In Railway PostgreSQL service
2. Go to "Settings" → "Backup"
3. Download your database backup

## Step 6: Frontend Deployment (Optional)

### 6.1 Deploy Frontend to Railway
1. Add another service in your Railway project
2. Select "GitHub Repo" and point to the same repository
3. Set root directory to `frontend`
4. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`

### 6.2 Alternative: Deploy Frontend to Vercel/Netlify
1. Connect your GitHub repository to Vercel/Netlify
2. Set build directory to `frontend`
3. Set build command to `npm run build`
4. Set output directory to `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-domain.railway.app`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check that the database service is running
   - Ensure the database is accessible from your backend service

2. **Build Failures**
   - Check Railway build logs
   - Verify all dependencies are in `package.json`
   - Ensure TypeScript compilation succeeds

3. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure `NODE_ENV=production` is set

4. **CORS Errors**
   - Update `CORS_ORIGIN` to match your frontend domain
   - Check that the frontend URL is correct

### Getting Help
- Check Railway deployment logs
- Verify environment variables in Railway dashboard
- Test database connection using Railway's query interface

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to your repository
   - Use Railway's environment variable system
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use strong passwords for database
   - Enable SSL connections
   - Regular database backups

3. **API Security**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs

## Monitoring and Maintenance

1. **Health Checks**
   - Monitor `/health` endpoint
   - Set up alerts for downtime
   - Check Railway metrics

2. **Database Monitoring**
   - Monitor database performance
   - Check connection pool usage
   - Review slow queries

3. **Application Logs**
   - Review Railway logs regularly
   - Set up log aggregation if needed
   - Monitor error rates

## Cost Optimization

1. **Railway Free Tier**
   - 500 hours/month for services
   - 1GB storage for databases
   - Suitable for development and small projects

2. **Scaling**
   - Upgrade to paid plan for production
   - Consider auto-scaling for high traffic
   - Monitor usage to optimize costs 