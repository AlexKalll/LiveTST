# LiveAI Webcam - Deployment Guide

## 🚀 Deploy to Vercel (Recommended for Smartphone Testing)

### Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from Your Project Directory

Navigate to your project directory and run:

```bash
cd d:\@cs\liveAI-webcam
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → liveai-webcam (or your preferred name)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### Step 4: Add Environment Variable

After deployment, add your Gemini API key:

```bash
vercel env add GEMINI_API_KEY
```

When prompted:
- **Value:** Paste your Gemini API key
- **Environment:** Select "Production", "Preview", and "Development"

### Step 5: Redeploy with Environment Variable

```bash
vercel --prod
```

### Step 6: Test on Your Smartphone

1. Open the deployment URL on your smartphone browser (Chrome or Safari)
2. Grant camera and microphone permissions when prompted
3. Click "Start Session" to begin
4. Use "Switch Camera" button to toggle between front and back cameras
5. Speak to interact with the AI

---

## 📱 Testing Both Front and Back Cameras

### On Your Smartphone:

1. **Open the deployed URL** in your mobile browser
2. **Grant permissions** when prompted for camera and microphone access
3. **Test Front Camera:**
   - The app starts with the front camera by default
   - Click "Start Session"
   - Verify video preview shows your face
   - Speak and verify AI responds

4. **Test Back Camera:**
   - Click "Switch Camera" button
   - Verify video preview switches to back camera
   - Continue conversation with AI
   - Switch back to front camera to confirm switching works both ways

### Expected Behavior:
- ✅ Smooth camera switching without disconnecting the session
- ✅ Video preview updates immediately
- ✅ AI continues to respond during camera switches
- ✅ Audio input/output remains active

---

## 🔧 Alternative: Deploy via Vercel Dashboard

If you prefer using the web interface:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (or upload the project folder)
3. Configure project:
   - **Framework Preset:** Other
   - **Build Command:** Leave empty
   - **Output Directory:** ./
4. Add environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
5. Click "Deploy"

---

## 🌐 Local Testing (Before Deployment)

To test locally on your computer:

```bash
# Install a simple HTTP server
npm install -g http-server

# Navigate to project directory
cd d:\@cs\liveAI-webcam

# Start server
http-server -p 8080
```

Then open `http://localhost:8080` in your browser.

**Note:** For local testing, you'll need to update `app.js` to use your API key directly (not recommended for production).

---

## 🐛 Troubleshooting

### Camera Not Working
- **Check permissions:** Ensure browser has camera/microphone access
- **Try different browser:** Chrome and Safari work best
- **HTTPS required:** Camera access requires HTTPS (Vercel provides this automatically)

### Camera Switch Button Disabled
- **Single camera device:** The button is disabled if only one camera is detected
- **Desktop testing:** Most desktops only have one camera

### No Audio Response
- **Check microphone:** Ensure microphone permissions are granted
- **Volume:** Check device volume is not muted
- **API Key:** Verify GEMINI_API_KEY is set correctly in Vercel

### Connection Issues
- **Check API key:** Verify your Gemini API key is valid
- **Check console:** Open browser DevTools (F12) and check for errors
- **Network:** Ensure stable internet connection

---

## 📊 Monitoring Your Deployment

### View Deployment Logs

```bash
vercel logs
```

### Check Deployment Status

```bash
vercel ls
```

### View Project Dashboard

```bash
vercel inspect
```

---

## 🔐 Security Notes

- ✅ **Never commit `.env` file** to version control
- ✅ **Use Vercel environment variables** for API keys in production
- ✅ **API key is server-side only** - not exposed to client
- ✅ **HTTPS enforced** by Vercel automatically

---

## 📝 Quick Reference

### Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Remove deployment
vercel remove [deployment-url]

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

### Project Structure

```
liveAI-webcam/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js             # Frontend JavaScript
├── api/
│   └── gemini.py      # Backend API proxy
├── vercel.json        # Vercel configuration
├── requirements.txt   # Python dependencies
├── .env               # Local environment variables (not committed)
└── .env.example       # Environment template
```

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test on smartphone
3. ✅ Verify both cameras work
4. ✅ Test live AI conversation
5. 🎉 Share with others!

---

## 💡 Tips for Best Experience

- **Good Lighting:** Ensure adequate lighting for better video quality
- **Stable Connection:** Use WiFi for best performance
- **Quiet Environment:** Reduce background noise for better AI recognition
- **Clear Speech:** Speak clearly for better transcription

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Check Vercel deployment logs
4. Verify API key is correctly set

Happy testing! 🚀
