import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.id,
    code: error.code
  });

  // Prisma errors with specific handling
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      // Unique constraint violation
      const field = prismaError.meta?.target?.[0] || 'field';
      res.status(409).json({
        success: false,
        error: `Resource with this ${field} already exists`,
        code: 'DUPLICATE_ENTRY'
      });
      return;
    }
    
    if (prismaError.code === 'P2003') {
      // Foreign key constraint violation
      res.status(409).json({
        success: false,
        error: 'Cannot delete this resource because it is referenced by other records',
        code: 'FOREIGN_KEY_CONSTRAINT'
      });
      return;
    }
    
    if (prismaError.code === 'P2025') {
      // Record not found
      res.status(404).json({
        success: false,
        error: 'Resource not found',
        code: 'NOT_FOUND'
      });
      return;
    }
    
    // Generic Prisma error
    res.status(400).json({
      success: false,
      error: 'Database operation failed. Please try again.',
      code: 'DATABASE_ERROR'
    });
    return;
  }

  // Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    res.status(400).json({
      success: false,
      error: 'Invalid data provided. Please check your input and try again.',
      code: 'VALIDATION_ERROR'
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Authentication token has expired. Please log in again',
      code: 'TOKEN_EXPIRED'
    });
    return;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err).map((val: any) => val.message).join(', ');
    res.status(400).json({
      success: false,
      error: message,
      code: 'VALIDATION_ERROR'
    });
    return;
  }

  // Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid resource ID format',
      code: 'INVALID_ID'
    });
    return;
  }

  // Rate limiting errors
  if (err.message && err.message.includes('Too many requests')) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
    return;
  }

  // CORS errors
  if (err.message && err.message.includes('Not allowed by CORS')) {
    res.status(403).json({
      success: false,
      error: 'Cross-origin request not allowed',
      code: 'CORS_ERROR'
    });
    return;
  }

  // Default server error
  res.status(error.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred. Please try again later.'
      : error.message || 'Server Error',
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 