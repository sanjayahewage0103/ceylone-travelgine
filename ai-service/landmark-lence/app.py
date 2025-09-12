import os
import numpy as np
import tensorflow as tf
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

# --- Model and Class Names Loading ---

# Define the path to your trained TFLite model
MODEL_PATH = 'sri_lanka_landmark_classifier.tflite'

# The list of your landmark classes in the correct order.
CLASS_NAMES = [
    'Adams Peak', 'Bambarakanda Falls', 'Gal Viharaya', 'Galle Fort',
    'Independence Memorial Hall', 'Jami Ul-Alfar Mosque', 'Jaya Sri Maha Bodhi',
    'Kelaniya Raja Maha Vihara', 'Mihintale', 'Nallur Kandaswamy Temple',
    'Nine Arches Bridge', 'Ruwanwelisaya Stupa', 'Sigiriya', 'Temple of the Tooth'
]

# Load the TFLite model and allocate tensors.
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    print("TFLite model loaded successfully.")
except Exception as e:
    print(f"Error loading TFLite model: {e}")
    # Exit if the model can't be loaded
    exit()

# Get model input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
# Assuming the model expects 224x224 images
IMG_HEIGHT, IMG_WIDTH = input_details[0]['shape'][1], input_details[0]['shape'][2]



GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    exit()

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash')


def preprocess_image_for_gemini(image_bytes):
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

def preprocess_image_for_model(image_bytes):
    """
    Takes image bytes, preprocesses it to numpy array for TFLite model.
    """
    try:
        # Open the image using PIL
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        # Resize the image
        img = img.resize((IMG_HEIGHT, IMG_WIDTH), Image.Resampling.NEAREST)
        # Convert to numpy array
        img_array = np.array(img, dtype=np.float32)
        # Add a batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        # Normalize the image
        img_array /= 255.0
        return img_array
    except Exception as e:
        print(f"Error preprocessing image for model: {e}")
        return None

def predict_with_model(image_bytes):
    """
    Predict using the TFLite model.
    """
    try:
        processed_image = preprocess_image_for_model(image_bytes)
        if processed_image is None:
            return None, None

        # Set the tensor to the input data
        interpreter.set_tensor(input_details[0]['index'], processed_image)

        # Run inference
        interpreter.invoke()

        # Get the prediction results
        predictions = interpreter.get_tensor(output_details[0]['index'])[0]

        # Get the index of the highest probability
        predicted_index = np.argmax(predictions)

        # Get the confidence score
        confidence = float(predictions[predicted_index])

        # Get the class name
        predicted_class_name = CLASS_NAMES[predicted_index]

        return predicted_class_name, confidence
    except Exception as e:
        print(f"Error during model prediction: {e}")
        return None, None

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

        # Predict using the trained model first (may be inaccurate)
        model_pred, model_conf = predict_with_model(image_bytes)
        if model_pred is None:
            model_pred = "Unknown"
            model_conf = 0.0

        # Preprocess image for Gemini
        processed_image = preprocess_image_for_gemini(image_bytes)
        if processed_image is None:
            return jsonify({'error': 'Could not process image file. It might be corrupted or in an unsupported format.'}), 400

        # Create prompt for Gemini
        prompt = f"Identify the landmark in this image. Choose from: {', '.join(CLASS_NAMES)}. Return only the name of the landmark."

        # Generate content with Gemini
        response = gemini_model.generate_content([processed_image, prompt])

        # Debug: print full response object
        print("Gemini API response:", response)

        # Extract predicted class name from response
        gemini_predicted_class_name = response.text.strip()

        # Validate Gemini prediction
        if gemini_predicted_class_name in CLASS_NAMES:
            final_prediction = gemini_predicted_class_name
            confidence = "100%"
        else:
            # If Gemini prediction invalid, fallback to model prediction
            final_prediction = model_pred
            confidence = f"{model_conf:.2%}"

        # Return the result as JSON
        return jsonify({
            'prediction': final_prediction,
            'confidence': confidence,
            'model_prediction': model_pred,
            'model_confidence': f"{model_conf:.2%}",
            'gemini_prediction': gemini_predicted_class_name
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
