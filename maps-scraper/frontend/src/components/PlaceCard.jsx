import { MapPin, Phone, Globe, Clock, ExternalLink, Tag } from 'lucide-react'
import Stars from './Stars'

export default function PlaceCard({ place, index }) {
  return (
    <div
      className="card-hover p-4 fade-in flex flex-col gap-2.5"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">{place.name || 'Unknown'}</h3>
          {place.category && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500">
              <Tag size={10} />
              {place.category}
            </span>
          )}
        </div>
        {place.google_maps_url && (
          <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Rating */}
      <Stars rating={place.rating} count={place.review_count} />

      {/* Details */}
      <div className="space-y-1.5 text-sm">
        {place.address && (
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed line-clamp-2">{place.address}</span>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-gray-400 flex-shrink-0" />
            <a href={`tel:${place.phone}`} className="text-xs text-gray-600 hover:text-gray-900 transition-colors font-mono">{place.phone}</a>
          </div>
        )}
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-gray-400 flex-shrink-0" />
            <a href={place.website} target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-gray-900 transition-colors truncate max-w-[180px]">
              {place.website.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          </div>
        )}
        {place.hours && (
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-gray-400 flex-shrink-0" />
            <span className={`text-xs font-medium ${place.hours.toLowerCase().includes('open') || place.hours.toLowerCase().includes('খোলা') ? 'text-green-600' : place.hours.toLowerCase().includes('close') || place.hours.toLowerCase().includes('বন্ধ') ? 'text-red-500' : 'text-gray-500'}`}>
              {place.hours}
            </span>
          </div>
        )}
      </div>

      {/* Coordinates */}
      {place.latitude && place.longitude && (
        <div className="pt-2 border-t border-gray-100 mt-1">
          <span className="font-mono text-[10px] text-gray-400">
            {parseFloat(place.latitude).toFixed(4)}, {parseFloat(place.longitude).toFixed(4)}
          </span>
        </div>
      )}
    </div>
  )
}
