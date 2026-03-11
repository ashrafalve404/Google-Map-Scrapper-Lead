package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	stripe "github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/checkout/session"
)

// Plan represents a subscription plan
type Plan struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Price         int64    `json:"price"`
	PriceDisplay  string   `json:"priceDisplay"`
	Period        string   `json:"period"`
	Description   string   `json:"description"`
	Features      []string `json:"features"`
	Popular       bool     `json:"popular"`
	StripePriceID string   `json:"stripePriceId"`
}

var plans = []Plan{
	{
		ID:            "free",
		Name:          "Free",
		Price:         0,
		PriceDisplay:  "Free",
		Period:        "forever",
		Description:   "Perfect for getting started",
		Features:      []string{"100 searches/month", "1,000 results/month", "CSV export", "Basic support"},
		Popular:       false,
		StripePriceID: "",
	},
	{
		ID:            "pro",
		Name:          "Pro",
		Price:         2900,
		PriceDisplay:  "$29",
		Period:        "/month",
		Description:   "For professionals and small teams",
		Features:      []string{"Unlimited searches", "50,000 results/month", "CSV & JSON export", "Priority support", "API access"},
		Popular:       true,
		StripePriceID: "price_1T9uBQLmDkVBRxlYhFx5P0xB",
	},
	{
		ID:            "enterprise",
		Name:          "Enterprise",
		Price:         0,
		PriceDisplay:  "Custom",
		Period:        "",
		Description:   "For large organizations",
		Features:      []string{"Unlimited everything", "Dedicated support", "Custom integrations", "SLA guarantee", "On-premise option"},
		Popular:       false,
		StripePriceID: "",
	},
}

// GetPlans returns available subscription plans
func GetPlans(c *gin.Context) {
	c.JSON(http.StatusOK, plans)
}

// GetStripeConfig returns Stripe publishable key for client-side checkout
func GetStripeConfig(c *gin.Context) {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	stripePublishableKey := os.Getenv("STRIPE_PUBLISHABLE_KEY")
	if stripePublishableKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stripe publishable key not configured"})
		return
	}

	domain := os.Getenv("DOMAIN")
	if domain == "" {
		domain = "http://localhost:5173"
	}

	c.JSON(http.StatusOK, gin.H{
		"publishableKey": stripePublishableKey,
		"domain":         domain,
	})
}

// CreateCheckoutSession creates a Stripe checkout session
func CreateCheckoutSession(c *gin.Context) {
	planID := c.PostForm("plan_id")

	// Find the plan
	var selectedPlan Plan
	for _, p := range plans {
		if p.ID == planID {
			selectedPlan = p
			break
		}
	}

	if selectedPlan.StripePriceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This plan does not require payment or is not available for purchase"})
		return
	}

	// Initialize Stripe with secret key
	secretKey := os.Getenv("STRIPE_SECRET_KEY")
	if secretKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stripe not configured on server"})
		return
	}

	stripe.Key = secretKey

	domain := os.Getenv("DOMAIN")
	if domain == "" {
		domain = "http://localhost:5173"
	}

	// Use subscription mode for recurring prices (monthly plans)
	mode := "subscription"

	// Create checkout session with the price ID
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(selectedPlan.StripePriceID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(mode),
		SuccessURL: stripe.String(domain + "/pricing?success=true&plan=" + planID),
		CancelURL:  stripe.String(domain + "/pricing?canceled=true"),
	}

	s, err := session.New(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create checkout session: " + err.Error()})
		return
	}

	// Construct the checkout URL - in Stripe, the format is checkout.stripe.com/c/pay/{session_id}
	checkoutURL := fmt.Sprintf("https://checkout.stripe.com/c/pay/%s", s.ID)

	c.JSON(http.StatusOK, gin.H{
		"sessionId": s.ID,
		"url":       checkoutURL,
	})
}

// HandleWebhook handles Stripe webhooks
func HandleWebhook(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "received"})
}
