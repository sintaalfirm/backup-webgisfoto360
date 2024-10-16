// Initialize the map first
var map = L.map('map', {
    center: [-7.76512, 110.37070],
    zoom: 14.5
  });
  
  // Initialize OpenStreetMap (brown theme)
  var osmBrown = L.tileLayer('https://tile.jawg.io/5cae44b4-28df-481a-a2d9-9b261d78a039/{z}/{x}/{y}{r}.png?access-token=L4Kh1ENETghHg0LTVRBLUNWZ4KWkXciY6fI0V47U8VlNgTdUNQkj2bLIy0ovMB8X', {});
  
  // Add attribution for OpenStreetMap
  osmBrown.addTo(map);
  map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors");
  
  // Initialize Google Satellite basemap
  var googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Satellite'
  });
  
  // Tambahkan geoJSON ke peta
  L.geoJSON(banjirjson, {
    onEachFeature: onEachFeature
  }).addTo(map);
  
  
  // Add GeoJSON data from the external JS variable to the map
  function onEachFeature(feature, layer) {
    var popupContent = `<h5>${feature.properties.name}</h5>${feature.properties.photo360}`;
  
    // Add the arrow for next point
    popupContent += `
        <br>
        <div style="text-align:center;">
            <img class="next-point-arrow" data-next="${feature.properties.next_id}" src="https://raw.githubusercontent.com/sintaalfirm/WebServiceSungaiCode/refs/heads/main/icons8-upward-arrow-64.png" style="width: 40px; cursor: pointer;" alt="Next">
        </div>
    `;
  
    layer.bindPopup(popupContent);
  
    // Update side panel ketika titik diklik
    layer.on('click', function () {
        $('#location-info').html(`<h6><strong>Titik banjir ${feature.properties.name}</strong></h6><p>${feature.properties.description}</p>`);
    });
  }
  
  
  // Event listener untuk navigasi ke titik berikutnya
  $(document).on('click', '.next-point-arrow', function (e) {
      e.preventDefault();
      var nextId = $(this).parent().data('next-id'); // Access data attribute from parent container
    var nextFeature = banjirjson.features.find(f => f.properties.id == nextId);
  
    if (nextFeature) {
        var nextPopup = `
            <h5>${nextFeature.properties.name}</h5>
            ${nextFeature.properties.photo360}
            <br>
            <div style="text-align:center;">
                <img class="next-point-arrow" data-next="${nextFeature.properties.next_id}" src="https://raw.githubusercontent.com/sintaalfirm/WebServiceSungaiCode/refs/heads/main/icons8-upward-arrow-64.png" style="width: 40px; cursor: pointer;" alt="Next">
            </div>
        `;
  
        map.setView([nextFeature.geometry.coordinates[1], nextFeature.geometry.coordinates[0]], 18); // Zoom to next point
  
        L.popup()
            .setLatLng([nextFeature.geometry.coordinates[1], nextFeature.geometry.coordinates[0]])
            .setContent(nextPopup)
            .openOn(map);
    }
  });
  
  
  
  
  // Toggle between basemaps
  var currentBasemap = 'osm';
  document.getElementById('basemapButton').addEventListener('click', function () {
    if (currentBasemap === 'osm') {
        map.removeLayer(osmBrown);
        map.addLayer(googleSat);
        currentBasemap = 'google';
        this.textContent = 'Ganti ke OpenStreetMap';
    } else {
        map.removeLayer(googleSat);
        map.addLayer(osmBrown);
        currentBasemap = 'osm';
        this.textContent = 'Ganti ke Google Satellite';
    }
  });
  