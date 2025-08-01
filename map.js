// Centrar el mapa en Boquerón, Paraguay (lat, lng)
var map = L.map('map').setView([-21.5821, -60.7924], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Función para cargar múltiples archivos GeoJSON desde una lista
// Aca probamos con lo de PY
function loadGeoJSONFiles(fileList, folder = 'geojsonfy_cleaned_urlPY_scrape_20250726_132726') {
    fileList.forEach((fileName, i) => {
        fetch(`${folder}/${fileName}`)
            .then(response => response.json())
            .then(data => {
                const layer = L.geoJSON(data, {
                    style: {
                        color: getRandomColor(i),
                        weight: 2,
                        fillOpacity: 0
                    }
                }).addTo(map);

                // Zoom al primer layer cargado
                if (i === 0) map.fitBounds(layer.getBounds());
            })
            .catch(err => console.error(`Error cargando ${fileName}:`, err));
    });
}

// Colores distintos por capa
function getRandomColor(index) {
    const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];
    return colors[index % colors.length];
}

// EDITAR Lista de archivos GeoJSON (debe coincidir con nombres reales en /geojson)

const geojsonFiles = [
  "api_carbono-transparente_layers_biodiversities_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_biodiversities_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_biodiversities_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_biodiversities_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_biodiversities_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_crop-rotation-systems_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_crop-rotation-systems_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_crop-rotation-systems_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_crop-rotation-systems_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_crop-rotation-systems_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_deforestation-dates_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_deforestation-dates_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_deforestation-dates_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_deforestation-dates_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_deforestation-dates_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_forest-samples_natural-unit_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_forest-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_forest-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_forest-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_forest-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_natural-environments_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_natural-environments_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_natural-environments_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_natural-environments_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_natural-environments_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_otbns_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_otbns_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_otbns_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_otbns_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_otbns_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_pilot-sites_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_properties_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_properties_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_properties_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_properties_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_regions_1_regions-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_natural-unit_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_soil-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_natural-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_soil-samples_productive-unit_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_productive-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_soil-samples_productive-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_productive-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-samples_productive-unit_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_layers_soil-types_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_layers_soil-types_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_layers_soil-types_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22%2C23_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-types_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes_22_properties-ids.geojson",
  "api_carbono-transparente_layers_soil-types_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
  "api_carbono-transparente_parameters_options_1_regions-ids.geojson",
  "api_carbono-transparente_parameters_options_1_regions-ids_4_pilot-sites-ids.geojson",
  "api_carbono-transparente_parameters_options_1_regions-ids_4_pilot-sites-ids_palmeirassa%2Cjeroviasa_companies-codes.geojson",
  "api_carbono-transparente_parameters_options_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson",
];

// Cargar los archivos
loadGeoJSONFiles(geojsonFiles);

