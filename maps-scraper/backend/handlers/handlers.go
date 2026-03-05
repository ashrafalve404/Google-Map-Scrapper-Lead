package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"maps-scraper/db"
	"maps-scraper/models"
	"net/http"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// GET /api/searches
func GetSearches(c *gin.Context) {
	rows, err := db.DB.Query(`SELECT id, query, location, status, total_found, created_at FROM searches ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var searches []models.Search
	for rows.Next() {
		var s models.Search
		rows.Scan(&s.ID, &s.Query, &s.Location, &s.Status, &s.TotalFound, &s.CreatedAt)
		searches = append(searches, s)
	}
	if searches == nil {
		searches = []models.Search{}
	}
	c.JSON(http.StatusOK, searches)
}

// POST /api/search
func StartSearch(c *gin.Context) {
	var body struct {
		Query    string `json:"query"`
		Location string `json:"location"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Query == "" || body.Location == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query and location are required"})
		return
	}

	body.Query = strings.TrimSpace(body.Query)
	body.Location = strings.TrimSpace(body.Location)

	// Create search record
	result, err := db.DB.Exec(
		`INSERT INTO searches (query, location, status) VALUES (?, ?, 'running')`,
		body.Query, body.Location,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	searchID, _ := result.LastInsertId()

	// Run scraper async
	go runScraper(int(searchID), body.Query, body.Location)

	c.JSON(http.StatusAccepted, gin.H{
		"search_id": searchID,
		"message":   fmt.Sprintf("Scraping '%s' in %s — this takes 30-60 seconds", body.Query, body.Location),
		"status":    "running",
	})
}

// GET /api/search/:id/status
func GetSearchStatus(c *gin.Context) {
	id := c.Param("id")
	var s models.Search
	err := db.DB.QueryRow(
		`SELECT id, query, location, status, total_found, created_at FROM searches WHERE id=?`, id,
	).Scan(&s.ID, &s.Query, &s.Location, &s.Status, &s.TotalFound, &s.CreatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "search not found"})
		return
	}
	c.JSON(http.StatusOK, s)
}

