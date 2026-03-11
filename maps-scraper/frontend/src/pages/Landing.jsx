import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Building2, Phone, Star, Database, Zap, Shield, Globe } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Location Data',
    description: 'Extract addresses, coordinates, and directions for any business.',
  },
  {
    icon: Building2,
    title: 'Business Info',
    description: 'Get names, categories, websites, and operating hours.',
  },
  {
    icon: Phone,
    title: 'Contact Details',
    description: 'Collect phone numbers and email addresses automatically.',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description: 'Scrape ratings, review counts, and customer feedback.',
  },
]

const stats = [
  { value: '50K+', label: 'Businesses Scraped' },
  { value: '10K+', label: 'Happy Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Enter Search Query',
    description: 'Type the type of business and location you want to search for.',
  },
  {
    step: '02',
    title: 'Start Scraping',
    description: 'Our AI-powered scraper extracts data from Google Maps automatically.',
  },
  {
    step: '03',
    title: 'Download Results',
    description: 'Export your data as CSV or use it directly in your application.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Extract Google Maps Data{' '}
              <span className="text-blue-600">Effortlessly</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Build your business database with accurate, up-to-date information from Google Maps. 
              Simple, fast, and reliable data extraction.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start Scraping Free
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Features
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you extract the data you need for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-gray-100 absolute -top-2 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -translate-x-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">Why Choose MapScout?</h2>
              <p className="mt-4 text-gray-400">
                We provide the most reliable and efficient way to extract data from Google Maps.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <Zap size={20} className="text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Lightning Fast</h4>
                    <p className="text-sm text-gray-400">Extract hundreds of listings in minutes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Reliable & Accurate</h4>
                    <p className="text-sm text-gray-400">Clean, verified data you can trust.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database size={20} className="text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Export Anywhere</h4>
                    <p className="text-sm text-gray-400">CSV, JSON, or direct API integration.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Global Coverage</h4>
                    <p className="text-sm text-gray-400">Search any location worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8">
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
{`{
  "name": "Popular Restaurant",
  "address": "123 Main St, Dhaka",
  "phone": "+880 1234-567890",
  "rating": 4.5,
  "reviews": 1234,
  "category": "Restaurant",
  "website": "https://...",
  "hours": "9:00 AM - 10:00 PM",
  "coordinates": {
    "lat": 23.7725,
    "lng": 90.4234
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Extract Data?
          </h2>
          <p className="mt-4 text-gray-600">
            Start scraping Google Maps today. No credit card required.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center mt-8 px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
