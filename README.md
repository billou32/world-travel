# 🌍 World Tour 2027-2028: Global Adventure

An interactive, serverless travel dashboard designed to track and visualize a one-year world trip. This project is built for portability and privacy, optimized for favorable weather patterns throughout the year.

## ✨ Features

- **Interactive Map:** Powered by Leaflet.js, featuring a global path with directional arrows.
- **Optimized Itinerary:** A 16-stop journey (Oct 2027 - Oct 2028) designed to maximize good weather across Central Asia, SE Asia, Oceania, and the Americas.
- **Live Countdown:** A real-time timer tracking the days, hours, and minutes until the adventure begins on October 1, 2027.
- **Budget Tracking:** Integrated budget summary for flights, daily living, and logistics.
- **Weather Insights:** Contextual weather advice for every destination in the itinerary.

## 🛠️ Technical Stack

- **Frontend:** Vanilla HTML5, CSS3, and JavaScript.
- **Mapping:** [Leaflet.js](https://leafletjs.com/) with the [PolylineDecorator](https://github.com/bbecquet/Leaflet.PolylineDecorator) plugin.
- **Design:** Modern "Travel Journal" aesthetic with Google Fonts (Playfair Display & Roboto).

## 🚀 How to Use

### Local Viewing (Serverless)
This project is designed to be fully portable. You do not need a web server or any installation.
1. Download or clone the repository.
2. Open `index.html` directly in any modern web browser.

### Live Dashboard
The project is hosted via GitHub Pages and can be viewed at:
[https://billou32.github.io/world-travel/](https://billou32.github.io/world-travel/)

## 🏗️ Architecture Note

To ensure the project can be opened directly from the file system without CORS errors, the travel data is stored as a constant (`itineraryData`) directly within `app.js`. No external JSON fetching is required.
