import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get customer statistics
    const totalCustomers = await prisma.customer.count({
      where: { userId },
    });

    const customersByStatus = await prisma.customer.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    // Get pipeline statistics
    const pipelineStats = await prisma.salesPipeline.groupBy({
      by: ['stage'],
      where: {
        customer: { userId },
      },
      _count: { stage: true },
      _sum: { value: true },
    });

    // Get task statistics
    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
    });

    // Get recent activities
    const recentContacts = await prisma.contact.findMany({
      where: {
        customer: { userId },
      },
      include: {
        customer: {
          select: { name: true, company: true },
        },
      },
      orderBy: { date: 'desc' },
      take: 5,
    });

    const upcomingTasks = await prisma.task.findMany({
      where: {
        userId,
        dueDate: { gte: new Date() },
        status: { not: 'COMPLETED' },
      },
      include: {
        customer: {
          select: { name: true, company: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    return res.json({
      success: true,
      data: {
        customers: {
          total: totalCustomers,
          byStatus: customersByStatus,
        },
        pipeline: {
          byStage: pipelineStats,
        },
        tasks: {
          total: totalTasks,
          byStatus: tasksByStatus,
          overdue: overdueTasks,
        },
        recentActivities: {
          contacts: recentContacts,
          tasks: upcomingTasks,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// @desc    Get sales pipeline summary
// @route   GET /api/dashboard/pipeline
// @access  Private
router.get('/pipeline', protect, async (req, res) => {
  try {
    const userId = req.user!.id;

    const pipeline = await prisma.salesPipeline.findMany({
      where: {
        customer: { userId },
      },
      include: {
        customer: {
          select: { name: true, company: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const totalValue = pipeline.reduce((sum, item) => sum + (item.value || 0), 0);
    const weightedValue = pipeline.reduce((sum, item) => {
      return sum + ((item.value || 0) * (item.probability || 0) / 100);
    }, 0);

    return res.json({
      success: true,
      data: {
        pipeline,
        summary: {
          totalValue,
          weightedValue,
          dealCount: pipeline.length,
        },
      },
    });
  } catch (error) {
    console.error('Get pipeline summary error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

export default router; 
