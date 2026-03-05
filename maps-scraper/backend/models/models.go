package models

type Search struct {
	ID          int    `json:"id"`
	Query       string `json:"query"`
	Location    string `json:"location"`
	Status      string `json:"status"` // pending | running | done | failed
	TotalFound  int    `json:"total_found"`
	CreatedAt   string `json:"created_at"`
}

type Place struct {
	ID            int     `json:"id"`
	SearchID      int     `json:"search_id"`
	Name          string  `json:"name"`
	Address       string  `json:"address"`
	Phone         string  `json:"phone"`
	Rating        float64 `json:"rating"`
	ReviewCount   int     `json:"review_count"`
	Category      string  `json:"category"`
	Website       string  `json:"website"`
	Hours         string  `json:"hours"`
	GoogleMapsURL string  `json:"google_maps_url"`
	Latitude      string  `json:"latitude"`
	Longitude     string  `json:"longitude"`
	CreatedAt     string  `json:"created_at"`
}

// Scraped output from Python script
type ScraperResult struct {
	Success bool    `json:"success"`
	Error   string  `json:"error"`
	Places  []Place `json:"places"`
}
