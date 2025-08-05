export const productionConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: 'production',
  corsOrigin: process.env.FRONTEND_URL || 'https://your-frontend-domain.railway.app',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-production-jwt-secret',
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100, // 100 requests per window
}; 