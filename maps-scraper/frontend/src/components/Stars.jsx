export default function Stars({ rating, count }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  if (rating === 0) {
    return <span className="text-xs text-gray-400">No rating</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(full)].map((_, i) => <span key={`f${i}`} className="text-amber-500 text-sm">★</span>)}
        {half && <span className="text-amber-500 text-sm">★</span>}
        {[...Array(empty)].map((_, i) => <span key={`e${i}`} className="text-gray-300 text-sm">★</span>)}
      </div>
      <span className="font-mono text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count.toLocaleString()})</span>}
    </div>
  )
}
