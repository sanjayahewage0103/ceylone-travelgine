import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the frontend
CORS(app)
 
# --- Gemini API Setup ---

# Set up Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    exit()

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# The list of your landmark classes in the correct order.
CLASS_NAMES = [
    'Adams Peak', 'Bambarakanda Falls', 'Gal Viharaya', 'Galle Fort',
    'Independence Memorial Hall', 'Jami Ul-Alfar Mosque', 'Jaya Sri Maha Bodhi',
    'Kelaniya Raja Maha Vihara', 'Mihintale', 'Nallur Kandaswamy Temple',
    'Nine Arches Bridge', 'Ruwanwelisaya Stupa', 'Sigiriya', 'Temple of the Tooth'
]

# Image size for preprocessing
IMG_HEIGHT, IMG_WIDTH = 224, 224

# --- Image Preprocessing Function ---

def preprocess_image(image_bytes):
    """
    Takes image bytes, preprocesses it to PIL image for Gemini.
    """
    try:
        # Open the image using PIL
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        # Resize the image
        img = img.resize((IMG_HEIGHT, IMG_WIDTH), Image.Resampling.NEAREST)
        return img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

# --- API Endpoint ---

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint that receives an image and returns the landmark name.
    """
    # Check if a file was posted
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    # Check if the file is empty
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    try:
        # Read image bytes
        image_bytes = file.read()

        # Preprocess the image
        processed_image = preprocess_image(image_bytes)
        if processed_image is None:
            return jsonify({'error': 'Could not process image file. It might be corrupted or in an unsupported format.'}), 400

        # Create prompt for Gemini
        prompt = f"Identify the landmark in this image. Choose from: {', '.join(CLASS_NAMES)}. Return only the name of the landmark."

        # Generate content with Gemini
        response = model.generate_content([processed_image, prompt])

        # Debug: print full response object
        print("Gemini API response:", response)

        # Extract predicted class name from response
        predicted_class_name = response.text.strip()

        if not predicted_class_name:
            return jsonify({'error': 'No prediction returned from Gemini API.'}), 500

        # Check if the response is in CLASS_NAMES
        if predicted_class_name not in CLASS_NAMES:
            return jsonify({'error': 'Could not identify the landmark in the image.'}), 400

        # For confidence, since Gemini doesn't provide probabilities, set to 100%
        confidence = "100%"

        # Return the result as JSON
        return jsonify({
            'prediction': predicted_class_name,
            'confidence': confidence
        })

    except Exception as e:
        import traceback
        print("Exception during prediction:")
        traceback.print_exc()
        return jsonify({'error': 'An internal error occurred'}), 500

# --- Health Check Endpoint ---

@app.route('/', methods=['GET'])
def health_check():
    return "Landmark AI Service is running."

# --- Run the App ---

if __name__ == '__main__':
    # Runs the app on localhost, port 5000
    app.run(debug=True, port=5000)
