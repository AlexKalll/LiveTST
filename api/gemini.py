import os
from http.server import BaseHTTPRequestHandler
import json
import asyncio
import base64
from google import genai
from google.genai import types

# Initialize Gemini client
client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=os.environ.get("GEMINI_API_KEY"),
)

MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025"

CONFIG = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    media_resolution="MEDIA_RESOLUTION_MEDIUM",
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Zephyr")
        )
    ),
)

class handler(BaseHTTPRequestHandler):
    """
    Vercel serverless function handler for Gemini Live API proxy
    """
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Process based on message type
            message_type = data.get('type')
            
            if message_type == 'start_session':
                response = self.start_session()
            elif message_type == 'send_frame':
                response = self.send_frame(data)
            elif message_type == 'send_audio':
                response = self.send_audio(data)
            else:
                response = {'error': 'Unknown message type'}
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode())
    
    def start_session(self):
        """Initialize Gemini Live session"""
        return {
            'status': 'session_started',
            'message': 'Gemini Live session initialized'
        }
    
    def send_frame(self, data):
        """Send video frame to Gemini"""
        # Extract base64 image data
        image_data = data.get('data')
        
        # In a real implementation, you would send this to Gemini Live API
        # For now, return success
        return {
            'status': 'frame_received',
            'timestamp': data.get('timestamp')
        }
    
    def send_audio(self, data):
        """Send audio chunk to Gemini"""
        # Extract base64 audio data
        audio_data = data.get('data')
        
        # In a real implementation, you would send this to Gemini Live API
        # For now, return success
        return {
            'status': 'audio_received',
            'timestamp': data.get('timestamp')
        }
