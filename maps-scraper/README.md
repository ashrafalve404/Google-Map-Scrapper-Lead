# 🗺️ MapHarvest — Free Google Maps Scraper

Scrape Google Maps for any business type in any Bangladesh city (or globally).
**100% free — no API keys needed.**

Built with: **Go + SQLite** (backend) · **Python + Playwright** (scraper) · **React + Vite** (frontend)

---

## 📁 Project Structure

```
maps-scraper/
├── backend/                  ← Go API server
│   ├── main.go
│   ├── go.mod
│   ├── db/database.go        ← SQLite setup
│   ├── models/models.go
│   └── handlers/handlers.go  ← All API routes + scraper caller
│
├── scraper/                  ← Python Playwright scraper
│   ├── scraper.py            ← Main scraper script
│   └── requirements.txt
│
└── frontend/                 ← React Vite app
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx            ← Full SPA
        ├── api/index.js
        └── components/
            ├── PlaceCard.jsx
            ├── SearchItem.jsx
            └── Stars.jsx
```

---

## 🚀 Setup & Run Instructions

### Prerequisites

Make sure you have these installed:

| Tool | Version | Check |
|------|---------|-------|
| Go | 1.21+ | `go version` |
| Python | 3.9+ | `python3 --version` |
| Node.js | 18+ | `node --version` |
| gcc/build tools | any | For go-sqlite3 (see below) |

#### Install gcc (required for go-sqlite3):
- **Windows**: Install [TDM-GCC](https://jmeubank.github.io/tdm-gcc/) or use WSL
- **Ubuntu/Debian**: `sudo apt install build-essential`
- **macOS**: `xcode-select --install`

---

### Step 1 — Install Python Playwright

```bash
# Install Python dependencies
cd scraper
pip install -r requirements.txt

# Install Playwright browsers (downloads Chromium ~130MB)
python3 -m playwright install chromium

# Test the scraper manually
python3 scraper.py "restaurants in Dhaka" 1
# Should print JSON with places data
```

---

### Step 2 — Run the Go Backend

```bash
cd backend

# Download Go dependencies
go mod tidy

# Run the server
go run main.go

# Server starts at http://localhost:8080
# You should see: ✅ Database ready
#                 🚀 Maps Scraper API running on http://localhost:8080
```

> **Windows users**: If you get CGO errors, make sure gcc is in your PATH and run:
> `set CGO_ENABLED=1 && go run main.go`

---

### Step 3 — Run the React Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev

# Opens at http://localhost:5173
```

---

## 🎯 How to Use

1. Open **http://localhost:5173**
2. Type any search like `restaurants` or `hospitals`
3. Select a city (Dhaka, Rajshahi, Chittagong, etc.)
4. Click **Scrape** → wait 30–90 seconds
5. Browse results in grid or list view
6. Export to **CSV** anytime

---

## ✨ Features

- 🔍 **Free scraping** — uses headless Chromium, no API key
- 🏙️ **Bangladesh cities** — Dhaka, Rajshahi, Chittagong, Sylhet & more
- 📊 **Rich data** — name, address, phone, rating, reviews, hours, website, coordinates
- 🔄 **Live polling** — real-time status updates while scraping
- ↕️ **Sort & filter** — by rating, reviews, or name
- 📥 **CSV export** — download all results
- 🗂️ **Search history** — all past searches saved in SQLite
- 📱 **Grid & list views**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/searches` | All past searches |
| POST | `/api/search` | Start new scrape `{query, location}` |
| GET | `/api/search/:id/status` | Polling status |
| GET | `/api/search/:id/places` | Get places `?sort=rating` |
| GET | `/api/search/:id/export` | Download CSV |
| DELETE | `/api/search/:id` | Delete search |
| GET | `/api/stats` | Global stats |

---

## ⚠️ Important Notes

- **Scraping takes 30–90 seconds** — Playwright needs to scroll Google Maps to load all results
- **Results vary** — Google Maps changes its HTML frequently; if selectors break, the scraper.py CSS selectors may need updating
- **Rate limiting** — Don't run too many searches back-to-back; Google may temporarily block the IP
- **For production** — add delays between searches and consider rotating user agents

---

## 🛠️ Troubleshooting

**`scraper.py` returns empty results:**
- Google may have changed their HTML. Open `scraper.py` and update the CSS selectors (`.Nv2PK`, `.qBF1Pd`, etc.)
- Run `python3 scraper.py "test" 0` and check the output

**Go build error (CGO):**
- Install gcc (see Prerequisites above)

**Playwright browser not found:**
- Run `python3 -m playwright install chromium`

**Port already in use:**
- Change Go port: `PORT=8081 go run main.go`
- Change Vite port in `vite.config.js`
