let markers = []; // Déclaration de la variable globale pour les marqueurs
let markers = []; // Étape 2 : Déclaration de la variable

document.getElementById('submit').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    const apiKey = 'fdd6dcf89555f8033a00cf0116de4656'; // Remplace 'YOUR_API_KEY' par ta clé API

    // Vérifier si les coordonnées sont valides
    if (isNaN(lat) || isNaN(lon)) {
        alert("Veuillez entrer des coordonnées valides !");
        return;
    }

    // Créer la carte seulement si elle n'existe pas déjà
    if (typeof map === 'undefined') {
        // Créer la carte et centrer sur les coordonnées fournies
        window.map = L.map('map').setView([lat, lon], 10);

        // Ajouter la couche de carte satellite
        L.tileLayer('https://{s}.s3.amazonaws.com/satellite/{z}/{x}/{y}.jpg', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    } else {
        // Mettre à jour la vue de la carte avec les nouvelles coordonnées
        map.setView([lat, lon], 10);
    }

    // API pour récupérer les données des feux de forêt
    const date = new Date();
    const endDate = date.toISOString().split('T')[0]; // Date actuelle
    date.setDate(date.getDate() - 30); // Date d'il y a 30 jours
    const startDate = date.toISOString().split('T')[0]; // Date de début

    // Appel à l'API
    fetch(`https://firms.modaps.eosdis.nasa.gov/api/active_fire/v2/json?date=${startDate}..${endDate}&latitude=${lat}&longitude=${lon}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Effacer les anciens marqueurs
            if (typeof markers !== 'undefined') {
                markers.forEach(marker => map.removeLayer(marker));
            }
            markers = [];

            data.forEach(fire => {
                const fireMarker = L.marker([fire.latitude, fire.longitude]).addTo(map);
                fireMarker.bindPopup(`Feu de forêt détecté le ${fire.acq_date}`);
                markers.push(fireMarker); // Ajouter le marqueur à la liste
            });
        })
        .catch(err => console.error(err));
});
