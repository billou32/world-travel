# Agent Instructions: World Travel Dashboard

## Architecture
- **Type:** Static client-side application (HTML/CSS/JS).
- **Map Library:** Leaflet.js (loaded via CDN).
- **Data Source:** The itinerary is stored in `itinerary.json` and fetched dynamically by `app.js`.

## Development Workflow
- **Viewing:** Designed to be viewed through a web server (e.g., GitHub Pages) due to `fetch()` calls. Opening `index.html` directly via the `file://` protocol will fail due to CORS restrictions.
- **Verification:** Manually refresh the live site or run a local web server. There are no automated tests or build scripts.

## Constraints
- **Portability:** Keep dependencies as CDNs. Avoid introducing build tools (npm, webpack) that would overcomplicate the simple static setup.
