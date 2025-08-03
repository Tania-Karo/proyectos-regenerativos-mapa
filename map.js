// Centrar el mapa en Boquerón, Paraguay (lat, lng)
var map = L.map('map').setView([-21.5821, -60.7924], 8);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
}).addTo(map);

var marker;

map.on('click', function (e) {
  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
  marker.bindPopup("Lat: " + e.latlng.lat.toFixed(5) + "<br>Lng: " + e.latlng.lng.toFixed(5)).openPopup();
});

var cowIcon = L.icon({
    iconUrl: 'icons/cow.png',
    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var soybeanIcon = L.icon({
    iconUrl: 'icons/soybean.png',
    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


L.marker([-21.79011, -60.83679], {icon: cowIcon}).addTo(map);
L.marker([-21.65105, -60.66925], {icon: soybeanIcon}).addTo(map);

// Capa 1
fetch('geojson/api_carbono-transparente_layers_properties_1_regions-ids_4_pilot-sites-ids_palmeirassa_companies-codes.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: "blue" } // estilo opcional
    }).addTo(map);
  });

// Capa 2
fetch('geojson/jeroviasa.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: "red" } // estilo opcional
    }).addTo(map);
  });





