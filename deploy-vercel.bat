@echo off
echo ====================================================
echo       TRENDMARK - DEPLOY TO VERCEL VIA GITHUB
echo ====================================================
echo.
echo 1. Running build script (building dist folder)...
node build.js
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Aborting deploy.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Adding modified files to git...
git add .

echo.
echo 3. Committing changes...
set /p msg="Enter commit message (or press ENTER for default): "
if "%msg%"=="" set msg=Deploy update to Vercel

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
echo  Vercel is now automatically deploying your updates!
echo ====================================================
echo.
pause
