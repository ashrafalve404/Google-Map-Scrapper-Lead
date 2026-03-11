import { Key, CreditCard, Zap, Check } from 'lucide-react'

export default function Api() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Key size={28} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">API Access</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Access MapScout programmatically with our REST API. 
            Integrate data extraction directly into your applications.
          </p>
        </div>

        {/* Pricing Info */}
        <div className="mt-12 max-w-xl mx-auto">
          <div className="border-2 border-blue-600 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">API Access</h3>
                <p className="text-gray-600 text-sm mt-1">Programmatic access to all features</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-600" /> Unlimited API calls
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-600" /> All data fields
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-600" /> Webhook support
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-600" /> Priority support
              </li>
            </ul>

            <a href="/pricing" className="block mt-6 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center">
              Upgrade to Pro to Access API
            </a>
          </div>
        </div>

        {/* API Preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">API Endpoints</h2>
          <div className="bg-gray-900 rounded-xl p-6">
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
{`# Search Places
GET /api/search?query=restaurants&location=Dhaka

# Get Results
GET /api/search/:id/places

# Export CSV
GET /api/search/:id/export`}
            </pre>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <CreditCard className="text-amber-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-amber-900">API Requires Paid Plan</h4>
              <p className="text-amber-800 text-sm mt-1">
                API access is available on Pro and Enterprise plans. 
                Upgrade your plan to get API keys and start integrating.
              </p>
              <a href="/pricing" className="inline-block mt-3 text-sm font-medium text-amber-700 hover:underline">
                View Pricing →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
