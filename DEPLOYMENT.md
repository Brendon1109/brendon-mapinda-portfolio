# Brendon Mapinda Portfolio - GitHub Deployment Guide

## 🚀 Quick Deployment to GitHub Pages

### Option 1: Manual GitHub Repository Creation (Recommended)

1. **Go to GitHub.com and create a new repository:**
   - Repository name: `brendon-mapinda-portfolio`
   - Description: `Professional portfolio showcasing Brendon Mapinda's Photography, Data Science, and Music careers with AI-powered persona explorer`
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README (we already have one)

2. **Connect your local repository to GitHub:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/brendon-mapinda-portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Click Save

4. **Your website will be live at:**
   ```
   https://YOUR_USERNAME.github.io/brendon-mapinda-portfolio
   ```

### Option 2: Using GitHub CLI (if you have it installed)

```powershell
# Install GitHub CLI first: winget install GitHub.cli
gh repo create brendon-mapinda-portfolio --public --description "Professional portfolio showcasing Brendon Mapinda's Photography, Data Science, and Music careers with AI-powered persona explorer"
git remote add origin https://github.com/YOUR_USERNAME/brendon-mapinda-portfolio.git
git branch -M main
git push -u origin main
gh pages deploy --source main
```

## 📱 Generate QR Code

After deployment, visit: https://qr-code-generator.com
- Enter your GitHub Pages URL
- Download the QR code
- Share it for easy mobile access

## 🔧 Project Features

✅ **Responsive Design** - Works on all devices
✅ **AI-Powered Bot** - Uses Gemini API for persona exploration  
✅ **Luxury Themes** - Sophisticated nude color schemes
✅ **Three Personas** - Photography, Data Science, Music
✅ **Professional Links** - All social media and professional profiles
✅ **Free Hosting** - GitHub Pages with custom domain support

## 🎨 Themes Overview

- **Photography**: Warm nude tones with glassmorphism
- **Data Science**: Cool professional grays and beiges  
- **Music**: Rich earth tones with luxury animations

## 📊 AI Features

- **Cost-Limited**: Maximum $1 API usage
- **Rate-Limited**: 50 requests max for safety
- **Fallback Responses**: Works even when API is unavailable
- **Usage Tracking**: Real-time monitoring

---

**Next Steps:** Follow Option 1 above to deploy your website to GitHub Pages for free!