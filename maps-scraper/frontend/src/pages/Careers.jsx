import { Briefcase, MapPin, Clock } from 'lucide-react'

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build beautiful, performant web applications with React.',
  },
  {
    title: 'Backend Developer',
    type: 'Full-time',
    location: 'Remote',
    description: 'Design and implement scalable APIs and data pipelines.',
  },
  {
    title: 'DevOps Engineer',
    type: 'Full-time',
    location: 'Remote',
    description: 'Improve our infrastructure and deployment processes.',
  },
]

export default function Careers() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Careers</h1>
          <p className="mt-4 text-gray-600 text-center">Join our team and help us build the future of data extraction.</p>

          <div className="mt-12 space-y-4">
            {jobs.map(job => (
              <div key={job.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-gray-600 text-sm">{job.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase size={14} /> {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gray-50 rounded-xl text-center">
            <h2 className="text-xl font-semibold text-gray-900">Don't see the right role?</h2>
            <p className="mt-2 text-gray-600">We're always looking for talented people. Send us your resume.</p>
            <a href="mailto:careers@mapscout.com" className="inline-block mt-4 px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
