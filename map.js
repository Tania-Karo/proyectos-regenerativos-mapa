
// Bounds de la imagen satelital (lat, lng)
const imageBounds = [
  [-55.0474099, -81.3314702], // SW: lat_min, lon_min
  [  5.2729813, -34.7908973]  // NE: lat_max, lon_max
];

// Centrar el mapa en Boquerón, Paraguay (lat, lng)
const map = L.map('map', {
  minZoom: 4,
  maxZoom: 8,
  maxBounds: imageBounds,
  maxBoundsViscosity: 1.0
});

map.setView([-25.5, -64.0], 6);


L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
  maxZoom: 19,
}).addTo(map);

// Agrego la imagen satelital
const imageUrl = 'images/recortado2021_warped.png';
const imageLayer = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.6 });
imageLayer.addTo(map);

const sidebar = L.control.sidebar({
  autopan: true,
  container: 'sidebar',
  position: 'left'
}).addTo(map);


var cowIcon = L.icon({
    iconUrl: 'icons/cow2.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

var soybeanIcon = L.icon({
    iconUrl: 'icons/soybean4.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Leer lista de archivos geojson
fetch('geojson_files.json')
  .then(response => response.json())
  .then(files => {
    let total = 0;

    files.forEach((file) => {
      fetch(file)
        .then(resp => resp.json())
        .then(data => {
          console.log("Cargando archivo:", file, data);

          // Agregar polígonos y líneas (pero NO markers default)
          L.geoJSON(data, {
            pointToLayer: () => null
          }).addTo(map);

          // Manejar los puntos con íconos personalizados
          data.features.forEach((feature) => {
            let props = feature.properties;
            let lat = props.marker_lat;
            let lon = props.marker_lon;

            console.log("Feature:", props.name, lat, lon, feature.geometry);

            if (lat && lon) {
              let icon = ((total % 2) === 0) ? cowIcon : soybeanIcon;
              total++;

              L.marker([lat, lon], { icon: icon })
                .on('click', () => {
                    const html = `
                      <h3>${props.name || "Predio"}</h3>
                      <p><strong>Empresa:</strong> ${props.companyName || "N/A"}</p>
                      <p><strong>Región:</strong> ${props.region || "N/A"}</p>
                    `;
                    document.getElementById('sidebar-content').innerHTML = html;
                    sidebar.open('info');

                    // Centramos y hacemos zoom gradual
                    map.flyTo([lat, lon], 10, {
                        animate: true,
                        duration: 2 // Duración en segundos
                    });
                })
                .addTo(map);
            }
          });
        })
        .catch(err => console.error("Error cargando archivo:", file, err));
    });
  })
  .catch(err => console.error("Error leyendo geojson_files.json", err));
