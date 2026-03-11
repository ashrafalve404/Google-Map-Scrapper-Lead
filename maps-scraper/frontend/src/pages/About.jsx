import { MapPin, Users, Target, Heart } from 'lucide-react'

const team = [
  {
    name: 'Development Team',
    role: 'Engineers',
    description: 'Building robust scraping infrastructure',
  },
]

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Making business data accessible to everyone. We believe that access to accurate data should be simple, not complicated.',
  },
  {
    icon: Heart,
    title: 'What We Value',
    description: 'Transparency, reliability, and user privacy. We build tools that respect both users and the platforms we work with.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We listen to our users and continuously improve based on feedback. Your success is our success.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            About MapScout
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            We're on a mission to make business data accessible to everyone. 
            MapScout helps individuals and businesses extract valuable location data 
            from Google Maps quickly and easily.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  MapScout started as a small project to help small businesses build their 
                  online presence. We realized that accessing business data from Google Maps 
                  was unnecessarily complicated and often required expensive enterprise solutions.
                </p>
                <p>
                  We set out to change that. By combining modern web scraping technology with 
                  a user-friendly interface, we've created a tool that's accessible to everyone 
                  - from individual entrepreneurs to large teams.
                </p>
                <p>
                  Today, thousands of users trust MapScout to help them build directories, 
                  generate leads, and make data-driven decisions.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <MapPin size={40} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">MapScout</h3>
                <p className="text-gray-500 text-sm mt-1">Since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(value => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-3 text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-gray-400 text-sm mt-2">Businesses Scraped</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10K+</div>
              <div className="text-gray-400 text-sm mt-2">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold">1M+</div>
              <div className="text-gray-400 text-sm mt-2">Data Points Extracted</div>
            </div>
            <div>
              <div className="text-4xl font-bold">99.9%</div>
              <div className="text-gray-400 text-sm mt-2">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
          <p className="mt-4 text-gray-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="mt-8">
            <a href="mailto:hello@mapscout.com" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
