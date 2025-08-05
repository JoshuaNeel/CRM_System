import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { encodeCustomerUrl, validateCustomerAccess } from '../utils/secureUrl';

const prisma = new PrismaClient();

// Middleware to add secure URLs to customer objects
export const addSecureUrls = (req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    if (data.success && data.data) {
      if (Array.isArray(data.data)) {
        // Handle array of customers
        data.data = data.data.map((customer: any) => ({
          ...customer,
          secureUrl: encodeCustomerUrl(customer.id, req.user!.id)
        }));
      } else if (data.data.id) {
        // Handle single customer
        data.data = {
          ...data.data,
          secureUrl: encodeCustomerUrl(data.data.id, req.user!.id)
        };
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware to validate customer access and extract actual ID
export const validateCustomerAccessMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400).json({
      success: false,
      error: 'Customer ID is required',
    });
    return;
  }

  // Check if the ID is a secure URL
  const actualId = validateCustomerAccess(id, req.user!.id);
  
  if (!actualId) {
    res.status(404).json({
      success: false,
      error: 'Customer not found or access denied. Please check the URL and try again.',
    });
    return;
  }

  // Add the actual ID to the request params
  req.params.actualId = actualId;
  
  next();
}; 