<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte des feux de forêt</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map { height: 500px; }
    </style>
</head>
<body>
    <h3>Carte des feux de forêt</h3>
    <label for="latitude">Latitude:</label>
    <input type="text" id="latitude">
    <label for="longitude">Longitude:</label>
    <input type="text" id="longitude">
    <button id="submit">Afficher</button>

    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        let map;
        let markers = [];

        document.getElementById('submit').addEventListener('click', function() {
            const lat = parseFloat(document.getElementById('latitude').value);
            const lon = parseFloat(document.getElementById('longitude').value);
            const apiKey = 'YOUR_API_KEY'; // Remplace par ta clé API

            if (isNaN(lat) || isNaN(lon)) {
                alert("Veuillez entrer des coordonnées valides !");
                return;
            }

            // Initialise la carte si elle n'existe pas encore
            if (!map) {
                map = L.map('map').setView([lat, lon], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
            } else {
                map.setView([lat, lon], 10);
            }

            const date = new Date();
            const endDate = date.toISOString().split('T')[0];
            date.setDate(date.getDate() - 30);
            const startDate = date.toISOString().split('T')[0];

            const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/active_fire/v2/json?start_date=${startDate}&end_date=${endDate}&latitude=${lat}&longitude=${lon}&api_key=${apiKey}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur d'appel API");
                    }
                    return response.json();
                })
                .then(data => {
                    // Supprime les anciens marqueurs
                    markers.forEach(marker => map.removeLayer(marker));
                    markers = [];

                    // Ajoute les nouveaux marqueurs
                    data.forEach(fire => {
                        const fireMarker = L.marker([fire.latitude, fire.longitude]).addTo(map);
                        fireMarker.bindPopup(`Feu de forêt détecté le ${fire.acq_date}`);
                        markers.push(fireMarker);
                    });
                })
                .catch(err => console.error("Erreur : ", err));
        });
    </script>
</body>
</html>
