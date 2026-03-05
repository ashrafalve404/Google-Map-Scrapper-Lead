import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, Download, RefreshCw, Loader2, Map, LayoutGrid, List, SlidersHorizontal, Trash2, ChevronDown, Star, TrendingUp } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import { searchAPI, statsAPI } from './api'
import PlaceCard from './components/PlaceCard'
import SearchItem from './components/SearchItem'

const LOCATIONS = ['Dhaka', 'Rajshahi', 'Chittagong', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj']
const QUICK_SEARCHES = ['Restaurants', 'Hospitals', 'Hotels', 'Schools', 'Banks', 'Pharmacies', 'Gyms', 'Cafes', 'Mosques', 'Shopping Malls']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'name', label: 'A–Z Name' },
]

function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Dhaka')
  const [customLocation, setCustomLocation] = useState('')
  const [searches, setSearches] = useState([])
  const [activeSearch, setActiveSearch] = useState(null)
  const [places, setPlaces] = useState([])
  const [stats, setStats] = useState(null)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sort, setSort] = useState('rating')
  const [view, setView] = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
          toast.error('Scraping failed. Try again.')
        }
      } catch {}
    }, 3000)
  }, [activeSearch, loadPlaces])

  const handleSearch = async () => {
    const q = query.trim()
    const loc = customLocation.trim() || location
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
    <div className="min-h-screen bg-[#0a0a0f] grid-bg">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#12121e', color: '#e4e4f0', border: '1px solid #1e1e30', borderRadius: '12px', fontSize: '14px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#0a0a0f' } },
        error: { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' } },
      }} />

      <div className="flex h-screen overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden bg-[#0d0d18] border-r border-[#1e1e30] flex flex-col`}>
          {/* Logo */}
          <div className="px-5 py-5 border-b border-[#1e1e30]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Map size={18} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="font-display font-bold text-white text-lg leading-none">MapHarvest</h1>
                <p className="text-[10px] text-slate-500 mt-0.5">Google Maps Scraper</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="px-4 py-3 border-b border-[#1e1e30]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#12121e] rounded-xl p-3">
                  <p className="font-display font-bold text-emerald-400 text-xl">{stats.total_searches}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Searches</p>
                </div>
                <div className="bg-[#12121e] rounded-xl p-3">
                  <p className="font-display font-bold text-emerald-400 text-xl">{stats.total_places.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Places</p>
                </div>
              </div>
            </div>
          )}

          {/* Search History */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 px-2 mb-2">Search History</p>
            {searches.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-6">No searches yet</p>
            ) : (
              <div className="space-y-1">
                {searches.map(s => (
                  <SearchItem
                    key={s.id}
                    search={s}
                    isActive={activeSearch?.id === s.id}
                    onClick={() => handleSelectSearch(s)}
                    onDelete={handleDeleteSearch}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#1e1e30] px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(o => !o)} className="btn-ghost p-2">
                <SlidersHorizontal size={16} />
              </button>

              {/* Search Bar */}
              <div className="flex-1 flex gap-2 max-w-3xl">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    className="input-field pl-10 h-11"
                    placeholder='Search anything — "restaurants", "hospitals", "banks"...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {/* Location dropdown */}
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <select
                    className="input-field pl-8 pr-8 h-11 w-44 appearance-none cursor-pointer"
                    value={customLocation ? '__custom__' : location}
                    onChange={e => {
                      if (e.target.value === '__custom__') return
                      setLocation(e.target.value)
                      setCustomLocation('')
                    }}
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                <button onClick={handleSearch} disabled={submitting || !query.trim()} className="btn-primary h-11 px-6 flex items-center gap-2 whitespace-nowrap">
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                  {submitting ? 'Starting...' : 'Scrape'}
                </button>
              </div>

              {/* View toggle */}
              <div className="flex gap-1 bg-[#12121e] border border-[#1e1e30] rounded-xl p-1">
                <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                  <LayoutGrid size={15} />
                </button>
                <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Quick search chips */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {QUICK_SEARCHES.map(q => (
                <button key={q} onClick={() => { setQuery(q); setTimeout(handleSearch, 100) }}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#1a1a28] hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 border border-[#2a2a3f] hover:border-emerald-500/30 transition-all duration-200">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 px-6 py-6">
            {/* Active search running indicator */}
            {activeSearch?.status === 'running' && (
              <div className="mb-6 card p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-amber-400 pulse-ring" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      Scraping <span className="text-amber-400">"{activeSearch.query}"</span> in <span className="text-amber-400">{activeSearch.location}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Playwright is browsing Google Maps... this takes 30–90 seconds</p>
                  </div>
                  <Loader2 size={16} className="text-amber-400 animate-spin ml-auto flex-shrink-0" />
                </div>
                {/* Animated progress bar */}
                <div className="mt-3 h-1 bg-[#1e1e30] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Results header */}
            {activeSearch?.status === 'done' && places.length > 0 && (
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {activeSearch.query}
                    <span className="text-slate-500 font-normal"> in </span>
                    {activeSearch.location}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">{places.length} places found</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      className="input-field text-sm py-2 pr-8 pl-3 appearance-none cursor-pointer w-40"
                      value={sort}
                      onChange={e => handleSortChange(e.target.value)}
                    >
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                  <button onClick={() => searchAPI.exportCSV(activeSearch.id)} className="btn-ghost flex items-center gap-2 text-sm border border-[#2a2a3f]">
                    <Download size={14} /> CSV
                  </button>
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {loadingPlaces && (
              <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Places grid/list */}
            {!loadingPlaces && places.length > 0 && (
              <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
                {places.map((place, i) => (
                  view === 'grid'
                    ? <PlaceCard key={place.id} place={place} index={i} />
                    : <ListRow key={place.id} place={place} index={i} />
                ))}
              </div>
            )}

            {/* Empty states */}
            {!activeSearch && !submitting && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Map size={36} className="text-emerald-400" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-3">Scrape Google Maps</h2>
                <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-8">
                  Search for any business type in any Bangladesh city. The AI scraper will extract names, addresses, phones, ratings, and more — completely free.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Restaurants in Dhaka', 'Hospitals in Rajshahi', 'Hotels in Chittagong'].map(example => (
                    <button key={example} onClick={() => {
                      const [q, , l] = example.split(' ')
                      setQuery(q)
                      setLocation(l)
                    }}
                      className="text-sm px-4 py-2 rounded-xl bg-[#1a1a28] hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 border border-[#2a2a3f] hover:border-emerald-500/30 transition-all duration-200">
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSearch?.status === 'failed' && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <p className="text-rose-400 font-semibold mb-2">Scraping failed</p>
                <p className="text-slate-500 text-sm">Make sure Python & Playwright are installed. Check the run instructions in the README.</p>
              </div>
            )}

            {activeSearch?.status === 'done' && places.length === 0 && !loadingPlaces && (
              <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                <p className="text-slate-400 font-semibold mb-2">No places found</p>
                <p className="text-slate-500 text-sm">Try a different search term or location.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// List row view
function ListRow({ place, index }) {
  return (
    <div className="card-hover px-5 py-4 fade-up flex items-center gap-4"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: 'both', opacity: 0 }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-white text-sm">{place.name}</span>
          {place.category && <span className="badge bg-emerald-500/10 text-emerald-400/80 text-[10px]">{place.category}</span>}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{place.address}</p>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 text-sm">
        {place.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-mono font-semibold text-amber-400">{place.rating.toFixed(1)}</span>
            {place.review_count > 0 && <span className="text-xs text-slate-600">({place.review_count.toLocaleString()})</span>}
          </div>
        )}
        {place.phone && <span className="font-mono text-xs text-slate-400">{place.phone}</span>}
        {place.google_maps_url && (
          <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:underline">View Map</a>
        )}
      </div>
    </div>
  )
}
