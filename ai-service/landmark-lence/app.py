import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the frontend
CORS(app)

# --- Model and Class Names Loading ---

# Define the path to your trained TFLite model
# Make sure this path is correct and the model file exists where you run the script.
MODEL_PATH = 'sri_lanka_landmark_classifier.tflite'

# The list of your landmark classes in the correct order.
# This must match the order the model was trained on.
CLASS_NAMES = [
    'Adams_Peak', 'Bambarakanda_Falls', 'Gal_Viharaya', 'Galle_Fort',
    'Independence_Memorial_Hall', 'Jami_Ul-Alfar_Mosque', 'Jaya_Sri_Maha_Bodhi',
    'Kelaniya_Raja_Maha_Vihara', 'Mihintale', 'Nallur_Kandaswamy_Temple',
    'Nine_Arches_Bridge', 'Ruwanwelisaya_Stupa', 'Sigiriya', 'Temple_of_the_Tooth'
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

# --- Image Preprocessing Function ---

def preprocess_image(image_bytes):
    """
    Takes image bytes, preprocesses it to the model's required format.
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
        # Normalize the image if the model expects it (usually between 0 and 1 or -1 and 1)
        # EfficientNet models typically don't require normalization with `tf.keras.applications.efficientnet.preprocess_input`
        # but for a standard image input, scaling to [0,1] is a safe bet.
        img_array /= 255.0
        return img_array
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
        predicted_class_name = CLASS_NAMES[predicted_index].replace('_', ' ')

        # Return the result as JSON
        return jsonify({
            'prediction': predicted_class_name,
            'confidence': f"{confidence:.2%}" # Format as percentage
        })

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return jsonify({'error': 'An internal error occurred'}), 500

# --- Health Check Endpoint ---

@app.route('/', methods=['GET'])
def health_check():
    return "Landmark AI Service is running."

# --- Run the App ---

if __name__ == '__main__':
    # Runs the app on localhost, port 5000
    app.run(debug=True, port=5000)
