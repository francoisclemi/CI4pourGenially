// Déclare markers une seule fois en dehors de la fonction
let markers = []; 

document.getElementById('submit').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    const apiKey = 'YOUR_API_KEY'; // Remplace par ta clé API valide

    if (isNaN(lat) || isNaN(lon)) {
        alert("Veuillez entrer des coordonnées valides !");
        return;
    }

    if (typeof map === 'undefined') {
        window.map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.s3.amazonaws.com/satellite/{z}/{x}/{y}.jpg', {
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
            // Supprime tous les anciens marqueurs
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            data.forEach(fire => {
                const fireMarker = L.marker([fire.latitude, fire.longitude]).addTo(map);
                fireMarker.bindPopup(`Feu de forêt détecté le ${fire.acq_date}`);
                markers.push(fireMarker);
            });
        })
        .catch(err => console.error("Erreur : ", err));
});
