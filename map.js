// Centrar el mapa en Boquerón, Paraguay (lat, lng)
var map = L.map('map').setView([-21.5821, -60.7924], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



