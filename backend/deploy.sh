#!/bin/bash

# Railway Deployment Script
echo "Starting deployment process..."

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Push database schema
echo "Setting up database schema..."
npm run db:push

# Seed database (optional - only if you want sample data)
echo "Seeding database with sample data..."
npm run db:seed

# Build the application
echo "Building application..."
npm run build

echo "Deployment setup complete!" 