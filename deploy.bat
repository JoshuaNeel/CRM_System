@echo off
echo 🚀 CRM System Deployment Script
echo ================================

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for deployment"
    git branch -M main
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Build the application
echo 🔨 Building application...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)

echo.
echo 🎉 Ready for deployment!
echo.
echo Next steps:
echo 1. Create a GitHub repository and push your code:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git push -u origin main
echo.
echo 2. Deploy to Railway:
echo    - Go to https://railway.app
echo    - Sign in with GitHub
echo    - Create new project from GitHub repo
echo    - Add PostgreSQL database
echo    - Set environment variables
echo.
echo 3. For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
echo 📖 Read DEPLOYMENT_GUIDE.md for complete deployment instructions
pause 