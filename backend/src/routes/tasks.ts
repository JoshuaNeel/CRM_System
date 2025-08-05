import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks. Please try again.',
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
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

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found. Please check the task ID and try again.',
      });
    }

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch task details. Please try again.',
    });
  }
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, customerId } = req.body;

    // Verify customer exists if customerId is provided
    if (customerId) {
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
    }

    const taskData: any = {
      title,
      description,
      priority: priority || 'MEDIUM',
      status: status || 'PENDING',
      customerId: customerId || null,
      userId: req.user!.id,
    };

    // Only add dueDate if it's provided
    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await prisma.task.create({
      data: taskData,
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

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create task. Please check your input and try again.',
    });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, customerId } = req.body;

    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found. Please check the task ID and try again.',
      });
    }

    // Verify customer exists if customerId is provided
    if (customerId) {
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
    }

    const updateData: any = {
      title,
      description,
      priority,
      status,
      customerId: customerId || null,
    };

    // Only add dueDate if it's provided
    if (dueDate) {
      updateData.dueDate = new Date(dueDate);
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData,
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

    return res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update task. Please check your input and try again.',
    });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found. Please check the task ID and try again.',
      });
    }

    await prisma.task.delete({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete task. Please try again.',
    });
  }
});

export default router; 
