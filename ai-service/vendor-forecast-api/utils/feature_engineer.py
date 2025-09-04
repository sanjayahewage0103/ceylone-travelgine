# ai-service/vendor-forecast-api/utils/feature_engineer.py
import pandas as pd

def create_features(vendor_id, item_id, date_str):
    date = pd.to_datetime(date_str)
    # Simulate historical data
    past_sales = [70, 65, 72, 68, 75, 80, 70]

    features = {
        'Vendor_ID': vendor_id,
        'Item_ID': item_id,
        'Item_Price_LKR': 4500,
        'Total_Arrivals_National': 280000,
        'Avg_Google_Trends_National': 50,
        'Avg_Rainfall_National': 100,
        'month': date.month,
        'year': date.year,
        'day': date.day,
        'dayofweek': date.dayofweek,
        'dayofyear': date.dayofyear,
        'weekofyear': date.isocalendar().week,
        'quarter': (date.month - 1) // 3 + 1,
        'Units_Sold_lag_1': past_sales[-1],
        'Units_Sold_lag_7': past_sales[0],
        'Units_Sold_rolling_mean_7': pd.Series(past_sales).mean(),
        'Units_Sold_rolling_median_7': pd.Series(past_sales).median(),
        'Units_Sold_lag_30': 75,
        'Units_Sold_lag_90': 80,
        'Units_Sold_lag_365': 60,
        'Units_Sold_rolling_mean_30': 72,
        'Units_Sold_rolling_median_30': 71,
        'Units_Sold_rolling_mean_90': 70,
        'Units_Sold_rolling_median_90': 69,
        'Units_Sold_rolling_mean_365': 68,
        'Units_Sold_rolling_median_365': 67,
        'Units_Sold_rolling_std_30': 5.2,
        'Units_Sold_rolling_std_90': 6.1,
        'Units_Sold_rolling_std_365': 7.0,
        'is_holiday_event': 1 if date.month == 12 else 0,
        'price_change': 0.0,
        'Total_Arrivals_National_lag_7': 275000,
        'Total_Arrivals_National_lag_30': 270000,
        'vendor_category_std_sales': 15.0
    }
    return pd.DataFrame([features])