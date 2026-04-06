# WES Dashboard — WHO African Region

A React + Vite + Express full-stack dashboard framework for WHO public health data.

## Project Structure

```
wes-dashboard/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── WesLayout.jsx        # Shared header + nav for WES pages
│   │   │   └── FilterBar.jsx        # Reusable country/province filter bar
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Dashboard hub landing page
│   │   │   └── wes-lab/
│   │   │       ├── WesHome.jsx      # Intro / splash page
│   │   │       ├── WesResponse.jsx  # Interactive chart + question explorer
│   │   │       └── WesSummary.jsx   # Full assessment summary matrix
│   │   └── lib/
│   │       ├── api.js               # Axios API client
│   │       └── mockData.js          # Mock data (fallback when no DB)
│   └── vite.config.js               # Proxies /api → localhost:3001
│
├── server/
│   ├── index.js              # Express API server
│   ├── schema.sql            # PostgreSQL schema + seed data
│   └── .env.example          # Environment variable template
│
└── README.md
```

## Quick Start

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE wes_dashboard;"

# Run schema + seed
psql -U postgres -d wes_dashboard -f server/schema.sql
```

### 2. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env with your DB credentials
npm install
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Dashboard hub with clickable cards |
| `/wes-lab` | WES Home | Intro, purpose, key stats |
| `/wes-lab/response` | Response | Interactive chart filtered by category + question |
| `/wes-lab/summary` | Summary | Full matrix across all categories and countries |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/filters` | Countries & provinces for filter dropdowns |
| GET | `/api/categories` | Assessment categories (01–05) |
| GET | `/api/questions?category=` | Sub-questions for a category |
| GET | `/api/response?question=&country=&province=` | Chart data by country |
| GET | `/api/response-table?question=&country=&province=` | Response table data |
| GET | `/api/summary?country=&province=` | Full summary matrix |

## Database Column Mapping

The `wes_lab_data` table mirrors the Excel data structure from the screenshots:

| Column | Description |
|---|---|
| `country` | Member State (DRC, SENEGAL, Uganda) |
| `province` | Sub-national administrative unit |
| `"CategoryCode"` | e.g. `01 - ES Sam` |
| `"CategoryLabel"` | e.g. `ES Samples, Sampling and Sites` |
| `"QuestionCode"` | e.g. `1.01` |
| `"Question"` | Full question text |
| `"Value"` | Country's response |
| `"DataPeriodCode"` | Year (e.g. `2025`) |

## Adding a New Dashboard

1. Create `client/src/pages/my-dashboard/` with `MyHome.jsx`, `MyResponse.jsx`, etc.
2. Create a shared layout component in `components/` if needed
3. Add routes in `App.jsx`
4. Add a card entry to the `DASHBOARDS` array in `Landing.jsx`
5. Add corresponding API routes to `server/index.js`

## Mock Data

The frontend gracefully falls back to `src/lib/mockData.js` when the API is unreachable. This lets you develop the UI without a live database connection.

## Technology Stack

- **Frontend**: React 18 + Vite + React Router + Recharts + Axios
- **Backend**: Express.js + node-postgres (pg)
- **Database**: PostgreSQL
- **Styling**: CSS Modules + Google Fonts (Barlow / Barlow Condensed)
