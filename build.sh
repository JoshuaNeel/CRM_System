#!/bin/bash

echo "🚀 Building CRM Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!" 