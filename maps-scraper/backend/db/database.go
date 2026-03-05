package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init() {
	var err error
	DB, err = sql.Open("sqlite3", "./maps.db?_foreign_keys=on")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to connect:", err)
	}
	migrate()
	log.Println("✅ Database ready")
}

func migrate() {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS searches (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			query TEXT NOT NULL,
			location TEXT NOT NULL,
			status TEXT DEFAULT 'pending',
			total_found INTEGER DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS places (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			search_id INTEGER NOT NULL,
			name TEXT,
			address TEXT,
			phone TEXT,
			rating REAL DEFAULT 0,
			review_count INTEGER DEFAULT 0,
			category TEXT,
			website TEXT,
			hours TEXT,
			google_maps_url TEXT,
			latitude TEXT,
			longitude TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (search_id) REFERENCES searches(id)
		)`,
	}
	for _, q := range queries {
		if _, err := DB.Exec(q); err != nil {
			log.Fatal("Migration failed:", err)
		}
	}
}
