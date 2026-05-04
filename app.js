// Configuration
const DEPARTURE_DATE = new Date('October 1, 2027 09:00:00').getTime();

// Initialize Map
const map = L.map('map').setView([20, 0], 2);

// Add Tile Layer (CartoDB Voyager - clean and modern)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// App State
const itineraryData = [
  {
    "id": 1,
    "city": "Brussels",
    "country": "Belgium",
    "coords": [50.8503, 4.3517],
    "date": "Oct 1, 2027",
    "notes": "Départ de Bruxelles ! Le début de l'aventure 'Chasseurs de Soleil'."
  },
  {
    "id": 2,
    "city": "Tashkent",
    "country": "Uzbekistan",
    "coords": [41.2995, 69.2401],
    "date": "Oct 2027",
    "notes": "Automne : Météo excellente en Ouzbékistan, douce pour explorer la Route de la Soie."
  },
  {
    "id": 3,
    "city": "Ulaanbaatar",
    "country": "Mongolia",
    "coords": [47.8864, 106.9057],
    "date": "Nov 2027",
    "notes": "Automne : Belles couleurs en Mongolie, mais nuits glaciales (proche de 0°C)."
  },
  {
    "id": 4,
    "city": "Seoul",
    "country": "South Korea",
    "coords": [37.5665, 126.9780],
    "date": "Nov 2027",
    "notes": "Arrière-saison superbe en Asie de l'Est."
  },
  {
    "id": 5,
    "city": "Hanoi",
    "country": "Vietnam",
    "coords": [21.0285, 105.8542],
    "date": "Dec 2027",
    "notes": "Hiver : Saison sèche et fraîche au Vietnam, météo parfaite."
  },
  {
    "id": 6,
    "city": "Luang Prabang",
    "country": "Laos",
    "coords": [19.8833, 102.1333],
    "date": "Jan 2028",
    "notes": "Hiver : Saison sèche et fraîche au Laos."
  },
  {
    "id": 7,
    "city": "Siem Reap",
    "country": "Cambodia",
    "coords": [13.3633, 103.8567],
    "date": "Jan 2028",
    "notes": "Hiver : Saison sèche et fraîche au Cambodge."
  },
  {
    "id": 8,
    "city": "Delhi",
    "country": "India",
    "coords": [28.6139, 77.2090],
    "date": "Feb 2028",
    "notes": "Hiver : Saison sèche et fraîche, météo parfaite en Inde."
  },
  {
    "id": 9,
    "city": "Bali",
    "country": "Indonesia",
    "coords": [-8.4095, 115.1889],
    "date": "Mar 2028",
    "notes": "Printemps : L'automne à Bali, début de la bonne saison."
  },
  {
    "id": 10,
    "city": "Sydney",
    "country": "Australia",
    "coords": [-33.8688, 151.2093],
    "date": "Apr 2028",
    "notes": "Printemps : L'automne en Australie, climat très agréable."
  },
  {
    "id": 11,
    "city": "Papeete",
    "country": "French Polynesia",
    "coords": [-17.5333, -149.5667],
    "date": "May 2028",
    "notes": "Printemps : Début de la bonne saison dans le Pacifique."
  },
  {
    "id": 12,
    "city": "Fortaleza",
    "country": "Brazil",
    "coords": [-3.7327, -38.5270],
    "date": "Jun 2028",
    "notes": "Été : Plein été au Brésil, parfait pour les plages."
  },
  {
    "id": 13,
    "city": "Fort-de-France",
    "country": "Martinique",
    "coords": [14.6089, -61.0733],
    "date": "Jul 2028",
    "notes": "Été : Saison agréable dans les Caraïbes."
  },
  {
    "id": 14,
    "city": "Quebec City",
    "country": "Canada",
    "coords": [46.8139, -71.2080],
    "date": "Aug 2028",
    "notes": "Été : Festivals, nature verdoyante et parcs nationaux au Québec."
  },
  {
    "id": 15,
    "city": "Windhoek",
    "country": "Namibia",
    "coords": [-22.5609, 17.0658],
    "date": "Sept 2028",
    "notes": "Fin d'été : Saison sèche en Namibie, idéale pour clôturer en safari."
  },
  {
    "id": 16,
    "city": "Brussels",
    "country": "Belgium",
    "coords": [50.8503, 4.3517],
    "date": "Oct 1, 2028",
    "notes": "Retour à la maison après une année incroyable !"
  }
];

const markers = [];
const pathCoordinates = [];

// Initialize App
function init() {
    renderItinerary();
    startCountdown();
}

// Render Map and Sidebar
function renderItinerary() {
    const listContainer = document.getElementById('itinerary-list');
    
    itineraryData.forEach((stop, index) => {
        // 1. Add Marker
        const marker = L.marker(stop.coords).addTo(map);
        marker.bindPopup(`
            <h4>${stop.city}, ${stop.country}</h4>
            <p><strong>Arriving:</strong> ${stop.date}</p>
            <p>${stop.notes}</p>
        `);
        markers.push(marker);
        pathCoordinates.push(stop.coords);

        // 2. Add Sidebar Item
        const item = document.createElement('div');
        item.className = 'itinerary-item';
        item.innerHTML = `
            <div class="date">${stop.date}</div>
            <h3>${stop.city}</h3>
            <div class="notes">${stop.notes}</div>
        `;
        
        item.onclick = () => {
            map.flyTo(stop.coords, 6);
            marker.openPopup();
        };
        
        listContainer.appendChild(item);
    });

    // 3. Draw Path
    const path = L.polyline(pathCoordinates, {
        color: '#e67e22',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);

    // 4. Add Directional Arrows
    L.polylineDecorator(path, {
        patterns: [
            { 
                offset: '5%', 
                repeat: '100px', 
                symbol: L.Symbol.arrowHead({
                    pixelSize: 10, 
                    polygon: false, 
                    pathOptions: { 
                        stroke: true, 
                        color: '#e67e22', 
                        weight: 2,
                        opacity: 0.9
                    }
                }) 
            }
        ]
    }).addTo(map);

    // Zoom out to see the whole world
    map.fitBounds(path.getBounds(), { padding: [50, 50] });
}

// Countdown Logic
function startCountdown() {
    const timerElement = document.getElementById('timer');
    
    function update() {
        const now = new Date().getTime();
        const distance = DEPARTURE_DATE - now;
        
        if (distance < 0) {
            timerElement.innerHTML = "Adventures Started!";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m`;
    }
    
    update();
    setInterval(update, 60000); // Update every minute
}

// Start App
init();
