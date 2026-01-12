// Configuration
const CONFIG = {
    model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
    apiVersion: 'v1beta',
    frameInterval: 1000, // Send frame every 1 second
    audioChunkSize: 1024,
    sampleRate: 16000,
};

// Global state
let state = {
    videoStream: null,
    audioStream: null,
    currentCamera: 'user', // 'user' for front, 'environment' for back
    cameras: [],
    isSessionActive: false,
    audioContext: null,
    audioWorklet: null,
    frameIntervalId: null,
};

// DOM Elements
const elements = {
    video: document.getElementById('videoPreview'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    switchCameraBtn: document.getElementById('switchCameraBtn'),
    statusText: document.getElementById('statusText'),
    statusIndicator: document.getElementById('statusIndicator'),
    cameraInfo: document.getElementById('cameraInfo'),
    micInfo: document.getElementById('micInfo'),
    connectionInfo: document.getElementById('connectionInfo'),
    transcript: document.getElementById('transcript'),
    audioCanvas: document.getElementById('audioCanvas'),
};

// Initialize
async function init() {
    try {
        updateStatus('Checking camera permissions...');
        await enumerateCameras();
        await startCamera();
        setupEventListeners();
        setupAudioVisualization();
        updateStatus('Ready to start');
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('Error: ' + error.message, true);
    }
}

// Enumerate available cameras
async function enumerateCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        state.cameras = devices.filter(device => device.kind === 'videoinput');

        console.log('Available cameras:', state.cameras);

        if (state.cameras.length === 0) {
            throw new Error('No cameras found');
        }

        // Enable switch button only if multiple cameras available
        elements.switchCameraBtn.disabled = state.cameras.length <= 1;

    } catch (error) {
        console.error('Error enumerating cameras:', error);
        throw error;
    }
}

// Start camera
async function startCamera() {
    try {
        // Stop existing stream if any
        if (state.videoStream) {
            state.videoStream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: {
                facingMode: state.currentCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false // We'll get audio separately
        };

        state.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        elements.video.srcObject = state.videoStream;

        const videoTrack = state.videoStream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();

        elements.cameraInfo.textContent = `${settings.width}x${settings.height} (${state.currentCamera === 'user' ? 'Front' : 'Back'})`;

        console.log('Camera started:', settings);
    } catch (error) {
        console.error('Error starting camera:', error);
        throw new Error('Failed to access camera: ' + error.message);
    }
}

// Switch camera (front/back)
async function switchCamera() {
    try {
        state.currentCamera = state.currentCamera === 'user' ? 'environment' : 'user';
        await startCamera();
        updateStatus(`Switched to ${state.currentCamera === 'user' ? 'front' : 'back'} camera`);
    } catch (error) {
        console.error('Error switching camera:', error);
        updateStatus('Failed to switch camera', true);
    }
}

// Start audio capture
async function startAudioCapture() {
    try {
        state.audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: CONFIG.sampleRate,
            }
        });

        elements.micInfo.textContent = 'Active';

        // Setup audio context for processing
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: CONFIG.sampleRate
        });

        const source = state.audioContext.createMediaStreamSource(state.audioStream);

        // Create audio processor
        await state.audioContext.audioWorklet.addModule(createAudioWorkletBlob());
        state.audioWorklet = new AudioWorkletNode(state.audioContext, 'audio-processor');

        source.connect(state.audioWorklet);

        state.audioWorklet.port.onmessage = (event) => {
            if (state.isSessionActive) {
                sendAudioData(event.data);
            }
        };

        console.log('Audio capture started');
    } catch (error) {
        console.error('Error starting audio:', error);
        throw new Error('Failed to access microphone: ' + error.message);
    }
}

