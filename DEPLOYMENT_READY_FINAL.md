# 🚀 Complete Railway Deployment Guide (FINAL)

## ✅ **All Issues Fixed and Ready for Deployment**

### **Fixed Issues:**
1. ✅ Frontend API configuration now uses `VITE_API_URL` environment variable
2. ✅ Backend startup script async/await issues resolved
3. ✅ Railway configurations created for both services
4. ✅ All dependencies properly configured
5. ✅ Environment variables properly set up

---

## **Step 1: Create Railway Project**

### **1.1 Create New Project**
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select repository: **`JoshuaNeel/CRM_System`**
6. Click **"Deploy Now"**

---

## **Step 2: Add PostgreSQL Database**

### **2.1 Create Database Service**
1. In Railway project, click **"New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will provision the database automatically
4. **Note the service name** (e.g., "PostgreSQL")

### **2.2 Get Database Connection String**
1. Click on **PostgreSQL service**
2. Go to **"Connect" tab**
3. **Copy the connection string** (looks like: `postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway`)

---

## **Step 3: Deploy Backend Service**

### **3.1 Create Backend Service**
1. Click **"New Service"** again
2. Select **"GitHub Repo"**
3. Choose repository: **`JoshuaNeel/CRM_System`**
4. **Set Root Directory**: `backend`
5. Click **"Deploy Now"**

### **3.2 Configure Backend Environment Variables**
In backend service **"Variables"** tab, add:

```env
DATABASE_URL=your_postgresql_connection_string_from_step_2
NODE_ENV=production
PORT=5000
JWT_SECRET=6b728b0707956780bfd8d60cb014cb933eeb13b4eeb7567e89c2c68bd0cda6b1
CORS_ORIGIN=https://your-frontend-service.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Note**: Update `CORS_ORIGIN` after deploying frontend.

### **3.3 Backend Build Settings (Auto-detected)**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Health Check**: `/`

---

## **Step 4: Deploy Frontend Service**

### **4.1 Create Frontend Service**
1. Click **"New Service"** again
2. Select **"GitHub Repo"**
3. Choose repository: **`JoshuaNeel/CRM_System`**
4. **Set Root Directory**: `frontend`
5. Click **"Deploy Now"**

### **4.2 Configure Frontend Environment Variables**
In frontend service **"Variables"** tab, add:

```env
VITE_API_URL=https://your-backend-service.railway.app
```

**To find backend URL:**
- Go to backend service
- Copy the URL shown (e.g., `https://your-backend-service.railway.app`)

### **4.3 Frontend Build Settings (Auto-detected)**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Output Directory**: `dist`
- **Health Check**: `/`

---

## **Step 5: Update CORS Settings**

### **5.1 Get Frontend URL**
Once frontend deploys, note the URL (e.g., `https://your-frontend-service.railway.app`)

### **5.2 Update Backend CORS**
Go back to backend service and update:
```env
CORS_ORIGIN=https://your-frontend-service.railway.app
```

---

## **Step 6: Test Your Deployment**

### **6.1 Test Backend**
- **Health Check**: `https://your-backend-service.railway.app/`
- **API Test**: `https://your-backend-service.railway.app/api/auth/register`
- **Expected Response**: `{"message":"CRM API is running",...}`

### **6.2 Test Frontend**
- **Visit**: `https://your-frontend-service.railway.app`
- **Test**: User registration, login, CRM features
- **Default Login**: `admin@example.com` / `password123`

---

## **Expected Deployment Flow:**

### **Backend Deployment:**
```
🚀 Starting CRM Backend...
📦 Generating Prisma client...
🗄️ Setting up database schema...
🌱 Seeding database...
🎯 Starting application...
🚀 CRM Server running on port 5000
```

### **Frontend Deployment:**
```
📦 Installing dependencies...
🔨 Building application...
✅ Build completed
🎯 Starting preview server...
```

---

## **Environment Variables Summary:**

### **Backend Service:**
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=6b728b0707956780bfd8d60cb014cb933eeb13b4eeb7567e89c2c68bd0cda6b1
CORS_ORIGIN=https://your-frontend-service.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Frontend Service:**
```env
VITE_API_URL=https://your-backend-service.railway.app
```

---

## **Troubleshooting:**

### **If Backend Fails:**
1. Check `DATABASE_URL` is correct
2. Verify all environment variables are set
3. Check Railway logs for specific errors

### **If Frontend Fails:**
1. Verify `VITE_API_URL` points to correct backend URL
2. Check build logs for TypeScript errors
3. Ensure all dependencies are in package.json

### **If CORS Errors:**
1. Update `CORS_ORIGIN` to match frontend URL exactly
2. Check that both services are running

---

## **Final URLs:**
- **Backend API**: `https://your-backend-service.railway.app`
- **Frontend App**: `https://your-frontend-service.railway.app`
- **Health Check**: `https://your-backend-service.railway.app/`

---

## **Success Checklist:**
- [ ] PostgreSQL database created
- [ ] Backend service deployed and running
- [ ] Frontend service deployed and running
- [ ] Database connected and seeded
- [ ] User registration works
- [ ] User login works
- [ ] All CRM features work
- [ ] No CORS errors
- [ ] Both URLs are accessible

---

## **Ready to Deploy! 🎉**

Your CRM application is now fully configured and ready for deployment. Follow the steps above and you should have a fully functional CRM system running on Railway!

**Estimated deployment time**: 10-15 minutes
**Cost**: Free (using Railway free tier) 