import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Contact Us</h1>
          <p className="mt-4 text-gray-600 text-center">Have questions? We'd love to hear from you.</p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Mail size={24} className="mx-auto text-blue-600" />
              <h3 className="mt-4 font-semibold text-gray-900">Email</h3>
              <p className="mt-2 text-gray-600 text-sm">hello@mapscout.com</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Phone size={24} className="mx-auto text-blue-600" />
              <h3 className="mt-4 font-semibold text-gray-900">Phone</h3>
              <p className="mt-2 text-gray-600 text-sm">+880 1234 567890</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <MapPin size={24} className="mx-auto text-blue-600" />
              <h3 className="mt-4 font-semibold text-gray-900">Location</h3>
              <p className="mt-2 text-gray-600 text-sm">Dhaka, Bangladesh</p>
            </div>
          </div>

          <form className="mt-12 max-w-xl mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400" placeholder="Your message..." />
              </div>
              <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
