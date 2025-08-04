// Centrar el mapa en Boquerón, Paraguay (lat, lng)
var map = L.map('map').setView([-25.5, -64.0], 6);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
}).addTo(map);

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
    files.forEach((file, i) => {
      fetch(file)
        .then(resp => resp.json())
        .then(data => {
          L.geoJSON(data).addTo(map); // Cargar capa completa

          data.features.forEach((feature, j) => {
            let props = feature.properties;
            let lat = props.marker_lat;
            let lon = props.marker_lon;

            if (lat && lon) {
              let icon = ((total % 2) === 0) ? cowIcon : soybeanIcon;
              total++;

              // Crear el marcador
              L.marker([lat, lon], { icon: icon })
                .on('click', () => {
                  const html = `
                    <h3>${props.name || "Predio"}</h3>
                    <p><strong>Empresa:</strong> ${props.companyName || "N/A"}</p>
                    <p><strong>Región:</strong> ${props.region || "N/A"}</p>
                  `;
                  document.getElementById('sidebar-content').innerHTML = html;
                  sidebar.open('info');
                })
                .addTo(map);
            }
          });
        });
    });
  });
