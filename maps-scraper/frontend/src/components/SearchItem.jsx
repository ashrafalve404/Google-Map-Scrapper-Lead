import { MapPin, Clock, CheckCircle2, XCircle, Loader2, Trash2, Download } from 'lucide-react'
import { searchAPI } from '../api'

const statusConfig = {
  running: { icon: Loader2, color: 'text-amber-400', label: 'Scraping...', spin: true },
  done: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Done', spin: false },
  failed: { icon: XCircle, color: 'text-rose-400', label: 'Failed', spin: false },
  pending: { icon: Clock, color: 'text-slate-400', label: 'Pending', spin: false },
}

export default function SearchItem({ search, isActive, onClick, onDelete }) {
  const cfg = statusConfig[search.status] || statusConfig.pending
  const Icon = cfg.icon

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-[#1a1a28] border border-transparent'
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
        <Icon size={14} className={cfg.spin ? 'animate-spin' : ''} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{search.query}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-slate-500" />
          <span className="text-xs text-slate-500 truncate">{search.location}</span>
        </div>
        {search.status === 'done' && (
          <p className="text-xs text-emerald-400/70 mt-0.5">{search.total_found} places</p>
        )}
      </div>

      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {search.status === 'done' && (
          <button
            onClick={(e) => { e.stopPropagation(); searchAPI.exportCSV(search.id) }}
            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-colors"
            title="Export CSV"
          >
            <Download size={12} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(search.id) }}
          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
