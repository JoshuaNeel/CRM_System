import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';
import { addSecureUrls, validateCustomerAccessMiddleware } from '../middleware/secureUrls';
import { encodeCustomerUrl } from '../utils/secureUrl';

const router = Router();
const prisma = new PrismaClient();

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
router.get('/', protect, addSecureUrls, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId: req.user!.id },
      include: {
        contacts: true,
        salesPipeline: true,
        tasks: true,
        _count: {
          select: {
            contacts: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Get customers error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customers. Please try again.',
    });
  }
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
router.get('/:id', protect, addSecureUrls, validateCustomerAccessMiddleware, async (req, res) => {
  try {
    const { actualId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: actualId },
      include: {
        contacts: {
          orderBy: { date: 'desc' },
        },
        salesPipeline: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer details. Please try again.',
    });
  }
});

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, company, industry, status, source, notes } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        industry,
        status: status || 'LEAD',
        source,
        notes,
        userId: req.user!.id,
      },
    });

    // Add secure URL to the response
    const customerWithSecureUrl = {
      ...customer,
      secureUrl: encodeCustomerUrl(customer.id, req.user!.id)
    };

    return res.status(201).json({
      success: true,
      data: customerWithSecureUrl,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create customer. Please check your input and try again.',
    });
  }
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
router.put('/:id', protect, validateCustomerAccessMiddleware, async (req, res) => {
  try {
    const { actualId } = req.params;
    const { name, email, phone, company, industry, status, source, notes } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: actualId },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: actualId },
      data: {
        name,
        email,
        phone,
        company,
        industry,
        status,
        source,
        notes,
      },
    });

    return res.json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update customer. Please check your input and try again.',
    });
  }
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
router.delete('/:id', protect, validateCustomerAccessMiddleware, async (req, res) => {
  try {
    const { actualId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: actualId },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    await prisma.customer.delete({
      where: { id: actualId },
    });

    return res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete customer. Please ensure no related data exists and try again.',
    });
  }
});

export default router; 
