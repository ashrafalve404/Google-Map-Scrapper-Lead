import { MapPin, Phone, Globe, Clock, ExternalLink, Tag } from 'lucide-react'
import Stars from './Stars'

export default function PlaceCard({ place, index }) {
  return (
    <div
      className="card-hover p-5 fade-up flex flex-col gap-3"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-base leading-tight truncate">{place.name || 'Unknown'}</h3>
          {place.category && (
            <div className="flex items-center gap-1 mt-1">
              <Tag size={10} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-emerald-400/80 truncate">{place.category}</span>
            </div>
          )}
        </div>
        {place.google_maps_url && (
          <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all duration-200">
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Rating */}
      <Stars rating={place.rating} count={place.review_count} />

      {/* Details */}
      <div className="space-y-1.5 text-sm">
        {place.address && (
          <div className="flex items-start gap-2 text-slate-400">
            <MapPin size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed">{place.address}</span>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-slate-500 flex-shrink-0" />
            <a href={`tel:${place.phone}`} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono">{place.phone}</a>
          </div>
        )}
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-slate-500 flex-shrink-0" />
            <a href={place.website} target="_blank" rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors truncate max-w-[200px]">
              {place.website.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          </div>
        )}
        {place.hours && (
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-slate-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${place.hours.toLowerCase().includes('open') ? 'text-emerald-400' : place.hours.toLowerCase().includes('close') ? 'text-rose-400' : 'text-slate-400'}`}>
              {place.hours}
            </span>
          </div>
        )}
      </div>

      {/* Coordinates badge */}
      {place.latitude && place.longitude && (
        <div className="pt-2 border-t border-[#1e1e30]">
          <span className="font-mono text-[10px] text-slate-600">
            {parseFloat(place.latitude).toFixed(4)}, {parseFloat(place.longitude).toFixed(4)}
          </span>
        </div>
      )}
    </div>
  )
}
