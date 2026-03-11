import { useState, useEffect } from 'react'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const defaultPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: 'Free',
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['100 searches/month', '1,000 results/month', 'CSV export', 'Basic support'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    priceDisplay: '$29',
    period: '/month',
    description: 'For professionals and small teams',
    features: ['Unlimited searches', '50,000 results/month', 'CSV & JSON export', 'Priority support', 'API access'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    priceDisplay: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option'],
    popular: false,
  },
]

export default function Pricing() {
  const [plans] = useState(defaultPlans)
  const [processingId, setProcessingId] = useState(null)
  const [searchParams] = useSearchParams()
  const [stripe, setStripe] = useState(null)

  useEffect(() => {
    // Check for success/cancel from Stripe
    if (searchParams.get('success') === 'true') {
      const plan = searchParams.get('plan')
      toast.success(plan === 'pro' ? 'Payment successful! Welcome to Pro!' : 'Payment successful!')
    } else if (searchParams.get('canceled') === 'true') {
      toast.error('Payment canceled. Please try again.')
    }
  }, [searchParams])

  useEffect(() => {
    // Load Stripe publishable key and initialize Stripe
    fetch('/api/stripe/config')
      .then(res => res.json())
      .then(data => {
        if (data.publishableKey && window.Stripe) {
          const stripeInstance = window.Stripe(data.publishableKey)
          setStripe(stripeInstance)
        }
      })
      .catch(console.error)
  }, [])

  const handleSubscribe = async (plan) => {
    if (plan.id === 'free') {
      window.location.href = '/dashboard'
      return
    }

    if (plan.id === 'enterprise') {
      window.location.href = '/contact'
      return
    }

    setProcessingId(plan.id)

    try {
      // Get checkout data from backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `plan_id=${plan.id}`,
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        setProcessingId(null)
        return
      }

      if (stripe && data.sessionId) {
        // Use Stripe.js to redirect to checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })
        
        if (error) {
          toast.error(error.message)
          setProcessingId(null)
        }
      } else {
        // Fallback: redirect to Stripe Checkout with client-only integration
        // Use the price_id for client-side checkout
        const checkoutUrl = `https://buy.stripe.com/test_${data.priceId}?success_url=${encodeURIComponent(data.successUrl)}&cancel_url=${encodeURIComponent(data.cancelUrl)}`
        window.location.href = checkoutUrl
      }

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      setProcessingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-gray-600 text-center">Choose the plan that works best for you. Start free, upgrade anytime.</p>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className={`relative border rounded-2xl p-6 flex flex-col ${
                  plan.popular 
                    ? 'border-blue-600 ring-2 ring-blue-100 shadow-lg scale-105 z-10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.priceDisplay}</span>
                    {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingId === plan.id}
                  className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processingId === plan.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : plan.id === 'free' ? (
                    'Get Started'
                  ) : plan.id === 'enterprise' ? (
                    'Contact Sales'
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trial Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Check size={16} />
              14-day free trial on all paid plans. No credit card required.
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
                <p className="mt-1 text-gray-600">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
                <p className="mt-1 text-gray-600">We accept all major credit cards including Visa, Mastercard, and American Express through Stripe.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Is there a free trial?</h3>
                <p className="mt-1 text-gray-600">Yes! All paid plans come with a 14-day free trial. You can upgrade to Pro and try all features risk-free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
