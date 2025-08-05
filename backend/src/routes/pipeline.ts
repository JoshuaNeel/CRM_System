import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @desc    Get sales pipeline by customer ID
// @route   GET /api/pipeline/:customerId
// @access  Private
router.get('/:customerId', protect, async (req, res) => {
  try {
    const { customerId } = req.params;

    // Verify customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: req.user!.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    const pipeline = await prisma.salesPipeline.findUnique({
      where: { customerId },
    });

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        error: 'Sales pipeline not found for this customer.',
      });
    }

    return res.json({
      success: true,
      data: pipeline,
    });
  } catch (error) {
    console.error('Get pipeline error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sales pipeline. Please try again.',
    });
  }
});

// @desc    Create or update sales pipeline
// @route   POST /api/pipeline
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { customerId, stage, value, probability, expectedCloseDate, notes } = req.body;

    // Verify customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: req.user!.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    // Check if pipeline already exists
    let pipeline = await prisma.salesPipeline.findUnique({
      where: { customerId },
    });

    if (pipeline) {
      // Update existing pipeline
      pipeline = await prisma.salesPipeline.update({
        where: { customerId },
        data: {
          stage,
          value: value ? parseFloat(value) : null,
          probability: probability ? parseInt(probability) : 0,
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
          notes,
        },
      });
    } else {
      // Create new pipeline
      pipeline = await prisma.salesPipeline.create({
        data: {
          customerId,
          stage: stage || 'LEAD',
          value: value ? parseFloat(value) : null,
          probability: probability ? parseInt(probability) : 0,
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
          notes,
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: pipeline,
    });
  } catch (error) {
    console.error('Create/update pipeline error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create or update sales pipeline. Please check your input and try again.',
    });
  }
});

// @desc    Update sales pipeline
// @route   PUT /api/pipeline/:customerId
// @access  Private
router.put('/:customerId', protect, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { stage, value, probability, expectedCloseDate, notes } = req.body;

    // Verify customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: req.user!.id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found. Please check the customer ID and try again.',
      });
    }

    const pipeline = await prisma.salesPipeline.findUnique({
      where: { customerId },
    });

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        error: 'Sales pipeline not found for this customer.',
      });
    }

    const updatedPipeline = await prisma.salesPipeline.update({
      where: { customerId },
      data: {
        stage,
        value: value ? parseFloat(value) : null,
        probability: probability ? parseInt(probability) : 0,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        notes,
      },
    });

    return res.json({
      success: true,
      data: updatedPipeline,
    });
  } catch (error) {
    console.error('Update pipeline error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update sales pipeline. Please check your input and try again.',
    });
  }
});

export default router; 
