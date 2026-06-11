'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Location, Photo } from '@/types'
import { PhotoGallery } from '@/components/gallery/PhotoGallery'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export function GalleryClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/locations?visited=true')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLocations(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const allPhotos = locations.flatMap((loc) =>
    (loc.photos || []).map((p) => ({ ...p, locationName: loc.name }))
  )

  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.country.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Travel Gallery</h1>
          <p className="text-gray-500 mt-1">{allPhotos.length} photos from {locations.length} destinations</p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input max-w-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">📸</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No photos yet</h3>
            <p className="text-gray-500">Visit places on the map and upload photos to build your gallery</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map((location, i) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{location.name}</h2>
                    <p className="text-sm text-gray-500">{location.country} · {(location.photos || []).length} photos</p>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(location)}
                    className="btn-secondary text-sm"
                  >
                    View all →
                  </button>
                </div>

                {(location.photos || []).length === 0 ? (
                  <div
                    onClick={() => setSelectedLocation(location)}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-400 transition-colors text-gray-400"
                  >
                    <span className="text-2xl">+</span>
                    <span className="text-sm">Add photos for {location.name}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {(location.photos || []).map((photo) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.03 }}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setSelectedLocation(location)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || location.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    <div
                      onClick={() => setSelectedLocation(location)}
                      className="aspect-square rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-all"
                    >
                      <span className="text-2xl">+</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <PhotoGallery
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onUpdate={(updated) => {
            setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
            setSelectedLocation(updated)
          }}
        />
      )}
    </div>
  )
}
