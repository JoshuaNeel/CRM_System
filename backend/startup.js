#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM Backend...');

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.log('📝 Please set the DATABASE_URL in Railway environment variables.');
  console.log('🔗 You can find this in your PostgreSQL service "Connect" tab.');
  process.exit(1);
}

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  // Step 2: Push database schema
  console.log('🗄️ Setting up database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  // Step 3: Seed database (only if not already seeded)
  console.log('🌱 Seeding database...');
  try {
    // Use a simple check to avoid re-seeding
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Check if we already have users
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('📝 No users found, running seed script...');
      execSync('npm run db:seed', { stdio: 'inherit' });
    } else {
      console.log('✅ Database already seeded, skipping...');
    }
    await prisma.$disconnect();
  } catch (seedError) {
    console.log('⚠️ Database seeding failed, continuing anyway...');
    console.log('Error:', seedError.message);
  }
  
  // Step 4: Start the application
  console.log('🎯 Starting application...');
  execSync('node dist/index.js', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Startup failed:', error.message);
  process.exit(1);
} 