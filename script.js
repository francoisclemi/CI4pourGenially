document.getElementById('submit').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    const apiKey = 'fdd6dcf89555f8033a00cf0116de4656'; // Remplace 'YOUR_API_KEY' par ta clé API

    // Créer la carte et centrer sur les coordonnées fournies
    const map = L.map('map').setView([lat, lon], 10);
    
    // Ajouter la couche de carte satellite
    L.tileLayer('https://{s}.s3.amazonaws.com/satellite/{z}/{x}/{y}.jpg', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // API pour récupérer les données des feux de forêt
    const date = new Date();
    const endDate = date.toISOString().split('T')[0]; // Date actuelle
    date.setDate(date.getDate() - 30); // Date d'il y a 30 jours
    const startDate = date.toISOString().split('T')[0]; // Date de début

    // Appel à l'API
    fetch(`https://firms.modaps.eosdis.nasa.gov/api/active_fire/v2/json?date=2024-10-01..2024-10-31&latitude=${lat}&longitude=${lon}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(fire => {
                const fireMarker = L.marker([fire.latitude, fire.longitude]).addTo(map);
                fireMarker.bindPopup(`Feu de forêt détecté le ${fire.acq_date}`);
            });
        })
        .catch(err => console.error(err));
});
