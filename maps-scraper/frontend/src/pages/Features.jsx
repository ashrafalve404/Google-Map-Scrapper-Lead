import { MapPin, Building2, Phone, Star, Download, Zap, Shield, Globe, Database, Clock, FileText, Users } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Location Data',
    description: 'Extract precise addresses, coordinates (latitude/longitude), and directions for any business listed on Google Maps.',
    details: ['Full address extraction', 'GPS coordinates', 'Directions link'],
  },
  {
    icon: Building2,
    title: 'Business Information',
    description: 'Get comprehensive business details including names, categories, websites, and operating hours.',
    details: ['Business names', 'Categories & types', 'Operating hours', 'Website URLs'],
  },
  {
    icon: Phone,
    title: 'Contact Details',
    description: 'Automatically extract phone numbers and email addresses for direct customer contact.',
    details: ['Phone numbers', 'International format', 'Direct dial links'],
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description: 'Capture ratings, review counts, and customer feedback to understand business reputation.',
    details: ['Star ratings', 'Review counts', 'Rating trends'],
  },
]

const dataFormats = [
  { name: 'CSV', description: 'Export to Excel or Google Sheets' },
  { name: 'JSON', description: 'API-ready data format' },
  { name: 'Direct API', description: 'Real-time data integration' },
]

const useCases = [
  {
    title: 'Lead Generation',
    description: 'Build targeted prospect lists for sales teams with business contact information.',
  },
  {
    title: 'Market Research',
    description: 'Analyze competition and market presence across different locations.',
  },
  {
    title: 'Directory Building',
    description: 'Create comprehensive business directories for any industry or location.',
  },
  {
    title: 'Real Estate',
    description: 'Extract business locations for commercial real estate analysis.',
  },
]

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Powerful Features
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Everything you need to extract and utilize Google Maps data for your business.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
                <ul className="mt-4 space-y-2">
                  {feature.details.map(detail => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Export */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Multiple Export Options</h2>
              <p className="mt-4 text-gray-600">
                Export your data in the format that works best for your workflow.
              </p>
              <div className="mt-8 space-y-4">
                {dataFormats.map(format => (
                  <div key={format.name} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Download size={20} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{format.name}</h4>
                      <p className="text-sm text-gray-500">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8">
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
{`Name,Address,Phone,Rating,Reviews
ABC Restaurant,123 Main St,+880...,4.5,1234
XYZ Hospital,456 Road Ave,+880...,4.8,5678
...`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Use Cases</h2>
            <p className="mt-4 text-gray-600">Popular ways businesses use MapScout</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map(useCase => (
              <div key={useCase.title} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why MapScout?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Lightning Fast</h3>
              <p className="mt-2 text-gray-600 text-sm">Extract hundreds of listings in minutes, not hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Accurate Data</h3>
              <p className="mt-2 text-gray-600 text-sm">Clean, verified data you can trust for your business.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe size={28} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Global Coverage</h3>
              <p className="mt-2 text-gray-600 text-sm">Search any location worldwide with full coverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-gray-400">Start extracting data today. No credit card required.</p>
          <a href="/dashboard" className="inline-block mt-8 px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Try It Free
          </a>
        </div>
      </section>
    </div>
  )
}
