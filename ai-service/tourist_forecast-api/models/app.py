import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import warnings

# Suppress scikit-learn version warnings for cleaner output
warnings.filterwarnings("ignore", category=UserWarning, message="Trying to unpickle estimator RandomForestRegressor from version")

# --- INITIALIZATION ---
app = Flask(__name__)
CORS(app) 

# --- LOAD MODELS & THE DEFINITIVE FEATURE LIST AT STARTUP ---
try:
    district_models = joblib.load('district_random_forest_models.pkl')
    print("✅ District models loaded successfully.")
    
    with open('district_performance_metrics.json', 'r') as f:
        district_metrics = json.load(f)
    print("✅ District performance metrics loaded successfully.")

    # ### THE KEY FIX: Load the exact feature list from the file you generated ###
    with open('model_features.json', 'r') as f:
        MODEL_FEATURES = json.load(f)
    print(f"✅ Model features contract loaded successfully from JSON. Expecting {len(MODEL_FEATURES)} features in a specific order.")

except FileNotFoundError as e:
    print(f"❌ CRITICAL ERROR: File not found: {e}. Make sure 'district_random_forest_models.pkl', 'district_performance_metrics.json', and 'model_features.json' are in the 'backend' folder.")
    exit()
except Exception as e:
    print(f"❌ ERROR during startup: {e}")
    exit()

# --- HELPER & API ENDPOINT ---
def generate_recommendations(prediction):
    if prediction > 100000: return ["High alert! Expect a major influx of tourists. Staff up and prepare logistics.", "Create premium tour packages; demand will be high."]
    elif prediction > 50000: return ["High demand forecast. Ensure your booking calendar is updated.", "Focus marketing on top-rated attractions for this period."]
    else: return ["Moderate demand. Good opportunity for targeted marketing.", "Offer early-bird discounts to secure advance bookings."]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        district = data.get('district')

        if not district or district not in district_models:
            return jsonify({'error': 'Invalid or missing district'}), 400

        # --- PREPARE INPUT DATAFRAME ---
        # 1. Create a DataFrame from the incoming request
        input_df = pd.DataFrame([data])
        
        # 2. Convert data types to match training (e.g., from string '25' to number 25)
        for col in ['Year', 'Tripadvisor_Reviews', 'GoogleTrends_Index', 'Avg_Temperature_C', 'Rainfall_mm', 'Event_Count', 'Sunshine_Hours', 'Total_Arrivals', 'India', 'UK', 'China', 'Germany', 'Russia', 'Other']:
             if col in input_df.columns:
                input_df[col] = pd.to_numeric(input_df[col], errors='coerce').fillna(0)

        # 3. Engineer the features that are derived from user input
        month_map = {'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6, 'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12}
        input_df['Month_Num'] = input_df['Month'].str.lower().map(month_map)
        
        # 4. Add placeholder values for features the model needs but aren't in the UI
        input_df['Tourist_Nights_Lag_12'] = 15000 
        input_df['Forecasted_Total_Arrivals'] = 230000
        
        # 5. One-hot encode the categorical features
        input_df_encoded = pd.get_dummies(input_df, columns=['Season', 'Event_Impact'])

        # 6. Align columns to the master list from the JSON file. This is the critical step.
        # It adds all missing columns (e.g., Season_Southwest Monsoon) with a value of 0 and ensures the order is correct.
        input_df_aligned = input_df_encoded.reindex(columns=MODEL_FEATURES, fill_value=0)
        
        # 7. Predict using the perfectly aligned DataFrame
        model = district_models[district]
        prediction = model.predict(input_df_aligned)[0]

        # --- CONSTRUCT AND RETURN THE RESPONSE ---
        metrics = district_metrics.get(district, {})
        response = {
            'district': district,
            'predicted_tourist_nights': round(prediction),
            'mae_confidence': round(metrics.get('MAE', 0)),
            'smape_percent_error': round(metrics.get('sMAPE', 0), 2),
            'ai_recommendations': generate_recommendations(prediction)
        }
        return jsonify(response)

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': f'An error occurred on the server: {e}. Check terminal for details.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

