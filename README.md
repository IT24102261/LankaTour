# ExploreLK – Smart Sri Lanka Travel Planner

React (Vite) frontend for a university mini hackathon. Uses sample JSON/JavaScript data. A Node.js + Express + PostgreSQL API can be connected later through `src/services/api.js`.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Later backend

Copy `.env.example` to `.env` and set `VITE_API_URL`. Replace the helpers in `src/services/placeService.js` with axios calls from `src/services/api.js`.
