
// Bounds de la imagen satelital (lat, lng)
const imageBounds = [
  [-55.0474099, -81.3314702],
  [  5.2729813, -34.7908973]
];

// Crear mapa
const map = L.map('map', {
  minZoom: 4,
  maxZoom: 15,
  maxBounds: imageBounds,
  maxBoundsViscosity: 1.0
});

map.setView([-21.885563, -59.824846], 6);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
  maxZoom: 19,
}).addTo(map);

// Imagen satelital de emisiones
const imageUrl1 = 'images/recortado2021_warped.png';
const emissionsLayer = L.imageOverlay(imageUrl1, imageBounds, { opacity: 0.6 });

// Popup inicial
let popupDefault = L.popup({
    autoPan: true,
    autoPanPadding: L.point(10, 10)
})
.setLatLng(map.getCenter())
.setContent('<div id="popUp"><h6>Para obtener información sobre un proyecto de carbono, hacer click en un ícono o predio. Los predios de un mismo proyecto seleccionado se resaltan en rojo</h6></div>')
.openOn(map);


// Sidebar
const sidebar = L.control.sidebar({
  autopan: true,
  container: 'sidebar',
  position: 'left'
}).addTo(map);

// Íconos
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

// Elegir ícono según land_use
function getIconByLandUse(land_use) {
  if (!land_use) return soybeanIcon;
  if (land_use.toLowerCase() === "cow") return cowIcon;
  if (land_use.toLowerCase() === "soybean") return soybeanIcon;
  return soybeanIcon;
}

let projectsData = {};
let projectLayers = {};

// Cargar datos
fetch('markerproperties.json')
  .then(resp => resp.json())
  .then(data => {
    projectsData = data;
    console.log("Projects data:", projectsData);
    return fetch('geojson_files.json');
  })
  .then(response => response.json())
  .then(files => {
    files.forEach((file) => {
      fetch(file)
        .then(resp => resp.json())
        .then(data => {
          console.log("Cargando archivo:", file);

          L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              let projectId = feature.properties.project_id;
              if (!projectId) return null;

              let circle = L.circle(latlng, {
                radius: 5000,
                color: "#3388ff",
                weight: 2
              });

              let meta = projectsData[projectId];
              let marker = null;
              if (meta) {
                let icon = getIconByLandUse(meta.land_use);
                marker = L.marker(latlng, { icon: icon });

                let group = L.featureGroup([circle, marker]);

                // Guardamos el círculo para resaltar
                if (!projectLayers[projectId]) projectLayers[projectId] = [];
                projectLayers[projectId].push(circle);

                group.on('click', () => {
                  highlightProject(projectId);
                  showSidebar(meta, latlng, group.getBounds());
                });

                return group;
              }

              return circle;
            },
            onEachFeature: (feature, layer) => {
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
                      showSidebar(projectsData[projectId], null, layer.getBounds());
                    });
                  }
                }
              }
            }
          }).addTo(map);

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

// Mostrar sidebar
function showSidebar(meta, coords, layerBounds = null) {
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
  sidebar.open('predios');

  if (layerBounds) {
    map.flyToBounds(layerBounds, {
      padding: [100, 100],
      maxZoom: 11,
      animate: true,
      duration: 1.4
    });
  } else if (coords) {
    map.flyTo(coords, 12, { animate: true, duration: 1.4 });
  }
}


// Resaltar proyecto
function highlightProject(projectId) {
  // Resetear todos
  Object.values(projectLayers).forEach(layers => {
    layers.forEach(layer => {
      if (layer.setStyle) {
        layer.setStyle({ color: "#3388ff", weight: 2 });
      }
    });
  });

  // Resaltar seleccionado
  if (projectLayers[projectId]) {
    projectLayers[projectId].forEach(layer => {
      if (layer.setStyle) {
        layer.setStyle({ color: "red", weight: 4 });
      }
    });
  }
}

// Cerrar sidebar si click fuera
map.on('click', (e) => {
  if (!e.originalEvent.target.closest('.leaflet-interactive')) {
    sidebar.close();
  }
});

// Capa de emisiones
let emissionsPopup = null;
sidebar.addPanel({
  id: 'emissionsBtn',
  tab: '<li class="tabs"><a href="#emisiones"><img src="icons/logs.svg" class="bi-custom"></a></li>',
  button: function () {
    console.log("Botón Emisiones clickeado");
    if (map.hasLayer(emissionsLayer)) {
      map.removeLayer(emissionsLayer);
      if (emissionsPopup) {
        map.closePopup(emissionsPopup);
        emissionsPopup = null;
      }
    } else {
      map.addLayer(emissionsLayer);
      emissionsPopup = L.popup()
        .setLatLng(map.getCenter())
        .setContent("<b>Emisiones</b><br>Capa activada.")
        .openOn(map);
    }
  }
});

// Capa de incendios
let firesPopup = null;
sidebar.addPanel({
  id: 'firesBtn',
  tab: '<li class="tabs"><a href="#incendios"><img src="icons/fire.svg" class="bi-custom"></a></li>',
  button: function () {
    console.log("Botón de incendios clickeado");
    if (map.hasLayer(firesLayer)) {
      map.removeLayer(firesLayer);
      if (firesPopup) {
        map.closePopup(firesPopup);
        firesPopup = null;
      }
    } else {
      map.addLayer(firesLayer);
      firesPopup = L.popup()
        .setLatLng(map.getCenter())
        .setContent("<b>Incendios</b><br>Capa activada.")
        .openOn(map);
    }
  }
});
