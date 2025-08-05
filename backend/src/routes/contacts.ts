import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @desc    Get contacts by customer
// @route   GET /api/contacts/:customerId
// @access  Private
router.get('/:customerId', protect, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        customerId: req.params.customerId,
        customer: {
          userId: req.user!.id,
        },
      },
      orderBy: { date: 'desc' },
    });

    return res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// @desc    Create contact
// @route   POST /api/contacts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { customerId, type, subject, description, date, followUpDate, status } = req.body;

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

    const contact = await prisma.contact.create({
      data: {
        customerId,
        type: type || 'EMAIL',
        subject,
        description,
        date: date ? new Date(date) : new Date(),
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        status: status || 'COMPLETED',
        userId: req.user!.id,
      },
    });

    return res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create contact. Please check your input and try again.',
    });
  }
});

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found. Please check the contact ID and try again.',
      });
    }

    return res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contact details. Please try again.',
    });
  }
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { type, subject, description, date, followUpDate, status } = req.body;

    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found. Please check the contact ID and try again.',
      });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: req.params.id },
      data: {
        type,
        subject,
        description,
        date: date ? new Date(date) : contact.date,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        status,
      },
    });

    return res.json({
      success: true,
      data: updatedContact,
    });
  } catch (error) {
    console.error('Update contact error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update contact. Please check your input and try again.',
    });
  }
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found. Please check the contact ID and try again.',
      });
    }

    await prisma.contact.delete({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete contact. Please try again.',
    });
  }
});

export default router; 