// Create audio worklet processor blob
function createAudioWorkletBlob() {
    const processorCode = `
        class AudioProcessor extends AudioWorkletProcessor {
            process(inputs, outputs, parameters) {
                const input = inputs[0];
                if (input.length > 0) {
                    const channelData = input[0];
                    // Convert Float32Array to Int16Array
                    const int16Data = new Int16Array(channelData.length);
                    for (let i = 0; i < channelData.length; i++) {
                        const s = Math.max(-1, Math.min(1, channelData[i]));
                        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }
                    this.port.postMessage(int16Data.buffer);
                }
                return true;
            }
        }
        registerProcessor('audio-processor', AudioProcessor);
    `;

    const blob = new Blob([processorCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

// Connect to Gemini Live API
async function connectToGemini() {
    try {
        updateStatus('Connecting to Gemini Live API...');
        elements.connectionInfo.textContent = 'Connecting...';

        // Connect to backend API proxy
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'start_session'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to start session');
        }

        const data = await response.json();
        console.log('Session started:', data);

        elements.connectionInfo.textContent = 'Connected';
        elements.statusIndicator.classList.add('active');
        updateStatus('Session active - AI is listening');
        addTranscriptMessage('System', 'Session started. AI is now listening and watching.', 'system');

    } catch (error) {
        console.error('Error connecting to Gemini:', error);
        throw error;
    }
}

// Capture and send video frame
async function captureAndSendFrame() {
    try {
        const canvas = document.createElement('canvas');
        const video = elements.video;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Convert to JPEG blob
        canvas.toBlob(async (blob) => {
            if (blob && state.isSessionActive) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1];
                    sendVideoFrame(base64data);
                };
                reader.readAsDataURL(blob);
            }
        }, 'image/jpeg', 0.8);

    } catch (error) {
        console.error('Error capturing frame:', error);
    }
}

// Send video frame to API
async function sendVideoFrame(base64Data) {
    try {
        await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'send_frame',
                data: base64Data,
                mime_type: 'image/jpeg',
                timestamp: Date.now()
            })
        });
    } catch (error) {
        console.error('Error sending frame:', error);
    }
}

// Send audio data to API
async function sendAudioData(audioBuffer) {
    try {
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

        await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'send_audio',
                data: base64Audio,
                mime_type: 'audio/pcm',
                timestamp: Date.now()
            })
        });
    } catch (error) {
        // Don't log every audio chunk error to avoid console spam
    }
}

// Start session
async function startSession() {
    try {
        elements.startBtn.disabled = true;
        updateStatus('Starting session...');

        await startAudioCapture();
        await connectToGemini();

        // Start sending frames periodically
        state.frameIntervalId = setInterval(captureAndSendFrame, CONFIG.frameInterval);

        state.isSessionActive = true;
        elements.stopBtn.disabled = false;
        elements.switchCameraBtn.disabled = false;

    } catch (error) {
        console.error('Error starting session:', error);
        updateStatus('Failed to start session: ' + error.message, true);
        elements.startBtn.disabled = false;
    }
}

// Stop session
function stopSession() {
    try {
        updateStatus('Stopping session...');

        // Stop frame capture
        if (state.frameIntervalId) {
            clearInterval(state.frameIntervalId);
            state.frameIntervalId = null;
        }

        // Stop audio
        if (state.audioStream) {
            state.audioStream.getTracks().forEach(track => track.stop());
            state.audioStream = null;
        }

        if (state.audioContext) {
            state.audioContext.close();
            state.audioContext = null;
        }

        state.isSessionActive = false;
        elements.startBtn.disabled = false;
        elements.stopBtn.disabled = true;
        elements.statusIndicator.classList.remove('active');
        elements.connectionInfo.textContent = 'Disconnected';
        elements.micInfo.textContent = 'Not started';

        updateStatus('Session stopped');
        addTranscriptMessage('System', 'Session ended.', 'system');

    } catch (error) {
        console.error('Error stopping session:', error);
    }
}

// Update status
function updateStatus(message, isError = false) {
    elements.statusText.textContent = message;
    if (isError) {
        elements.statusText.style.color = '#ef4444';
    } else {
        elements.statusText.style.color = '';
    }
    console.log('Status:', message);
}

// Add message to transcript
function addTranscriptMessage(sender, message, type = 'ai') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `transcript-message ${type}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    elements.transcript.appendChild(messageDiv);
    elements.transcript.scrollTop = elements.transcript.scrollHeight;
}

// Setup audio visualization
function setupAudioVisualization() {
    const canvas = elements.audioCanvas;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw placeholder visualization
    function drawVisualization() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const centerY = canvas.height / 2;
        const amplitude = state.isSessionActive ? 20 : 5;

        for (let x = 0; x < canvas.width; x++) {
            const y = centerY + Math.sin((x + Date.now() / 100) * 0.05) * amplitude;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
        requestAnimationFrame(drawVisualization);
    }

    drawVisualization();
}

// Setup event listeners
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startSession);
    elements.stopBtn.addEventListener('click', stopSession);
    elements.switchCameraBtn.addEventListener('click', switchCamera);

    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = elements.audioCanvas;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
