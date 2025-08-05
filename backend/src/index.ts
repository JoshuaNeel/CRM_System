import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import contactRoutes from './routes/contacts';
import pipelineRoutes from './routes/pipeline';
import taskRoutes from './routes/tasks';
import dashboardRoutes from './routes/dashboard';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting - disabled in development to prevent CORS issues
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost ports in 51XX range (development)
    if (origin.match(/^https?:\/\/localhost:51\d{2}$/)) {
      return callback(null, true);
    }
    
    // Allow the specific origin from environment variable if set
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    
    // Allow localhost:5173 as fallback (development)
    if (origin === 'http://localhost:5173') {
      return callback(null, true);
    }
    
    // Allow Railway domains for production
    if (origin.match(/^https?:\/\/.*\.railway\.app$/)) {
      return callback(null, true);
    }
    
    // Allow Vercel domains for production
    if (origin.match(/^https?:\/\/.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Basic health check - always return OK for Railway health checks
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'unknown'
    };

    // Check database connectivity if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        
        // Simple database ping
        await prisma.$queryRaw`SELECT 1`;
        await prisma.$disconnect();
        
        healthData.database = 'connected';
      } catch (dbError) {
        healthData.database = 'disconnected';
        // Don't change status to WARNING for Railway health checks
        console.log('Database connection warning:', (dbError as Error).message);
      }
    }

    res.json(healthData);
  } catch (error) {
    // For Railway health checks, still return 200 but with error info
    res.json({
      status: 'STARTING',
      timestamp: new Date().toISOString(),
      message: 'Application is starting up'
    });
  }
});

// Simple readiness endpoint for Railway
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CRM Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app; 