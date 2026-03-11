import { Link } from 'react-router-dom'
import { MapPin, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { path: '/features', label: 'Features' },
      { path: '/pricing', label: 'Pricing' },
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/api', label: 'API' },
    ],
    Company: [
      { path: '/about', label: 'About Us' },
      { path: '/contact', label: 'Contact' },
    ],
    Resources: [
      { path: '/docs', label: 'Documentation' },
      { path: '/blog', label: 'Blog' },
    ],
    Legal: [
      { path: '/privacy', label: 'Privacy Policy' },
      { path: '/terms', label: 'Terms of Service' },
    ],
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900">MapScout</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Extract business data from Google Maps effortlessly. 
              Build your database with accurate, up-to-date information.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} MapScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
