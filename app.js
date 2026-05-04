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
let itineraryData = [];
const markers = [];
const pathCoordinates = [];

// Initialize App
async function init() {
    try {
        const response = await fetch('itinerary.json');
        itineraryData = await response.json();
        
        renderItinerary();
        startCountdown();
    } catch (error) {
        console.error('Error loading itinerary:', error);
    }
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
