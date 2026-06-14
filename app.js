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
let myGlobe = null;
let currentView = 'flat'; // 'flat' or 'globe'

// Initialize App
async function init() {
    try {
        const response = await fetch('itinerary.json');
        itineraryData = await response.json();
        
        renderItinerary();
        startCountdown();
        updateTimestamp();
        setupMobileSidebar();
        setupViewSwitching();
    } catch (error) {
        console.error('Error loading itinerary:', error);
    }
}

// Update Last Modified Timestamp
function updateTimestamp() {
    const timestampElement = document.getElementById('update-timestamp');
    if (!timestampElement) return;

    const lastMod = new Date(document.lastModified);
    const formattedDate = lastMod.toLocaleDateString('fr-FR');
    const formattedTime = lastMod.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    timestampElement.textContent = `${formattedDate} ${formattedTime}`;
}

// Select a stop, highlighting the sidebar and focusing the active map/globe view
function selectStop(index, stop, marker) {
    highlightSidebarItem(index);
    
    if (currentView === 'flat') {
        map.flyTo(stop.coords, 6);
        if (marker) {
            marker.openPopup();
        }
    } else if (currentView === 'globe') {
        focusOnPoint(stop.coords[0], stop.coords[1]);
    }
}

// Highlight sidebar item and scroll it into view
function highlightSidebarItem(index) {
    const listContainer = document.getElementById('itinerary-list');
    if (!listContainer) return;

    const items = listContainer.querySelectorAll('.itinerary-item');
    items.forEach(item => {
        item.classList.remove('active', 'flash');
    });

    const activeItem = items[index];
    if (activeItem) {
        activeItem.classList.add('active', 'flash');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Focus 3D globe camera on lat/lng coordinate
function focusOnPoint(lat, lng) {
    if (myGlobe) {
        const controls = myGlobe.controls();
        if (controls) {
            controls.autoRotate = false; // Pause auto-rotation on navigation
        }
        myGlobe.pointOfView({ lat, lng, altitude: 1.2 }, 1500);
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
            <p><strong>Arrivée :</strong> ${stop.date}</p>
            <p>${stop.notes}</p>
        `);
        markers.push(marker);
        pathCoordinates.push(stop.coords);

        // Highlight sidebar when clicking leaflet marker directly
        marker.on('click', () => {
            highlightSidebarItem(index);
        });

        // 2. Add Sidebar Item
        const item = document.createElement('div');
        item.className = 'itinerary-item';
        item.innerHTML = `
            <div class="date">${stop.date}</div>
            <h3>${stop.city}</h3>
            <div class="notes">${stop.notes}</div>
        `;
        
        item.onclick = () => {
            selectStop(index, stop, marker);
            if (window.closeMobileSidebar) {
                window.closeMobileSidebar();
            }
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

// Setup switching between 2D and 3D views
function setupViewSwitching() {
    const btn2d = document.getElementById('btn-2d');
    const btn3d = document.getElementById('btn-3d');
    const mapEl = document.getElementById('map');
    const globeEl = document.getElementById('globe');

    if (!btn2d || !btn3d || !mapEl || !globeEl) return;

    btn2d.addEventListener('click', () => {
        if (currentView === 'flat') return;
        currentView = 'flat';
        
        btn2d.classList.add('active');
        btn3d.classList.remove('active');
        
        globeEl.classList.add('view-hidden');
        globeEl.classList.remove('view-active');
        
        mapEl.classList.add('view-active');
        mapEl.classList.remove('view-hidden');
        
        // Let Leaflet adjust to container size when unhidden
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });

    btn3d.addEventListener('click', () => {
        if (currentView === 'globe') return;
        currentView = 'globe';
        
        btn3d.classList.add('active');
        btn2d.classList.remove('active');
        
        mapEl.classList.add('view-hidden');
        mapEl.classList.remove('view-active');
        
        globeEl.classList.add('view-active');
        globeEl.classList.remove('view-hidden');
        
        // Lazy initialize the globe with a small delay to guarantee container layout reflow is complete
        if (!myGlobe) {
            setTimeout(() => {
                initGlobe();
            }, 100);
        } else {
            const controls = myGlobe.controls();
            if (controls) {
                controls.autoRotate = true;
            }
        }
    });
}

// Initialize the 3D rotating Globe
function initGlobe() {
    const globeEl = document.getElementById('globe');
    
    myGlobe = Globe()
        (globeEl)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#3a225d') // modern indigo space glow
        .atmospherePower(2.5);

    // Initial sizing
    myGlobe.width(globeEl.clientWidth);
    myGlobe.height(globeEl.clientHeight);

    // Responsive sizing
    window.addEventListener('resize', () => {
        if (myGlobe && currentView === 'globe') {
            myGlobe.width(globeEl.clientWidth);
            myGlobe.height(globeEl.clientHeight);
        }
    });

    // Populate Points (Markers)
    const pointsData = itineraryData.map((stop, idx) => ({
        lat: stop.coords[0],
        lng: stop.coords[1],
        size: 0.6,
        color: '#e67e22',
        name: stop.city,
        country: stop.country,
        date: stop.date,
        notes: stop.notes,
        index: idx
    }));

    myGlobe
        .pointsData(pointsData)
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointColor(d => d.color)
        .pointAltitude(0.01)
        .pointRadius(d => d.size)
        .pointsMerge(false)
        .pointLabel(d => `
            <div class="scene-tooltip">
                <h4>${d.name}, ${d.country}</h4>
                <p><strong>Arrivée :</strong> ${d.date}</p>
                <p>${d.notes}</p>
            </div>
        `)
        .onPointClick((point) => {
            selectStop(point.index, itineraryData[point.index]);
        });

    // Populate Rings (rippling radar pulses for all stops)
    const ringsData = itineraryData.map((stop, idx) => ({
        lat: stop.coords[0],
        lng: stop.coords[1],
        color: '#e67e22'
    }));

    myGlobe
        .ringsData(ringsData)
        .ringLat(d => d.lat)
        .ringLng(d => d.lng)
        .ringColor(d => d.color)
        .ringMaxRadius(1.5)
        .ringPropagationSpeed(1.5)
        .ringRepeatNum(2);

    // Populate Arcs (connecting consecutive itinerary points)
    const arcsData = [];
    for (let i = 0; i < itineraryData.length - 1; i++) {
        const start = itineraryData[i];
        const end = itineraryData[i+1];
        arcsData.push({
            startLat: start.coords[0],
            startLng: start.coords[1],
            endLat: end.coords[0],
            endLng: end.coords[1],
            color: '#e67e22',
            name: `${start.city} ✈️ ${end.city}`
        });
    }

    myGlobe
        .arcsData(arcsData)
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(d => d.color)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500) // Animated dashes flow in the direction of the journey (faster animation)
        .arcStroke(1.5) // thicker for better presentation
        .arcAltitude(0.12) // higher elegant arches
        .arcLabel(d => d.name);

    // Auto Rotation Control
    const controls = myGlobe.controls();
    if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5; // slow aesthetic rotation
        
        // Stop rotating on drag interactions
        controls.addEventListener('start', () => {
            controls.autoRotate = false;
        });
    }

    // Camera initial zoom in to look at the departure stop (Bruxelles)
    const startStop = itineraryData[0];
    myGlobe.pointOfView({ lat: startStop.coords[0], lng: startStop.coords[1], altitude: 2.0 }, 1000);
}

// Countdown Logic
function startCountdown() {
    const timerElement = document.getElementById('timer');
    
    function update() {
        const now = new Date().getTime();
        const distance = DEPARTURE_DATE - now;
        
        if (distance < 0) {
            timerElement.innerHTML = "L'aventure a commencé !";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        timerElement.innerHTML = `${days}j ${hours}h ${minutes}m`;
    }
    
    update();
    setInterval(update, 60000); // Update every minute
}

// Setup mobile sidebar interaction
function setupMobileSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const menuIcon = document.querySelector('.icon-menu');
    const closeIcon = document.querySelector('.icon-close');

    if (!menuToggle || !overlay) return;

    function toggleSidebar() {
        const isOpen = document.body.classList.toggle('sidebar-open');
        if (isOpen) {
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        } else {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }

    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Expose closeSidebar globally so it can be called when clicking itinerary items
    window.closeMobileSidebar = closeSidebar;
}

// Start App
init();