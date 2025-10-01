
// Bounds de la imagen satelital (lat, lng)
const imageBounds = [
  [-55.0474099, -81.3314702], // SW: lat_min, lon_min
  [  5.2729813, -34.7908973]  // NE: lat_max, lon_max
];

// Centrar el mapa en Boquerón, Paraguay (lat, lng)
const map = L.map('map', {
  minZoom: 4,
  maxZoom: 15,
  maxBounds: imageBounds,
  maxBoundsViscosity: 1.0
});

map.setView([-21.885563, -59.824846], 5);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
  maxZoom: 19,
}).addTo(map);

// Imagen satelital de emissions
const imageUrl1 = 'images/recortado2021_warped.png';
const emissionsLayer = L.imageOverlay(imageUrl1, imageBounds, { opacity: 0.6 });



// Popup inicial

let bounds = map.getBounds();
let se = bounds.getSouthEast(); // esquina inferior derecha

// Corrimiento: +lat = más al norte (arriba), -lng = más al oeste (izquierda)
let offsetLat = 8;   // grados hacia arriba
let offsetLng = 4;   // grados hacia la izquierda

let offsetPos = L.latLng(se.lat - offsetLat, se.lng - offsetLng);

let popupDefault = L.popup({
    autoPan: true,
    autoPanPadding: L.point(10, 10)
})
.setLatLng(offsetPos)
.setContent('<div id="popUp"><h6>...</h6></div>')
.openOn(map);

const sidebar = L.control.sidebar({
  autopan: true,
  container: 'sidebar',
  position: 'left'
}).addTo(map);


const cowIcon = L.icon({
    iconUrl: 'icons/cow2.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const soybeanIcon = L.icon({
    iconUrl: 'icons/soybean4.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});


// Función auxiliar para elegir el ícono según land_use
function getIconByLandUse(land_use) {
  if (!land_use) return soybeanIcon; // default
  if (land_use.toLowerCase() === "cow") return cowIcon;
  if (land_use.toLowerCase() === "soybean") return soybeanIcon;
  return soybeanIcon; // fallback
}

let projectsData = {};
let projectLayers = {}; // <<< guardamos capas por project_id

// 1. Cargar JSON maestro
fetch('markerproperties.json')
  .then(resp => resp.json())
  .then(data => {
    projectsData = data;
    console.log("Projects data:", projectsData);

    // 2. Ahora cargar los GeoJSON
    return fetch('geojson_files.json');
  })
  .then(response => response.json())
  .then(files => {
    files.forEach((file) => {
      fetch(file)
        .then(resp => resp.json())
        .then(data => {
          console.log("Cargando archivo:", file);

          // 3. Agregar features del GeoJSON
          L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              let projectId = feature.properties.project_id;
              if (!projectId) return null;

              // Crear círculo de 10 km
              let circle = L.circle(latlng, {
                radius: 10000, // 10 km
                color: "#3388ff",
                weight: 2
              });

              // Crear ícono según land_use
              let meta = projectsData[projectId];
              let marker = null;
              if (meta) {
                let icon = getIconByLandUse(meta.land_use);
                marker = L.marker(latlng, { icon: icon });

                [circle, marker].forEach(layer => {
                  layer.on('click', () => {
                    highlightProject(projectId);
                    showSidebar(meta, latlng);
                  });
                });
              }

              // Guardar referencias
              if (!projectLayers[projectId]) {
                projectLayers[projectId] = [];
              }
              projectLayers[projectId].push(circle);
              if (marker) projectLayers[projectId].push(marker);

              return marker ? L.featureGroup([circle, marker]) : circle;
            },
            onEachFeature: (feature, layer) => {
              // Polígonos y demás geometrías
              if (feature.geometry.type !== "Point") {
                let projectId = feature.properties.project_id;
                if (projectId) {
                  if (!projectLayers[projectId]) {
                    projectLayers[projectId] = [];
                  }
                  projectLayers[projectId].push(layer);

                  if (projectsData[projectId]) {
                    layer.on('click', () => {
                      highlightProject(projectId);
                      showSidebar(projectsData[projectId]);
                    });
                  }
                }
              }
            }
          }).addTo(map);

          // 4. Manejar markers desde el JSON maestro
          data.features.forEach((feature) => {
            let projectId = feature.properties.project_id;
            if (projectId && projectsData[projectId]) {
              let meta = projectsData[projectId];
              let lat = meta.marker_lat;
              let lon = meta.marker_lon;

              if (lat && lon) {
                let icon = getIconByLandUse(meta.land_use);

                L.marker([lat, lon], { icon: icon })
                  .on('click', () => {
                    highlightProject(projectId);
                    showSidebar(meta, [lat, lon]);
                  })
                  .addTo(map);
              }
            }
          });

        })
        .catch(err => console.error("Error cargando archivo:", file, err));
    });
  })
  .catch(err => console.error("Error inicial:", err));


// Función para mostrar en sidebar
function showSidebar(meta, coords) {
  let html = `<h3>${meta.name || "Predio"}</h3>`;

  function addField(label, value) {
    if (value !== null && value !== undefined && value !== "") {
      html += `<p><strong>${label}:</strong> ${value}</p>`;
    }
  }

  addField("Empresa", meta.companyName);
  addField("Tipo", meta.type);
  addField("Región", meta.region);
  addField("Tamaño", meta.size);
  addField("Apoyado por", meta.supported_by);
  addField("Estado", meta.status);

  document.getElementById('sidebar-details').innerHTML = html;
  sidebar.open('info');

  if (coords) {
    map.flyTo(coords, 11, {
      animate: true,
      duration: 2
    });
  }
}

// Función para resaltar todas las capas con el mismo project_id
function highlightProject(projectId) {
  Object.values(projectLayers).forEach(layers => {
    layers.forEach(layer => {
      if (layer.setStyle) {
        layer.setStyle({ color: "#3388ff", weight: 2 }); // estilo default
      }
    });
  });

  if (projectLayers[projectId]) {
    projectLayers[projectId].forEach(layer => {
      if (layer.setStyle) {
        layer.setStyle({ color: "red", weight: 4 });
      }
    });
  }
}

// Cerrar sidebar solo si el click fue en el fondo del mapa
map.on('click', (e) => {
  if (!e.originalEvent.target.closest('.leaflet-interactive')) {
    sidebar.close();
  }
});


// Agregar listeners a los botones del sidebar
document.getElementById('btnEmissions').addEventListener('click', () => {
  console.log("Botón Emisiones clickeado");
  //  acá iría tu lógica para mostrar/ocultar la capa de emisiones
  // Ejemplo:
   if (map.hasLayer(emissionsLayer)) {
     map.removeLayer(emissionsLayer);
   } else {
     map.addLayer(emissionsLayer);
   }
});

document.getElementById('btnFires').addEventListener('click', () => {
  console.log("Botón Fuego clickeado");
  // lógica para mostrar/ocultar la capa de focos de incendio
});





