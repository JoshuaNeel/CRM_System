#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting CRM Backend...');

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  // Step 2: Push database schema
  console.log('🗄️ Setting up database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  // Step 3: Seed database
  console.log('🌱 Seeding database...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
  } catch (seedError) {
    console.log('⚠️ Database seeding failed, continuing anyway...');
  }
  
  // Step 4: Start the application
  console.log('🎯 Starting application...');
  execSync('node dist/index.js', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Startup failed:', error.message);
  process.exit(1);
} 