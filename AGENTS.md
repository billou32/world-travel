# Agent Instructions: World Travel Dashboard

## Architecture
- **Type:** Static client-side application (HTML/CSS/JS).
- **Deployment Target:** Hosted exclusively on **GitHub Pages** (strictly client-side static files, zero backend or server-side requirements).
- **Map Libraries:**
  - **Leaflet.js** (loaded via CDN) for the 2D flat map view.
  - **Globe.gl / Three.js** (loaded via CDN) for the interactive 3D rotating globe view.
- **Data Source:** The itinerary is stored in `itinerary.json` and fetched dynamically by `app.js`.

## Development Workflow
- **Viewing:** Designed to be viewed through a web server (e.g., GitHub Pages) due to `fetch()` calls. Opening `index.html` directly via the `file://` protocol will fail due to CORS restrictions.
- **Verification:** Manually refresh the live site or run a local web server. There are no automated tests or build scripts.

## Constraints
- **GitHub Pages Compatibility:** All code, routes, or assets must run entirely client-side. No server-side runtimes (Node.js, Python, PHP), databases, or server configurations can be introduced.
- **Portability:** Keep dependencies as CDNs. Avoid introducing build tools (npm, webpack) that would overcomplicate the simple static setup.
