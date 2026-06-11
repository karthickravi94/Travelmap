'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Location } from '@/types'
import { formatDate } from '@/lib/utils'
import { PhotoGallery } from '@/components/gallery/PhotoGallery'

interface LocationModalProps {
  location: Location
  onClose: () => void
  onUpdate: (location: Location) => void
  onDelete: (id: string) => void
}

export function LocationModal({ location, onClose, onUpdate, onDelete }: LocationModalProps) {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(location.notes || '')
  const [rating, setRating] = useState(location.rating || 0)
  const [saving, setSaving] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  const handleToggleVisited = async () => {
    try {
      const res = await fetch(`/api/locations/${location.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visited: !location.visited,
          visitedAt: !location.visited ? new Date().toISOString() : null,
        }),
      })
      const updated = await res.json()
      onUpdate(updated)
    } catch (error) {
      console.error('Toggle visited error:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/locations/${location.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, rating }),
      })
      const updated = await res.json()
      onUpdate(updated)
      setEditing(false)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${location.name}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/locations/${location.id}`, { method: 'DELETE' })
      onDelete(location.id)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className={`px-6 py-5 ${location.visited ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{location.name}</h2>
                <p className="text-white/80 text-sm mt-0.5">
                  {location.city && `${location.city}, `}{location.country}
                </p>
                {location.continent && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-white/80 text-xs">
                    {location.continent}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${location.visited ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {location.visited ? 'Visited' : 'Not visited yet'}
                </span>
                {location.visitedAt && (
                  <span className="text-xs text-gray-400">· {formatDate(location.visitedAt)}</span>
                )}
              </div>
              <button
                onClick={handleToggleVisited}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  location.visited
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                }`}
              >
                {location.visited ? 'Mark unvisited' : 'Mark as visited ✓'}
              </button>
            </div>

            {/* Rating */}
            {editing ? (
              <div>
                <label className="label">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ) : location.rating ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < location.rating! ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}>★</span>
                ))}
              </div>
            ) : null}

            {/* Notes */}
            {editing ? (
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Add your travel notes..."
                />
              </div>
            ) : location.notes ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">{location.notes}</p>
              </div>
            ) : null}

            {/* Photos preview */}
            {location.photos && location.photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    📸 {location.photos.length} photo{location.photos.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setShowGallery(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {location.photos.slice(0, 3).map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.caption || location.name}
                      className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowGallery(true)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coordinates */}
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span>📍</span>
              <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleDelete} className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button onClick={() => setShowGallery(true)} className="btn-secondary flex-1">
                  📸 Photos
                </button>
                <button onClick={() => setEditing(true)} className="btn-primary flex-1">
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {showGallery && (
        <PhotoGallery
          location={location}
          onClose={() => setShowGallery(false)}
          onUpdate={onUpdate}
        />
      )}
    </AnimatePresence>
  )
}