// GET /api/search/:id/places
func GetPlaces(c *gin.Context) {
	id := c.Param("id")
	filter := c.Query("filter")
	sort := c.DefaultQuery("sort", "rating")

	query := `SELECT id, search_id, name, address, phone, rating, review_count, category, website, hours, google_maps_url, latitude, longitude, created_at
			  FROM places WHERE search_id=?`
	args := []interface{}{id}

	if filter != "" && filter != "all" {
		query += " AND LOWER(category) LIKE ?"
		args = append(args, "%"+strings.ToLower(filter)+"%")
	}

	switch sort {
	case "rating":
		query += " ORDER BY rating DESC"
	case "reviews":
		query += " ORDER BY review_count DESC"
	case "name":
		query += " ORDER BY name ASC"
	default:
		query += " ORDER BY rating DESC"
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var places []models.Place
	for rows.Next() {
		var p models.Place
		rows.Scan(&p.ID, &p.SearchID, &p.Name, &p.Address, &p.Phone,
			&p.Rating, &p.ReviewCount, &p.Category, &p.Website,
			&p.Hours, &p.GoogleMapsURL, &p.Latitude, &p.Longitude, &p.CreatedAt)
		places = append(places, p)
	}
	if places == nil {
		places = []models.Place{}
	}
	c.JSON(http.StatusOK, places)
}

// GET /api/search/:id/export
func ExportCSV(c *gin.Context) {
	id := c.Param("id")

	var s models.Search
	db.DB.QueryRow(`SELECT query, location FROM searches WHERE id=?`, id).Scan(&s.Query, &s.Location)

	rows, _ := db.DB.Query(
		`SELECT name, address, phone, rating, review_count, category, website, hours, google_maps_url FROM places WHERE search_id=?`, id,
	)
	defer rows.Close()

	var sb strings.Builder
	sb.WriteString("Name,Address,Phone,Rating,Reviews,Category,Website,Hours,Google Maps URL\n")
	for rows.Next() {
		var p models.Place
		rows.Scan(&p.Name, &p.Address, &p.Phone, &p.Rating, &p.ReviewCount, &p.Category, &p.Website, &p.Hours, &p.GoogleMapsURL)
		sb.WriteString(fmt.Sprintf("%q,%q,%q,%.1f,%d,%q,%q,%q,%q\n",
			p.Name, p.Address, p.Phone, p.Rating, p.ReviewCount, p.Category, p.Website, p.Hours, p.GoogleMapsURL))
	}

	filename := fmt.Sprintf("%s_%s.csv", strings.ReplaceAll(s.Query, " ", "_"), strings.ReplaceAll(s.Location, " ", "_"))
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Type", "text/csv")
	c.String(http.StatusOK, sb.String())
}

// DELETE /api/search/:id
func DeleteSearch(c *gin.Context) {
	id := c.Param("id")
	db.DB.Exec(`DELETE FROM places WHERE search_id=?`, id)
	db.DB.Exec(`DELETE FROM searches WHERE id=?`, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// GET /api/stats
func GetStats(c *gin.Context) {
	var totalSearches, totalPlaces int
	var topLocation string
	db.DB.QueryRow(`SELECT COUNT(*) FROM searches WHERE status='done'`).Scan(&totalSearches)
	db.DB.QueryRow(`SELECT COUNT(*) FROM places`).Scan(&totalPlaces)
	db.DB.QueryRow(`SELECT location FROM searches WHERE status='done' GROUP BY location ORDER BY COUNT(*) DESC LIMIT 1`).Scan(&topLocation)

	c.JSON(http.StatusOK, gin.H{
		"total_searches": totalSearches,
		"total_places":   totalPlaces,
		"top_location":   topLocation,
	})
}

// runScraper calls the Python script
func runScraper(searchID int, query, location string) {
	// Find scraper path relative to binary
	_, filename, _, _ := runtime.Caller(0)
	baseDir := filepath.Dir(filepath.Dir(filename))
	scraperPath := filepath.Join(baseDir, "..", "scraper", "scraper.py")

	searchTerm := fmt.Sprintf("%s in %s", query, location)
	log.Printf("🔍 Starting scrape: %s (id=%d)", searchTerm, searchID)

	cmd := exec.Command("python3", scraperPath, searchTerm, strconv.Itoa(searchID))
	output, err := cmd.Output()
	if err != nil {
		log.Printf("❌ Scraper failed for search %d: %v", searchID, err)
		db.DB.Exec(`UPDATE searches SET status='failed' WHERE id=?`, searchID)
		return
	}

	var result models.ScraperResult
	if err := json.Unmarshal(output, &result); err != nil {
		log.Printf("❌ Failed to parse scraper output for search %d: %v\nOutput: %s", searchID, err, string(output))
		db.DB.Exec(`UPDATE searches SET status='failed' WHERE id=?`, searchID)
		return
	}

	if !result.Success {
		log.Printf("❌ Scraper returned error for search %d: %s", searchID, result.Error)
		db.DB.Exec(`UPDATE searches SET status='failed' WHERE id=?`, searchID)
		return
	}

	// Save places to DB
	for _, p := range result.Places {
		db.DB.Exec(`INSERT INTO places (search_id, name, address, phone, rating, review_count, category, website, hours, google_maps_url, latitude, longitude)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			searchID, p.Name, p.Address, p.Phone, p.Rating, p.ReviewCount,
			p.Category, p.Website, p.Hours, p.GoogleMapsURL, p.Latitude, p.Longitude)
	}

	db.DB.Exec(`UPDATE searches SET status='done', total_found=? WHERE id=?`, len(result.Places), searchID)
	log.Printf("✅ Scrape done for search %d — %d places found", searchID, len(result.Places))
}
