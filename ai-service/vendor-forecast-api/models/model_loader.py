import joblib
import os
import xgboost as xgb

def load_models():
    model_dir = os.path.dirname(__file__)
    
    # Load XGBoost from .json (stable format)
    xgb_model = xgb.Booster()
    xgb_model.load_model(os.path.join(model_dir, "xgb_model.json"))
    
    lgb_model = joblib.load(os.path.join(model_dir, "lgb_model.pkl"))
    cat_model = joblib.load(os.path.join(model_dir, "catboost_model.pkl"))
    
    return xgb_model, lgb_model, cat_model

def load_feature_list():
    model_dir = os.path.dirname(__file__)
    with open(os.path.join(model_dir, "model_features.json"), 'r') as f:
        import json
        return json.load(f)