import pandas as pd

# Load your dataset
df = pd.read_csv(r'D:\ceylone-travelgine\mi-pipeline\vendor_forcast\dataset\vendor_demand_forcast_train.csv')

# 1. Get 10 vendor IDs and their names
vendors = df[['Vendor_ID', 'Vendor_Name']].drop_duplicates().head(10)
print("Vendor ID, Vendor Name")
print(vendors.to_string(index=False))

# 2. Get 50 product/item IDs, names, and categories
items = df[['Item_ID', 'Item_Name', 'Item_Category']].drop_duplicates().head(50)
print("\nItem ID, Item Name, Item Category")
print(items.to_string(index=False))

# 3. Get items with their related vendor
item_vendor = df[['Item_ID', 'Item_Name', 'Item_Category', 'Vendor_ID', 'Vendor_Name']].drop_duplicates().head(50)
print("\nItem ID, Item Name, Item Category, Vendor ID, Vendor Name")
print(item_vendor.to_string(index=False))