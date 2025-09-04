# D:\ceylone-travelgine\ai-service\vendor-forecast-api\models\fix_model_save.py
import joblib
import xgboost as xgb
import os

print("Current directory:", os.getcwd())
print("Files in folder:", os.listdir("."))

# Load the old .pkl model
print("\n🔄 Loading xgb_model.pkl...")
try:
    model = joblib.load('xgb_model.pkl')
    print("✅ Successfully loaded xgb_model.pkl")
except Exception as e:
    print("❌ Error loading xgb_model.pkl:", str(e))
    print("Make sure xgb_model.pkl is in this folder!")
    exit()

# Save as stable .json format
print("\n💾 Saving as xgb_model.json...")
try:
    model.save_model('xgb_model.json')
    print("✅ Success! xgb_model.json created.")
except Exception as e:
    print("❌ Error saving model:", str(e))