import os
import json

geojson_dir = 'geojson'
geojson_files = []

for root, _, files in os.walk(geojson_dir):
    for file in files:
        if file.endswith('.geojson'):
            path = os.path.join(root, file)
            geojson_files.append(path.replace("\\", "/"))  # Windows fix

with open('geojson_files.json', 'w') as f:
    json.dump(geojson_files, f, indent=2)

print(f"{len(geojson_files)} archivos .geojson listados en geojson_files.json")
