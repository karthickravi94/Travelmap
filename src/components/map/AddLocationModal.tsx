'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Location } from '@/types'
import { CONTINENTS } from '@/lib/utils'

interface AddLocationModalProps {
  coordinates: { lat: number; lng: number }
  onClose: () => void
  onAdd: (location: Location) => void
}

export function AddLocationModal({ coordinates, onClose, onAdd }: AddLocationModalProps) {
  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    continent: '',
    notes: '',
    visited: false,
    visitedAt: '',
    rating: 0,
  })
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'location' | 'wishlist'>('location')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.country) return
    setLoading(true)

    try {
      const endpoint = mode === 'wishlist' ? '/api/wishlist' : '/api/locations'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          visitedAt: form.visited && form.visitedAt ? form.visitedAt : null,
          rating: form.rating || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        if (mode === 'location') {
          onAdd(data)
        } else {
          onClose()
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Add location error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Add Location</h2>
            <p className="text-white/70 text-sm">
              {coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex p-4 gap-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setMode('location')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'location' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            📍 Location
          </button>
          <button
            onClick={() => setMode('wishlist')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'wishlist' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            ⭐ Wishlist
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Paris, France"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country *</label>
              <input
                className="input"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="France"
                required
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                className="input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Paris"
              />
            </div>
          </div>
          <div>
            <label className="label">Continent</label>
            <select
              className="input"
              value={form.continent}
              onChange={(e) => setForm({ ...form, continent: e.target.value })}
            >
              <option value="">Select continent...</option>
              {CONTINENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {mode === 'location' && (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visited"
                  checked={form.visited}
                  onChange={(e) => setForm({ ...form, visited: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="visited" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  I&apos;ve visited this place
                </label>
              </div>
              {form.visited && (
                <div>
                  <label className="label">Visit date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.visitedAt}
                    onChange={(e) => setForm({ ...form, visitedAt: e.target.value })}
                  />
                </div>
              )}
              {form.visited && (
                <div>
                  <label className="label">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= form.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="label">Notes</label>
            <textarea
              rows={2}
              className="input resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add some notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Adding...' : mode === 'wishlist' ? '⭐ Add to Wishlist' : '📍 Add Location'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
