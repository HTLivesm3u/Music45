# Deploying Music45 to Vercel

This guide will walk you through deploying your Music45 app to Vercel at `https://music45.vercel.app/`

## 🚀 Quick Deployment

### Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Node.js 18+** installed locally (for testing)

### Step 1: Push Your Code to GitHub

```bash
# Initialize git repository if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or `Music45-3.0` if in a monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project directory
cd Music45-3.0

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add `music45.vercel.app` (this should be your default subdomain)
4. For custom domains, add your domain and follow DNS configuration instructions

## 📋 Configuration Files

### vercel.json (Already Created)

The `vercel.json` file is already configured with:
- Build settings for Vite
- SPA routing (single-page application)
- Cache headers for assets
- Security headers

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### package.json Scripts

Make sure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 🔧 Project Settings in Vercel Dashboard

Go to **Project Settings** and verify:

### Build & Development Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Root Directory
- Set to `./` if Music45-3.0 is your root
- Or set to `Music45-3.0` if it's in a subdirectory

### Node.js Version
- Go to **Settings** → **General**
- Set **Node.js Version** to `18.x` or higher

### Environment Variables (if needed)
- Currently, this app doesn't require environment variables
- The JioSaavn API is accessed through a public endpoint

## 🐛 Troubleshooting

### Issue: Build Fails with TypeScript Errors

**Solution**: Ensure all TypeScript is properly typed. Run locally first:

```bash
npm run type-check
npm run build
```

### Issue: 404 Errors on Direct Route Access

**Solution**: The `vercel.json` already includes SPA routing configuration. If you still see 404s, verify the rewrite rules are in place.

### Issue: Assets Not Loading

**Solution**: 
1. Check that `public` folder contents are in the correct location
2. Verify `vite.config.ts` has correct `publicDir: 'public'`
3. Reference assets with `/` prefix (e.g., `/logo.png`)

### Issue: Recently Played Not Working

**Status**: ✅ **FIXED**

**What was wrong**: The `addToRecentlyPlayed()` function was saving to localStorage, but the state wasn't being reloaded, so the UI didn't update.

**Fix applied**: Updated `playIndex()` function in `src/main.ts`:

```typescript
// Before (broken)
addToRecentlyPlayed(item);
saveRecentlyPlayed(state.recentlyPlayed);

// After (fixed)
addToRecentlyPlayed(item);
state.recentlyPlayed = loadRecentlyPlayed(); // Reload state
renderRecently(); // Update UI
```

**Verify the fix**:
1. Play any song
2. Check the "Recently Played" section on the home tab
3. The song should appear immediately

### Issue: CORS Errors with JioSaavn API

**Solution**: 
- The app uses `https://music45-backend.vercel.app/` as proxy
- If you need to change the API endpoint, update `src/services/api.ts`
- Note: Direct calls to JioSaavn API may be blocked by CORS

### Issue: Slow Initial Load

**Solution**:
1. Images are loaded lazily - this is expected
2. Consider implementing a loading skeleton for better UX
3. Vercel Edge Network caches assets automatically after first load

## 📱 Testing Your Deployment

### 1. Local Preview (Before Deploying)

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to test

### 2. Test on Vercel

After deployment, test these features:

- ✅ Browse albums on home page
- ✅ Search for songs/artists
- ✅ Play a song
- ✅ Check recently played section (should update immediately)
- ✅ Test lyrics display
- ✅ Test shuffle and repeat modes
- ✅ Test queue functionality
- ✅ Check that settings persist (quality, etc.)

### 3. Mobile Testing

- Open your Vercel URL on mobile devices
- Test touch gestures (swipe, tap)
- Verify responsive design
- Test audio playback

## 🔄 Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Redeployment

From Vercel Dashboard:
1. Go to your project
2. Click **"Deployments"**
3. Find your latest deployment
4. Click **"..."** → **"Redeploy"**

### Rollback to Previous Version

1. Go to **"Deployments"**
2. Find a previous successful deployment
3. Click **"..."** → **"Promote to Production"**

## 🌐 Custom Domain Setup

If you want to use a custom domain instead of `music45.vercel.app`:

1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `music45.com`)
3. Add DNS records to your domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Vercel automatically provisions SSL certificate

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable analytics in your project:
1. Go to **Analytics** tab
2. Click **"Enable Vercel Analytics"**
3. View real-time metrics, page views, and performance

### Speed Insights

Monitor Core Web Vitals:
1. Go to **Speed Insights** tab
2. View performance metrics
3. Get recommendations for optimization

## 🔐 Security Best Practices

1. **HTTPS**: Automatically enabled by Vercel
2. **Headers**: Security headers are configured in `vercel.json`
3. **API Keys**: Never commit API keys to GitHub
4. **Content Security Policy**: Consider adding CSP headers for extra security

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] `npm run build` works locally without errors
- [ ] `npm run preview` shows the app working correctly
- [ ] `vercel.json` is present in the root directory
- [ ] Node.js version is 18+ in Vercel settings
- [ ] Recently played feature is working (after the fix)
- [ ] All assets are in the `public` folder
- [ ] TypeScript compilation succeeds

## 🎉 Success!

Your Music45 app should now be live at `https://music45.vercel.app/`

Enjoy your deployed music streaming app! 🎵

---

**Need Help?**
- Check [Vercel Support](https://vercel.com/support)
- Review build logs in Vercel Dashboard
- Test locally first with `npm run build && npm run preview`
