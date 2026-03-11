import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, Download, Loader2, List, Grid3X3, Trash2, ChevronDown, Star, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { searchAPI, statsAPI } from '../api'
import PlaceCard from '../components/PlaceCard'
import SearchItem from '../components/SearchItem'

const LOCATIONS = ['Dhaka', 'Rajshahi', 'Chittagong', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj']
const QUICK_SEARCHES = ['Restaurants', 'Hospitals', 'Hotels', 'Schools', 'Banks', 'Pharmacies', 'Gyms', 'Cafes', 'Mosques', 'Shopping Malls']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'name', label: 'A–Z Name' },
]

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-4 w-full" />
    </div>
  )
}

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Dhaka')
  const [searches, setSearches] = useState([])
  const [activeSearch, setActiveSearch] = useState(null)
  const [places, setPlaces] = useState([])
  const [stats, setStats] = useState(null)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sort, setSort] = useState('rating')
  const [view, setView] = useState('grid')
  const pollRef = useRef(null)

  useEffect(() => {
    loadSearches()
    loadStats()
    return () => clearInterval(pollRef.current)
  }, [])

  const loadSearches = async () => {
    try {
      const res = await searchAPI.getAll()
      setSearches(res.data)
    } catch {}
  }

  const loadStats = async () => {
    try {
      const res = await statsAPI.get()
      setStats(res.data)
    } catch {}
  }

  const loadPlaces = useCallback(async (searchId, sortBy = sort) => {
    setLoadingPlaces(true)
    try {
      const res = await searchAPI.getPlaces(searchId, { sort: sortBy })
      setPlaces(res.data)
    } catch {
      toast.error('Failed to load places')
    } finally {
      setLoadingPlaces(false)
    }
  }, [sort])

  const startPolling = useCallback((searchId) => {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await searchAPI.getStatus(searchId)
        const updated = res.data
        setSearches(prev => prev.map(s => s.id === searchId ? updated : s))
        if (activeSearch?.id === searchId) {
          setActiveSearch(updated)
        }
        if (updated.status === 'done') {
          clearInterval(pollRef.current)
          loadPlaces(searchId)
          loadStats()
          toast.success(`Found ${updated.total_found} places!`)
        } else if (updated.status === 'failed') {
          clearInterval(pollRef.current)
          toast.error('Scraping failed. Please try again.')
        }
      } catch {}
    }, 3000)
  }, [activeSearch, loadPlaces])

  const handleSearch = async () => {
    const q = query.trim()
    const loc = location
    if (!q) return toast.error('Enter a search query')

    setSubmitting(true)
    try {
      const res = await searchAPI.start(q, loc)
      const newSearch = { id: res.data.search_id, query: q, location: loc, status: 'running', total_found: 0 }
      setSearches(prev => [newSearch, ...prev])
      setActiveSearch(newSearch)
      setPlaces([])
      startPolling(res.data.search_id)
      setQuery('')
      toast.success(res.data.message, { duration: 4000 })
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to start search')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectSearch = (search) => {
    setActiveSearch(search)
    if (search.status === 'done') {
      loadPlaces(search.id)
    } else if (search.status === 'running') {
      setPlaces([])
      startPolling(search.id)
    } else {
      setPlaces([])
    }
  }

  const handleDeleteSearch = async (id) => {
    await searchAPI.delete(id)
    setSearches(prev => prev.filter(s => s.id !== id))
    if (activeSearch?.id === id) {
      setActiveSearch(null)
      setPlaces([])
    }
    toast.success('Deleted')
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    if (activeSearch?.status === 'done') {
      loadPlaces(activeSearch.id, newSort)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#fff', color: '#1a1a1a', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
        success: { iconTheme: { primary: '#000', secondary: '#fff' } },
        error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
      }} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Google Maps</h1>
          <p className="mt-2 text-gray-600">Find businesses, places, and contacts in any location</p>
        </div>

        {/* Search Box - Prominent Center */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border border-gray-200 rounded-xl px-12 py-4 text-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder-gray-400"
                placeholder='What are you looking for? e.g., "restaurants", "hospitals"'
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="relative w-full md:w-48">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full h-full border border-gray-200 rounded-xl pl-10 pr-10 py-4 text-base appearance-none cursor-pointer focus:outline-none focus:border-gray-400 bg-white"
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button 
              onClick={handleSearch} 
              disabled={submitting || !query.trim()} 
              className="bg-black text-white font-medium px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              <span className="text-lg">{submitting ? 'Searching...' : 'Search'}</span>
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500">Quick search:</span>
            {QUICK_SEARCHES.map(q => (
              <button 
                key={q} 
                onClick={() => { setQuery(q); setTimeout(handleSearch, 100) }}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total_searches}</p>
              <p className="text-sm text-gray-500">Searches</p>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total_places.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Places Found</p>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.top_location || '-'}</p>
              <p className="text-sm text-gray-500">Top Location</p>
            </div>
          </div>
        )}

        {/* Running Status */}
        {activeSearch?.status === 'running' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" style={{ animation: 'pulse 1s infinite' }} />
                <div className="w-3 h-3 rounded-full bg-blue-500" style={{ animation: 'pulse 1s infinite 0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-blue-500" style={{ animation: 'pulse 1s infinite 0.4s' }} />
              </div>
              <p className="font-medium text-gray-900">
                Searching for <span className="font-bold">"{activeSearch.query}"</span> in <span className="font-bold">{activeSearch.location}</span>
              </p>
              <Loader2 size={18} className="ml-auto text-blue-500 animate-spin" />
            </div>
          </div>
        )}

        {/* Results Header */}
        {activeSearch?.status === 'done' && places.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeSearch.query} in {activeSearch.location}
              </h2>
              <p className="text-sm text-gray-500">{places.length} places found</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={sort}
                onChange={e => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow-sm' : ''}`}>
                  <List size={16} />
                </button>
              </div>
              <button onClick={() => searchAPI.exportCSV(activeSearch.id)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loadingPlaces && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loadingPlaces && places.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place, i) => (
              <PlaceCard key={place.id} place={place} index={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!activeSearch && !submitting && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Start Searching</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Enter a search term and location above to find businesses on Google Maps
            </p>
          </div>
        )}

        {activeSearch?.status === 'failed' && (
          <div className="text-center py-16">
            <p className="text-red-600 font-medium">Scraping failed</p>
            <p className="text-gray-500 text-sm mt-1">Make sure Python & Playwright are installed</p>
          </div>
        )}

        {activeSearch?.status === 'done' && places.length === 0 && !loadingPlaces && (
          <div className="text-center py-16">
            <p className="text-gray-600 font-medium">No places found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different search term or location</p>
          </div>
        )}

        {/* Recent Searches */}
        {searches.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Searches ({searches.length})</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Query</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Location</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Places</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {searches.map(s => (
                      <tr 
                        key={s.id} 
                        onClick={() => handleSelectSearch(s)}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{s.query}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.location}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            s.status === 'done' ? 'bg-green-100 text-green-700' :
                            s.status === 'running' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.status === 'done' ? s.total_found : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteSearch(s.id) }}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
