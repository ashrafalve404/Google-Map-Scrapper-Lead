const posts = [
  {
    title: 'How to Extract Business Data from Google Maps',
    excerpt: 'Learn the best practices for scraping business listings from Google Maps.',
    date: 'March 10, 2024',
    category: 'Tutorial',
  },
  {
    title: 'Top 10 Use Cases for Business Data',
    excerpt: 'Discover how businesses are using location data to grow their operations.',
    date: 'March 5, 2024',
    category: 'Business',
  },
  {
    title: 'Building a Lead Generation System',
    excerpt: 'Step-by-step guide to building an automated lead generation system.',
    date: 'February 28, 2024',
    category: 'Guide',
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Blog</h1>
          <p className="mt-4 text-gray-600 text-center">Latest news, tutorials, and insights from MapScout.</p>

          <div className="mt-12 space-y-8">
            {posts.map(post => (
              <article key={post.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-900">{post.title}</h2>
                <p className="mt-2 text-gray-600">{post.excerpt}</p>
                <a href="#" className="inline-block mt-4 text-blue-600 font-medium hover:underline">Read More →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
