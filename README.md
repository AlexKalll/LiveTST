# LiveAI Webcam

A real-time AI webcam application powered by Google's Gemini Live API. 

## 🌟 Features

- 📹 Real-time video streaming from webcam
- 🎤 Live audio conversation with AI
- 🔄 Switch between front and back cameras (mobile)
- 💬 Live transcription
- 📱 Mobile-optimized interface
- 🎨 Modern, responsive design

## 🚀 Quick Start

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/liveai-webcam)

Or manually:

```bash
npm install -g vercel
vercel login
vercel
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📱 Testing on Smartphone

1. Deploy to Vercel (see above)
2. Open the deployment URL on your smartphone
3. Grant camera and microphone permissions
4. Click "Start Session"
5. Use "Switch Camera" to toggle between front/back cameras

## 🛠️ Local Development

```bash
# Install HTTP server
npm install -g http-server

# Start server
http-server -p 8080

# Open http://localhost:8080
```

## 🔑 Environment Variables

Create a `.env` file (use `.env.example` as template):

```
GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 📂 Project Structure

```
├── index.html          # Main HTML
├── styles.css          # Styling
├── app.js             # Frontend logic
├── api/
│   └── gemini.py      # Backend API proxy
├── vercel.json        # Vercel config
└── DEPLOYMENT.md      # Deployment guide
```

## 🎯 Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop)
- ✅ Edge (Desktop)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.
