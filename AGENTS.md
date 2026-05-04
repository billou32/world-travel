# Agent Instructions: World Travel Dashboard

## Architecture
- **Type:** Static client-side application (HTML/CSS/JS).
- **Map Library:** Leaflet.js (loaded via CDN).
- **Data Source:** The itinerary is hardcoded as `itineraryData` within `app.js`. **Do not** look for an external `itinerary.json` file.

## Development Workflow
- **Viewing:** Designed to be opened directly as a file (`file://` protocol). No local web server is required.
- **Verification:** Manually refresh `index.html` in a browser. There are no automated tests or build scripts.

## Constraints
- **Portability:** Keep dependencies as CDNs. Avoid introducing build tools (npm, webpack) or `fetch()` calls that would break local file-system viewing due to CORS.
