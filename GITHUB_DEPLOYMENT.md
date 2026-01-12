# Deploy to Vercel from GitHub

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub

1. **Create a new GitHub repository** (if you haven't already)
   - Go to [github.com/new](https://github.com/new)
   - Name it `liveai-webcam` (or your preferred name)
   - Don't initialize with README (you already have files)

2. **Initialize Git and push your code:**

```bash
cd d:\@cs\liveAI-webcam

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LiveAI Webcam web version"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/liveai-webcam.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in (use GitHub to sign in)

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Select your `liveai-webcam` repository
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Other (or leave as detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty
   - **Output Directory:** `./` (leave as default)

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyDk_X-9gEPcWei1jL7U8NDAQee4Ty3armw`
   - Select all environments (Production, Preview, Development)
   - Click "Add"

6. **Click "Deploy"**

7. **Wait for deployment** (usually takes 1-2 minutes)

8. **Get your URL** - Vercel will provide a URL like `https://liveai-webcam.vercel.app`

---

## 📱 Test on Your Smartphone

1. **Open the Vercel URL** on your smartphone browser (Chrome or Safari recommended)

2. **Grant permissions** when prompted:
   - Camera access
   - Microphone access

3. **Test Front Camera:**
   - The app starts with front camera by default
   - Click "Start Session"
   - Verify video preview shows your face
   - Speak to test AI interaction

4. **Test Back Camera:**
   - Click "Switch Camera" button
   - Video should switch to back camera
   - Continue testing AI conversation
   - Switch back to verify it works both ways

---

## 🔄 Update Your Deployment

Whenever you make changes to your code:

```bash
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push
```

Vercel will **automatically redeploy** when you push to GitHub!

---

## 🔧 Vercel Dashboard Features

After deployment, you can:

- **View deployment logs:** Click on your project → Deployments → Select deployment → View logs
- **Update environment variables:** Project Settings → Environment Variables
- **Custom domain:** Project Settings → Domains
- **View analytics:** Analytics tab

---

## 📋 Files to Commit

Make sure these files are in your repository:

```
✅ index.html
✅ styles.css
✅ app.js
✅ api/gemini.py
✅ vercel.json
✅ requirements.txt
✅ .env.example
✅ .gitignore
✅ README.md
✅ DEPLOYMENT.md
❌ .env (DO NOT commit - contains your API key!)
❌ venv/ (DO NOT commit - virtual environment)
```

The `.gitignore` file already excludes `.env` and `venv/` for security.

---

## 🐛 Troubleshooting

### "Repository not found"
- Make sure the repository is public, or grant Vercel access to private repos

### "Build failed"
- Check the build logs in Vercel dashboard
- Verify all files are committed and pushed

### "API key not working"
- Double-check the environment variable is set correctly in Vercel
- Make sure there are no extra spaces or quotes

### Camera not working on smartphone
- Ensure you're using HTTPS (Vercel provides this automatically)
- Grant camera permissions when prompted
- Try Chrome or Safari browsers

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Check git status | `git status` |
| Add all files | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push to GitHub | `git push` |
| View remote URL | `git remote -v` |

---

## 🔐 Security Reminder

- ✅ `.env` file is in `.gitignore` - your API key is safe
- ✅ API key is stored in Vercel environment variables
- ✅ Never commit `.env` to GitHub
- ✅ If you accidentally commit `.env`, rotate your API key immediately

---

## 🎉 You're Done!

Your LiveAI Webcam app is now:
- ✅ Deployed to Vercel
- ✅ Accessible from any device
- ✅ Automatically updates when you push to GitHub
- ✅ Ready to test on your smartphone!

**Next:** Open the Vercel URL on your smartphone and test both cameras! 📱
