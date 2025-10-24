@echo off
echo.
echo ===============================================
echo   Brendon Mapinda Portfolio - GitHub Deployment
echo ===============================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed or not in PATH
    echo Please install Git first: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Current git status:
git status

echo.
echo [2/5] Adding deployment guide to git...
git add DEPLOYMENT.md
git commit -m "Add deployment guide and instructions"

echo.
echo [3/5] Your repository is ready for GitHub!
echo.
echo NEXT STEPS:
echo 1. Go to https://github.com/new
echo 2. Repository name: brendon-mapinda-portfolio
echo 3. Make it PUBLIC (required for free GitHub Pages)
echo 4. Don't initialize with README
echo 5. Create repository
echo.
echo [4/5] Then run these commands (replace YOUR_USERNAME):
echo git remote add origin https://github.com/YOUR_USERNAME/brendon-mapinda-portfolio.git
echo git branch -M main
echo git push -u origin main
echo.
echo [5/5] Enable GitHub Pages:
echo - Go to repository Settings → Pages
echo - Source: Deploy from a branch
echo - Branch: main / (root)
echo - Save
echo.
echo Your website will be live at:
echo https://YOUR_USERNAME.github.io/brendon-mapinda-portfolio
echo.
pause