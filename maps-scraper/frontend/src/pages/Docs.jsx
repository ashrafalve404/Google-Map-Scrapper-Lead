import { Book, Code, Zap, Database } from 'lucide-react'

const docs = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn how to set up and use MapScout in minutes.',
    links: ['Quick Start Guide', 'Installation', 'Basic Usage'],
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Complete API documentation for developers.',
    links: ['REST API', 'Authentication', 'Endpoints'],
  },
  {
    icon: Zap,
    title: 'Advanced Features',
    description: 'Learn about advanced scraping capabilities.',
    links: ['Custom Queries', 'Filters', 'Export Options'],
  },
  {
    icon: Database,
    title: 'Data Formats',
    description: 'Understand the data you can extract.',
    links: ['CSV Export', 'JSON Format', 'Webhooks'],
  },
]

export default function Docs() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Documentation</h1>
          <p className="mt-4 text-gray-600 text-center">Everything you need to know about using MapScout.</p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {docs.map(doc => (
              <div key={doc.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <doc.icon size={28} className="text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{doc.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{doc.description}</p>
                <ul className="mt-4 space-y-2">
                  {doc.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-blue-600 hover:underline">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gray-900 rounded-xl">
            <h2 className="text-xl font-semibold text-white">Need Help?</h2>
            <p className="mt-2 text-gray-400">Can't find what you're looking for? Contact our support team.</p>
            <a href="/contact" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Get Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
