import json

def agregar_project_id(geojson_path, project_id, output_path=None):
    # Abrir archivo GeoJSON
    with open(geojson_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Verificar que sea FeatureCollection
    if data.get("type") != "FeatureCollection":
        print("⚠️ El archivo no es un FeatureCollection válido.")
        return

    # Agregar project_id a cada feature
    for feature in data["features"]:
        if "properties" not in feature:
            feature["properties"] = {}
        feature["properties"]["project_id"] = project_id

    # Si no se especifica output, sobrescribir el original
    if output_path is None:
        output_path = geojson_path

    # Guardar
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Se agregó project_id='{project_id}' a todas las features.")
    print(f"📂 Guardado en: {output_path}")


if __name__ == "__main__":
    geojson_path = input("📂 Ingrese el archivo GeoJSON: ").strip()
    project_id = input("🆔 Ingrese el project_id: ").strip()
    output_path = input("💾 Archivo de salida (Enter para sobrescribir): ").strip() or None

    agregar_project_id(geojson_path, project_id, output_path)

