@echo off
echo ====================================================
echo      TRENDMARK - UPDATE & DEPLOY TO NETLIFY
echo ====================================================
echo.
echo 1. Compiling latest assets to dist/...
node build.js
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Staging changes for Git...
git add .

echo.
echo 3. Committing changes...
set /p msg="Enter change description (or press ENTER for default): "
if "%msg%"=="" set msg=Update website content and deploy

git commit -m "%msg%"

echo.
echo 4. Pushing to GitHub (origin/main)...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] Git push failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ====================================================
echo  SUCCESS! Changes pushed to GitHub.
echo  Netlify is now automatically deploying your updates!
echo ====================================================
echo.
pause
