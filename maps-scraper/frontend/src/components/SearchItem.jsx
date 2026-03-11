import { MapPin, Clock, CheckCircle2, XCircle, Loader2, Trash2, Download } from 'lucide-react'
import { searchAPI } from '../api'

const statusConfig = {
  running: { icon: Loader2, color: 'text-gray-400', label: 'Running...', spin: true },
  done: { icon: CheckCircle2, color: 'text-green-600', label: 'Done', spin: false },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed', spin: false },
  pending: { icon: Clock, color: 'text-gray-400', label: 'Pending', spin: false },
}

export default function SearchItem({ search, isActive, onClick, onDelete }) {
  const cfg = statusConfig[search.status] || statusConfig.pending
  const Icon = cfg.icon

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
        <Icon size={14} className={cfg.spin ? 'animate-spin' : ''} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{search.query}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-gray-400" />
          <span className="text-xs text-gray-500 truncate">{search.location}</span>
        </div>
        {search.status === 'done' && (
          <p className="text-xs text-gray-500 mt-0.5">{search.total_found} places</p>
        )}
      </div>

      <div className="flex-shrink-0 flex gap-1">
        {search.status === 'done' && (
          <button
            onClick={(e) => { e.stopPropagation(); searchAPI.exportCSV(search.id) }}
            className="p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            title="Export CSV"
          >
            <Download size={12} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(search.id) }}
          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
