# Full-Stack Railway Deployment Guide

## Current Status
- ✅ Backend: Ready for Railway deployment
- 🔄 Frontend: Needs to be added to Railway project

## Step 1: Complete Backend Deployment

### 1.1 Set Environment Variables in Backend Service
In your Railway backend service, add these variables:

```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
PORT=5000
JWT_SECRET=6b728b0707956780bfd8d60cb014cb933eeb13b4eeb7567e89c2c68bd0cda6b1
CORS_ORIGIN=https://your-frontend-service.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.2 Verify Backend is Working
- Check that your backend service is running
- Test the health endpoint: `https://your-backend-service.railway.app/`
- Note down your backend URL for the next step

## Step 2: Add Frontend Service

### 2.1 Create Frontend Service
1. **In Railway dashboard**, click "New Service"
2. **Select "GitHub Repo"**
3. **Choose your repository**: `JoshuaNeel/CRM_System`
4. **Set Root Directory**: `frontend`
5. **Click "Deploy Now"**

### 2.2 Configure Frontend Build Settings
Railway should auto-detect it's a Vite/React app, but verify:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Output Directory**: `dist`

### 2.3 Set Frontend Environment Variables
In your frontend service, add:
```env
VITE_API_URL=https://your-backend-service.railway.app
```

## Step 3: Update CORS Settings

### 3.1 Get Frontend URL
Once frontend is deployed, note the URL (e.g., `https://your-frontend-service.railway.app`)

### 3.2 Update Backend CORS
Go back to your backend service and update:
```env
CORS_ORIGIN=https://your-frontend-service.railway.app
```

## Step 4: Test Full Application

### 4.1 Test Backend
- Health check: `https://your-backend-service.railway.app/`
- API test: `https://your-backend-service.railway.app/api/auth/register`

### 4.2 Test Frontend
- Visit: `https://your-frontend-service.railway.app`
- Try to register a new user
- Test login functionality
- Test all CRM features

## Step 5: Final Configuration

### 5.1 Custom Domains (Optional)
Railway allows you to set custom domains for both services.

### 5.2 Environment Variables Summary

**Backend Service:**
```env
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000
JWT_SECRET=6b728b0707956780bfd8d60cb014cb933eeb13b4eeb7567e89c2c68bd0cda6b1
CORS_ORIGIN=https://your-frontend-service.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend Service:**
```env
VITE_API_URL=https://your-backend-service.railway.app
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` matches your frontend URL exactly
   - Check that both services are running

2. **API Connection Issues**
   - Verify `VITE_API_URL` is correct
   - Check that backend is accessible

3. **Build Failures**
   - Check Railway build logs
   - Verify all dependencies are in package.json

## Alternative: Vercel + Railway

If you prefer to use Vercel for the frontend:

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-service.railway.app`

### Backend (Railway)
Continue with Railway as described above.

## Success Checklist

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Database is connected
- [ ] User registration works
- [ ] User login works
- [ ] All CRM features work
- [ ] No CORS errors
- [ ] Both URLs are accessible

## Final URLs

- **Backend API**: `https://your-backend-service.railway.app`
- **Frontend App**: `https://your-frontend-service.railway.app`
- **Health Check**: `https://your-backend-service.railway.app/`

Your full-stack CRM application is now deployed and ready to use! 🎉 