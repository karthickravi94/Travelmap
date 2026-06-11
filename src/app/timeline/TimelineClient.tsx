'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Location } from '@/types'
import { formatDate, getContinentColor } from '@/lib/utils'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { PhotoGallery } from '@/components/gallery/PhotoGallery'

export function TimelineClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  useEffect(() => {
    fetch('/api/locations?visited=true')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const dateA = a.visitedAt ? new Date(a.visitedAt).getTime() : 0
            const dateB = b.visitedAt ? new Date(b.visitedAt).getTime() : 0
            return dateB - dateA
          })
          setLocations(sorted)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const groupedByYear = locations.reduce((acc, loc) => {
    const year = loc.visitedAt ? new Date(loc.visitedAt).getFullYear().toString() : 'Unknown'
    if (!acc[year]) acc[year] = []
    acc[year].push(loc)
    return acc
  }, {} as Record<string, Location[]>)

  const years = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a))

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Travel Timeline</h1>
          <p className="text-gray-500 mt-1">{locations.length} adventures and counting</p>
        </motion.div>

        {locations.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">📅</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No trips yet</h3>
            <p className="text-gray-500">Mark locations as visited on the map to build your timeline</p>
          </div>
        ) : (
          <div className="space-y-12">
            {years.map((year) => (
              <div key={year}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{year}</div>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="text-sm text-gray-400">{groupedByYear[year].length} trip{groupedByYear[year].length > 1 ? 's' : ''}</div>
                </motion.div>

                <div className="relative pl-8">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30" />

                  <div className="space-y-6">
                    {groupedByYear[year].map((location, i) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="relative"
                      >
                        {/* Dot */}
                        <div
                          className="absolute -left-5 top-4 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 shadow-sm"
                          style={{ background: getContinentColor(location.continent) }}
                        />

                        <div className="card p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">{location.name}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {location.city && `${location.city}, `}{location.country}
                                {location.continent && (
                                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: getContinentColor(location.continent) + '20', color: getContinentColor(location.continent) }}>
                                    {location.continent}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">{formatDate(location.visitedAt)}</p>
                              {location.rating && (
                                <div className="flex items-center gap-0.5 justify-end mt-1">
                                  {Array.from({ length: location.rating }).map((_, j) => (
                                    <span key={j} className="text-yellow-400 text-sm">★</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {location.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                              &ldquo;{location.notes}&rdquo;
                            </p>
                          )}

                          {(location.photos || []).length > 0 && (
                            <div className="mt-4">
                              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                {(location.photos || []).slice(0, 5).map((photo) => (
                                  <img
                                    key={photo.id}
                                    src={photo.url}
                                    alt={photo.caption || ''}
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setSelectedLocation(location)}
                                  />
                                ))}
                                {(location.photos || []).length > 5 && (
                                  <button
                                    onClick={() => setSelectedLocation(location)}
                                    className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 flex-shrink-0 hover:bg-gray-200 transition-colors"
                                  >
                                    +{(location.photos || []).length - 5}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setSelectedLocation(location)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              📸 {(location.photos || []).length > 0 ? `${(location.photos || []).length} photos` : 'Add photos'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
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
