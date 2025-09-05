import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import math
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CORE CONFIGURATION ---
DAILY_ACTIVITY_TIME_MINUTES = 9 * 60
LUNCH_BREAK_DURATION = 60
LUNCH_INSERTION_TIME = 4 * 60

# --- HELPER FUNCTIONS (The Core Engine Logic) ---
# This section contains the complete, refined logic from your notebook.

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculates the distance between two points on Earth in kilometers."""
    R = 6371
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = map(np.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = np.sin(dlat / 2)**2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c

def get_travel_time(origin_id, dest_id, travel_df, avg_travel_time):
    """Looks up travel time between two POIs from the travel matrix."""
    try:
        return travel_df.loc[(origin_id, dest_id), 'duration_seconds']
    except KeyError:
        try:
            return travel_df.loc[(dest_id, origin_id), 'duration_seconds']
        except KeyError:
            return avg_travel_time

def find_starting_poi(interests, district, df, vectorizer, matrix):
    """Finds the best single starting point using TF-IDF content similarity."""
    query_vec = vectorizer.transform([interests])
    sim_scores = cosine_similarity(query_vec, matrix).flatten()
    best_idx, highest_score = -1, -1
    for i, score in enumerate(sim_scores):
        poi = df.iloc[i]
        if score > highest_score and poi['district'].lower() == district.lower() and "Accommodation" not in poi['primary_category']:
            highest_score, best_idx = score, i
    return df.iloc[best_idx] if best_idx != -1 else None

def get_smart_duration(poi):
    """Assigns a default duration if the original is 0 or missing."""
    duration = poi['duration_minutes']
    if pd.isna(duration) or duration == 0:
        category = poi['primary_category']
        if 'Nature' in category or 'Park' in category: return 120
        if 'Historical' in category or 'Religious' in category or 'Museum' in category: return 60
        if 'Retail' in category: return 45
        return 30
    return duration

def get_content_based_suggestion(used_ids, last_poi, interests, district, df, tfidf_matrix, tfidf):
    """Finds a relevant nearby POI using TF-IDF as a fallback for the DL model."""
    query_vec = tfidf.transform([interests])
    sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
    candidates = df[~df['location_id'].isin(used_ids) & (df['district'].str.lower() == district.lower()) & (~df['primary_category'].str.contains("Accommodation"))].copy()
    if candidates.empty: return None
    candidates['relevance'] = sim_scores[candidates.index]
    candidates['distance'] = candidates.apply(lambda row: haversine_distance(last_poi['latitude'], last_poi['longitude'], row['latitude'], row['longitude']), axis=1)
    candidates['final_score'] = candidates['relevance'] - (candidates['distance'] * 0.01)
    return candidates.sort_values(by='final_score', ascending=False).iloc[0]

def generate_smart_itinerary(start_poi, num_days, max_budget, interests, model, tokenizer, params, df, tfidf_matrix, tfidf, travel_df, avg_travel_time):
    """Generates an itinerary using the HYBRID DL + Content-Based approach."""
    itinerary, used_poi_ids = {}, {start_poi['location_id']}
    vocab_size, max_seq_length = params[0], params[1]
    int_to_poi = {v: k for k, v in tokenizer.word_index.items()}
    current_start_poi = start_poi

    for day in range(1, num_days + 1):
        start_duration = get_smart_duration(current_start_poi)
        itinerary[f"Day {day}"] = [{'name': current_start_poi['poi_name'], 'type': 'activity', 'travel_time': 0, 'duration': start_duration}]
        time_elapsed = start_duration
        current_sequence_ids = [current_start_poi['location_id']]
        last_poi_for_day = current_start_poi

        while time_elapsed < DAILY_ACTIVITY_TIME_MINUTES - 30:
            predicted_poi = None
            token_list = tokenizer.texts_to_sequences([current_sequence_ids])[0]
            padded_sequence = pad_sequences([token_list], maxlen=max_seq_length, padding='pre')
            predictions = model.predict(padded_sequence, verbose=0)[0]
            sorted_preds_indices = np.argsort(predictions)[::-1]

            for poi_int_index in sorted_preds_indices[:50]:
                poi_id = int_to_poi.get(poi_int_index)
                if poi_id and poi_id not in used_poi_ids:
                    details_df = df[df['location_id'] == poi_id]
                    if not details_df.empty and "Accommodation" not in details_df.iloc[0]['primary_category']:
                        predicted_poi = details_df.iloc[0]
                        break
            
            if predicted_poi is None:
                predicted_poi = get_content_based_suggestion(used_poi_ids, last_poi_for_day, interests, start_poi['district'], df, tfidf_matrix, tfidf)
            
            if predicted_poi is None: break

            travel_secs = get_travel_time(last_poi_for_day['location_id'], predicted_poi['location_id'], travel_df, avg_travel_time)
            travel_mins = math.ceil(travel_secs / 60)
            visit_duration = get_smart_duration(predicted_poi)
            total_time_needed = visit_duration + travel_mins

            if (time_elapsed + total_time_needed) <= DAILY_ACTIVITY_TIME_MINUTES and predicted_poi['cost_lkr'] <= max_budget:
                itinerary[f"Day {day}"].append({'name': predicted_poi['poi_name'], 'type': 'activity', 'travel_time': travel_mins, 'duration': visit_duration})
                time_elapsed += total_time_needed
                used_poi_ids.add(predicted_poi['location_id'])
                current_sequence_ids.append(predicted_poi['location_id'])
                last_poi_for_day = predicted_poi
            else:
                continue 

        if day < num_days:
             next_start_df = df[~df['location_id'].isin(used_poi_ids) & (df['district'].str.lower() == start_poi['district'].lower()) & (~df['primary_category'].str.contains("Accommodation"))].head(1)
             if not next_start_df.empty:
                current_start_poi = next_start_df.iloc[0]
             else:
                break
    return itinerary

def get_nearby_alternatives(itinerary_pois, user_interests, district, df, tfidf_matrix, tfidf, top_n=5):
    query_vec = tfidf.transform([user_interests])
    sim_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
    district_df = df[df['district'].str.lower() == district.lower()].copy()
    district_df['relevance'] = sim_scores[district_df.index]
    sorted_candidates = district_df.sort_values(by='relevance', ascending=False)
    alternatives = []
    for _, poi in sorted_candidates.iterrows():
        if poi['poi_name'] not in itinerary_pois:
            alternatives.append(poi['poi_name'])
        if len(alternatives) >= top_n: break
    return alternatives

# --- FLASK WEB APP SETUP ---
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing for frontend

# --- GLOBAL VARIABLES & ONE-TIME MODEL LOADING ---
print("--- Initializing AI Engine: Loading all models and data... ---")
try:
    # Define artifact filenames
    MASTER_POI_FILE = 'master_poi_data_final.csv'
    TRAVEL_MATRIX_FILE = 'travel_matrix.csv' # IMPORTANT: Ensure this file is present
    MODEL_FILE = 'itinerary_prediction_model.keras'
    TOKENIZER_FILE = 'tokenizer.pkl'
    PARAMS_FILE = 'training_params.npy'

    # Load data
    DF = pd.read_csv(MASTER_POI_FILE)
    TRAVEL_DF = pd.read_csv(TRAVEL_MATRIX_FILE)
    
    # Load AI models and processors
    MODEL = tf.keras.models.load_model(MODEL_FILE)
    with open(TOKENIZER_FILE, 'rb') as f: TOKENIZER = pickle.load(f)
    PARAMS = np.load(PARAMS_FILE)
    
    # Create the TF-IDF vectorizer and matrix from scratch
    # This avoids needing the large cosine_similarity_matrix.joblib file
    TFIDF = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    DF['combined_features'] = DF['combined_features'].astype(str).fillna('')
    TFIDF_MATRIX = TFIDF.fit_transform(DF['combined_features'])

    TRAVEL_DF.set_index(['origin_poi_id', 'destination_poi_id'], inplace=True)
    AVG_TRAVEL_TIME = TRAVEL_DF['duration_seconds'].mean()
    DISTRICTS = sorted(DF['district'].unique().astype(str))
    
    print("--- AI Engine Loaded Successfully. Server is ready to accept requests. ---")
    
except Exception as e:
    print(f"FATAL ERROR: Could not load AI artifacts. Ensure all files are present: {e}")
    DF, MODEL, TOKENIZER, PARAMS, TFIDF, TFIDF_MATRIX = [None] * 6

# --- API ENDPOINT ---
@app.route("/api/plan", methods=["POST"])
def plan_itinerary():
    """The main API endpoint that receives user requests and returns an itinerary."""
    if DF is None:
        return jsonify({"error": "AI Engine is not loaded due to a startup error. Check server logs."}), 500

    data = request.json
    user_district = data.get('district')
    user_interests = data.get('interests')
    user_budget = int(data.get('budget', 5000))
    user_days = int(data.get('days', 1))

    if not all([user_district, user_interests]):
        return jsonify({"error": "Missing required fields: 'district' and 'interests'"}), 400

    print(f"Received request: {user_days}-day trip to {user_district} for '{user_interests}'")

    start_poi = find_starting_poi(user_interests, user_district, DF, TFIDF, TFIDF_MATRIX)
    
    if start_poi is not None:
        print(f"Found starting POI: {start_poi['poi_name']}")
        final_itinerary = generate_smart_itinerary(
            start_poi, user_days, user_budget, user_interests,
            MODEL, TOKENIZER, PARAMS, DF, TFIDF_MATRIX, TFIDF,
            TRAVEL_DF, AVG_TRAVEL_TIME
        )
        all_pois = [item['name'] for day in final_itinerary.values() for item in day]
        alternatives = get_nearby_alternatives(all_pois, user_interests, user_district, DF, TFIDF_MATRIX, TFIDF)
        
        print("Successfully generated itinerary.")
        return jsonify({
            "itinerary": final_itinerary,
            "alternatives": alternatives
        })
    else:
        print("Failed to find a suitable starting POI.")
        return jsonify({"error": "Could not find a suitable starting point. Please try broader interests or a different district."}), 404

if __name__ == '__main__':
    # Instructions:
    # 1. Place this script in the same folder as all your data and model files.
    # 2. Make sure you have travel_matrix.csv in the folder.
    # 3. Run `pip install Flask Flask-Cors tensorflow pandas scikit-learn` in your terminal.
    # 4. Run this script: `python app.py`
    # 5. The server will start on http://127.0.0.1:5001
    app.run(debug=True, port=5001)

