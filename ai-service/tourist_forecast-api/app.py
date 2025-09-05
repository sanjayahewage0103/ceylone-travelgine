import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- INITIALIZATION ---
app = Flask(__name__)
CORS(app)  # Essential for allowing the React frontend to communicate with this server

# --- LOAD MODELS & DATA AT STARTUP ---
try:
    # This is your primary model file containing a dictionary of models for each district
    district_models = joblib.load('district_random_forest_models.pkl')
    print("✅ District models loaded successfully.")
    
    # Load the performance metrics for providing context with predictions
    district_metrics = pd.read_json('district_performance_metrics.json').to_dict()
    print("✅ District performance metrics loaded successfully.")

    # Load the master dataset to get the correct feature columns
    # The model expects inputs in the exact same order as it was trained on
    master_df = pd.read_csv('tourist_demand_forcasting_master.csv')
    
    # One-hot encode categorical features to get all possible columns
    master_df_encoded = pd.get_dummies(master_df, columns=['Season', 'Event_Impact'], drop_first=True)
    
    # This is the definitive list of columns the model expects
    MODEL_FEATURES = [col for col in master_df_encoded.columns if col not in ['Year', 'Month', 'District', 'Tourist_Nights', 'Total_Arrivals', 'India', 'UK', 'China', 'Germany', 'Russia', 'Other']]
    
    print(f"✅ Model features loaded. Expecting {len(MODEL_FEATURES)} input features.")

except FileNotFoundError as e:
    print(f"❌ ERROR: Critical file not found: {e}. Make sure model and data files are in the 'backend' folder.")
    exit()

# --- HELPER FUNCTIONS ---
def generate_recommendations(prediction, district):
    """Generates simple rule-based advice based on the forecast."""
    mae = district_metrics.get(district, {}).get("MAE", 5000)
    
    if prediction > 100000:
        return ["High alert! Expect a major influx of tourists. Staff up and prepare logistics.", 
                "Create premium tour packages; demand will be high.",
                "Collaborate with hotels to manage bookings."]
    elif prediction > 50000:
        return ["High demand forecast. Ensure your booking calendar is updated.",
                "Focus marketing on top-rated attractions for this period.",
                f"Check for major events in {district} and tailor offers."]
    else:
        return ["Moderate demand. Good opportunity for targeted marketing.",
                "Offer early-bird discounts to secure advance bookings.",
                "Highlight unique, off-the-beaten-path experiences in your tours."]

# --- API ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        district = data.get('district')

        if not district or district not in district_models:
            return jsonify({'error': 'Invalid or missing district'}), 400

        # --- 1. PREPARE THE INPUT DATAFRAME ---
        # Create a single-row DataFrame from the incoming request data
        input_df = pd.DataFrame([data])

        # Create lag feature (using a simple placeholder for this live prediction)
        # In a real-world scenario, you might fetch this value from a database
        input_df['Tourist_Nights_Lag_12'] = data.get('tourist_nights_last_year', 0)

        # One-hot encode the categorical features just like in the notebook
        input_df_encoded = pd.get_dummies(input_df, columns=['Season', 'Event_Impact'], drop_first=True)

        # Align the input DataFrame with the model's expected feature set
        # This is a critical step! It ensures all columns are present and in the correct order.
        input_df_aligned = input_df_encoded.reindex(columns=MODEL_FEATURES, fill_value=0)

        # --- 2. SELECT THE CORRECT MODEL AND PREDICT ---
        model = district_models[district]
        prediction = model.predict(input_df_aligned)[0]

        # --- 3. GATHER METRICS AND RECOMMENDATIONS ---
        metrics = district_metrics.get(district, {})
        recommendations = generate_recommendations(prediction, district)
        
        # --- 4. CONSTRUCT AND RETURN THE RESPONSE ---
        response = {
            'district': district,
            'predicted_tourist_nights': round(prediction),
            'mae_confidence': round(metrics.get('MAE', 0)),
            'smape_percent_error': round(metrics.get('sMAPE', 0), 2),
            'ai_recommendations': recommendations
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
