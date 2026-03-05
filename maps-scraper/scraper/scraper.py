#!/usr/bin/env python3
"""
Google Maps Scraper using Playwright
Usage: python3 scraper.py "restaurants in Dhaka" 1
Outputs JSON to stdout
"""

import sys
import json
import time
import re
import traceback
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout


def clean(text):
    """Strip whitespace from scraped text."""
    return text.strip() if text else ""


def parse_rating(text):
    """Extract float rating from string like '4.3'"""
    try:
        return float(re.search(r"[\d.]+", text).group())
    except Exception:
        return 0.0


def parse_reviews(text):
    """Extract int review count from string like '(1,234)'"""
    try:
        return int(re.sub(r"[^\d]", "", text))
    except Exception:
        return 0


def scrape_maps(search_query: str) -> list:
    places = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--window-size=1280,800",
            ],
        )

        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/121.0.0.0 Safari/537.36"
            ),
            locale="en-US",
        )

        page = context.new_page()

        # Navigate to Google Maps search
        encoded = search_query.replace(" ", "+")
        url = f"https://www.google.com/maps/search/{encoded}"
        page.goto(url, wait_until="domcontentloaded", timeout=30000)

        # Wait for results panel
        try:
            page.wait_for_selector('div[role="feed"]', timeout=15000)
        except PWTimeout:
            # Try alternative selector
            try:
                page.wait_for_selector(".Nv2PK", timeout=10000)
            except PWTimeout:
                browser.close()
                return []

        # Scroll to load more results (scroll the results panel)
        scroll_attempts = 8
        last_count = 0
        for i in range(scroll_attempts):
            # Scroll the results feed
            try:
                feed = page.query_selector('div[role="feed"]')
                if feed:
                    feed.evaluate("el => el.scrollBy(0, 3000)")
                else:
                    page.evaluate("window.scrollBy(0, 3000)")
            except Exception:
                page.evaluate("window.scrollBy(0, 3000)")

            time.sleep(1.5)

            current_count = len(page.query_selector_all(".Nv2PK"))
            if current_count == last_count and i > 2:
                break  # No more results loading
            last_count = current_count

        # Get all result cards
        cards = page.query_selector_all(".Nv2PK")

        for card in cards:
            place = {}

            try:
                # Name
                name_el = card.query_selector(".qBF1Pd") or card.query_selector("h3") or card.query_selector(".fontHeadlineSmall")
                place["name"] = clean(name_el.inner_text()) if name_el else ""

                # Rating
                rating_el = card.query_selector(".MW4etd")
                place["rating"] = parse_rating(clean(rating_el.inner_text())) if rating_el else 0.0

                # Review count
                reviews_el = card.query_selector(".UY7F9")
                place["review_count"] = parse_reviews(clean(reviews_el.inner_text())) if reviews_el else 0

                # Category & Address (they share same class)
                details = card.query_selector_all(".W4Efsd span")
                detail_texts = [clean(d.inner_text()) for d in details if clean(d.inner_text()) and clean(d.inner_text()) not in ["·", "⋅", ""]]

                place["category"] = detail_texts[0] if len(detail_texts) > 0 else ""
                place["address"] = detail_texts[-1] if len(detail_texts) > 1 else ""

                # Phone
                phone_el = card.query_selector('[data-dtype="d3ph"]')
                if not phone_el:
                    # Try to find phone in detail texts
                    phone_pattern = re.compile(r"[\d\-\+\(\)\s]{7,}")
                    for t in detail_texts:
                        if phone_pattern.match(t) and len(t) >= 7:
                            place["phone"] = t
                            break
                    else:
                        place["phone"] = ""
                else:
                    place["phone"] = clean(phone_el.inner_text())

                # Google Maps URL
                link_el = card.query_selector("a.hfpxzc") or card.query_selector("a[href*='/maps/place']")
                place["google_maps_url"] = link_el.get_attribute("href") if link_el else ""

                # Latitude & Longitude from URL
                if place["google_maps_url"]:
                    coord_match = re.search(r"!3d(-?[\d.]+)!4d(-?[\d.]+)", place["google_maps_url"])
                    if coord_match:
                        place["latitude"] = coord_match.group(1)
                        place["longitude"] = coord_match.group(2)
                    else:
                        place["latitude"] = ""
                        place["longitude"] = ""

                # Website
                website_el = card.query_selector('[data-dtype="d3web"] a') or card.query_selector('a[data-value="Website"]')
                place["website"] = website_el.get_attribute("href") if website_el else ""

                # Hours
                hours_el = card.query_selector(".W4Efsd .ZkP5Je") or card.query_selector(".yhqFtb")
                place["hours"] = clean(hours_el.inner_text()) if hours_el else ""

                # Only add if we got a name
                if place.get("name"):
                    places.append(place)

            except Exception:
                continue

        browser.close()

    return places


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: scraper.py <query> [search_id]"}))
        sys.exit(1)

    search_query = sys.argv[1]

    try:
        places = scrape_maps(search_query)

        result = {
            "success": True,
            "query": search_query,
            "total": len(places),
            "places": places,
        }
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "places": [],
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
