'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Location, Wishlist } from '@/types'
import { LocationModal } from './LocationModal'
import { AddLocationModal } from './AddLocationModal'

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false, loading: () => (
  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
    <div className="text-white/50 flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      <span>Loading map...</span>
    </div>
  </div>
)})

export function TravelMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [addingLocation, setAddingLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'visited' | 'unvisited'>('all')
  const [showWishlist, setShowWishlist] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [locRes, wishRes] = await Promise.all([
        fetch('/api/locations'),
        fetch('/api/wishlist'),
      ])
      const [locs, wishes] = await Promise.all([locRes.json(), wishRes.json()])
      if (Array.isArray(locs)) setLocations(locs)
      if (Array.isArray(wishes)) setWishlists(wishes)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredLocations = locations.filter((loc) => {
    if (filter === 'visited') return loc.visited
    if (filter === 'unvisited') return !loc.visited
    return true
  })

  const handleLocationUpdate = (updated: Location) => {
    setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
    setSelectedLocation(updated)
  }

  const handleLocationDelete = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id))
    setSelectedLocation(null)
  }

  const handleAddLocation = (newLocation: Location) => {
    setLocations((prev) => [...prev, newLocation])
    setAddingLocation(null)
  }

  const visitedCount = locations.filter((l) => l.visited).length

  return (
    <div className="relative h-full w-full">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="glass-dark rounded-2xl p-3 flex flex-col gap-2">
          <div className="text-xs font-medium text-white/60 px-1">Filter</div>
          {(['all', 'visited', 'unvisited'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? '🗺️ All' : f === 'visited' ? '✅ Visited' : '📍 Unvisited'}
            </button>
          ))}
          <button
            onClick={() => setShowWishlist(!showWishlist)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showWishlist ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            ⭐ Wishlist
          </button>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-[400]">
        <div className="glass-dark rounded-2xl px-4 py-3 text-white">
          <div className="text-xs text-white/50 mb-1">Progress</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-400">{visitedCount}</span>
            <span className="text-white/50 text-sm">/ {locations.length}</span>
          </div>
          <div className="text-xs text-white/50 mt-1">places visited</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-[400]">
        <div className="glass-dark rounded-2xl p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Not visited</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Wishlist</span>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400]">
        <div className="glass-dark rounded-full px-4 py-2 text-white/50 text-xs">
          Click anywhere on the map to add a location
        </div>
      </div>

      {/* Map */}
      {!loading && (
        <MapComponent
          locations={filteredLocations}
          wishlists={showWishlist ? wishlists : []}
          onLocationClick={setSelectedLocation}
          onMapClick={setAddingLocation}
        />
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onUpdate={handleLocationUpdate}
          onDelete={handleLocationDelete}
        />
      )}

      {/* Add Location Modal */}
      {addingLocation && (
        <AddLocationModal
          coordinates={addingLocation}
          onClose={() => setAddingLocation(null)}
          onAdd={handleAddLocation}
        />
      )}
    </div>
  )
}
