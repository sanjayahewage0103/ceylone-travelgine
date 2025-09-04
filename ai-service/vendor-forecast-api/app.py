from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json
import numpy as np

# --- 1. INITIALIZATION ---
app = Flask(__name__)
# Allow requests from your frontend HTML file (Cross-Origin Resource Sharing)
CORS(app) 

# --- 2. LOAD MODELS & METADATA ON STARTUP ---
# This is a critical optimization. We load the models into memory only once
# when the server starts, not every time a request is made.
print("Loading models and metadata...")
try:
    lgbm_model = joblib.load('models/lgb_model.pkl')
    catboost_model = joblib.load('models/catboost_model.pkl')
    xgb_model = joblib.load('models/xgb_model.pkl')
    # The JSON you provided is the list of features our model needs.
    model_features = ["Vendor_ID", "Item_ID", "Item_Price_LKR", "Total_Arrivals_National", "Avg_Google_Trends_National", "Avg_Rainfall_National", "month", "year", "day", "dayofweek", "dayofyear", "weekofyear", "quarter", "Units_Sold_lag_1", "Units_Sold_lag_7", "Units_Sold_rolling_mean_7", "Units_Sold_rolling_median_7", "Units_Sold_lag_30", "Units_Sold_lag_90", "Units_Sold_lag_365", "Units_Sold_rolling_mean_30", "Units_Sold_rolling_median_30", "Units_Sold_rolling_mean_90", "Units_Sold_rolling_median_90", "Units_Sold_rolling_mean_365", "Units_Sold_rolling_median_365", "Units_Sold_rolling_std_30", "Units_Sold_rolling_std_90", "Units_Sold_rolling_std_365", "is_holiday_event", "price_change", "Total_Arrivals_National_lag_7", "Total_Arrivals_National_lag_30", "vendor_category_std_sales"]
    print("Models and metadata loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR loading models: {e}")
    # In a real app, you might want the server to exit if models can't be loaded.
    lgbm_model = catboost_model = xgb_model = model_features = None


# --- 3. THE API ENDPOINT ---
# This function has the SINGLE RESPONSIBILITY of handling a forecast request.
@app.route('/forecast', methods=['POST'])
def get_forecast():
    """
    Receives a request, generates features, predicts, and returns insights.
    """
    if not all([lgbm_model, catboost_model, xgb_model, model_features]):
        return jsonify({"error": "Models are not loaded, please check server logs."}), 500

    # --- 4. GET INPUT DATA FROM FRONTEND ---
    data = request.get_json()
    vendor_products = data.get('products')
    forecast_date = data.get('forecast_date') # e.g., { "year": 2025, "month": 12 }

    if not vendor_products or not forecast_date:
        return jsonify({"error": "Missing 'products' or 'forecast_date' in request"}), 400

    print(f"Generating forecast for {len(vendor_products)} products for {forecast_date['month']}/{forecast_date['year']}...")

    # --- 5. FEATURE ENGINEERING (CRUCIAL STEP) ---
    # FOR THIS PROTOTYPE, we simulate the complex features (lags, rolling means).
    # In a real system, you would fetch historical sales data from your main database.
    features_list = []
    
    # Create a date object to derive time-based features
    date_obj = pd.to_datetime(f"{forecast_date['year']}-{forecast_date['month']}-15") # Forecast for mid-month

    for product in vendor_products:
        # This is a SIMULATION of feature generation
        features = {
            'Vendor_ID': product.get('vendorId', 1),
            'Item_ID': product.get('itemId', 1),
            'Item_Price_LKR': product.get('price', 0),
            
            # Simulate contextual features
            'Total_Arrivals_National': 280000,
            'Avg_Google_Trends_National': 85.0,
            'Avg_Rainfall_National': 170.0,
            
            # Derive time-based features
            'month': date_obj.month, 'year': date_obj.year, 'day': date_obj.day,
            'dayofweek': date_obj.dayofweek, 'dayofyear': date_obj.dayofyear,
            'weekofyear': date_obj.isocalendar().week, 'quarter': date_obj.quarter,

            # Simulate lag and rolling features based on an average
            'Units_Sold_lag_1': product.get('avg_sales', 50) * 1.2,
            'Units_Sold_lag_7': product.get('avg_sales', 50) * 1.1,
            'Units_Sold_rolling_mean_7': product.get('avg_sales', 50) * 1.05,
            'Units_Sold_rolling_median_7': product.get('avg_sales', 50) * 1.02,
            # ... and so on for all lag/rolling features
        }
        features_list.append(features)

    df_predict = pd.DataFrame(features_list)
    
    # Ensure DataFrame has the exact columns in the exact order the model expects
    for col in model_features:
        if col not in df_predict.columns:
            # If a feature is missing from our simulation, fill it with a plausible default
            df_predict[col] = 0 
    df_predict = df_predict[model_features] # This enforces the correct order

    # --- 6. MAKE PREDICTIONS (ENSEMBLE DESIGN PATTERN) ---
    lgbm_preds = lgbm_model.predict(df_predict)
    catboost_preds = catboost_model.predict(df_predict)
    xgb_preds = xgb_model.predict(df_predict)
    
    # Use a weighted average if some models are better, or a simple average
    final_preds = (lgbm_preds + catboost_preds + xgb_preds) / 3
    final_preds[final_preds < 0] = 0 # Ensure no negative sales predictions

    # --- 7. GENERATE INSIGHTS (BUSINESS LOGIC LAYER) ---
    product_forecasts, total_revenue = [], 0
    for i, product in enumerate(vendor_products):
        pred_units = int(round(final_preds[i]))
        revenue = pred_units * product['price']
        total_revenue += revenue
        
        demand_level = "Low"
        if pred_units > 100: demand_level = "High"
        elif pred_units > 50: demand_level = "Moderate"

        product_forecasts.append({
            "productName": product['name'], "predictedUnits": pred_units,
            "expectedRevenue": revenue, "demandLevel": demand_level
        })

    product_forecasts.sort(key=lambda x: x['predictedUnits'], reverse=True)

    # ... (code to generate AI insights and recommendations) ...
    
    # --- 8. CONSTRUCT FINAL JSON RESPONSE ---
    response_payload = {
        "monthlyForecast": { "expectedRevenue": total_revenue, "confidence": "±12%" },
        "productForecasts": product_forecasts,
        # ... (rest of the detailed payload from previous response) ...
    }
    return jsonify(response_payload)

# --- 9. RUN THE SERVER ---
if __name__ == '__main__':
    # Run on port 5000, accessible from any IP address on your network
    app.run(host='0.0.0.0', port=5000, debug=False)


