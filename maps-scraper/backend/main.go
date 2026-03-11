package main

import (
	"log"
	"maps-scraper/db"
	"maps-scraper/handlers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	db.Init()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		api.GET("/searches", handlers.GetSearches)
		api.POST("/search", handlers.StartSearch)
		api.GET("/search/:id/status", handlers.GetSearchStatus)
		api.GET("/search/:id/places", handlers.GetPlaces)
		api.GET("/search/:id/export", handlers.ExportCSV)
		api.DELETE("/search/:id", handlers.DeleteSearch)
		api.GET("/stats", handlers.GetStats)
		// Payment routes
		api.GET("/plans", handlers.GetPlans)
		api.GET("/stripe/config", handlers.GetStripeConfig)
		api.POST("/checkout", handlers.CreateCheckoutSession)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Maps Scraper API running on http://localhost:%s", port)
	r.Run(":" + port)
}
