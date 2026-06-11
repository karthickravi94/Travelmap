'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wishlist } from '@/types'
import { CONTINENTS } from '@/lib/utils'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export function WishlistClient() {
  const [wishlist, setWishlist] = useState<Wishlist[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', country: '', city: '', continent: '', notes: '', priority: 1, latitude: '', longitude: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setWishlist(data) })
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.country || !form.latitude || !form.longitude) return
    setSaving(true)
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) }),
      })
      const data = await res.json()
      if (res.ok) {
        setWishlist((prev) => [data, ...prev])
        setShowAdd(false)
        setForm({ name: '', country: '', city: '', continent: '', notes: '', priority: 1, latitude: '', longitude: '' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove from wishlist?')) return
    await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' })
    setWishlist((prev) => prev.filter((w) => w.id !== id))
  }

  const priorityLabel = (p: number) => p === 1 ? '🔥 High' : p === 2 ? '⭐ Medium' : '📌 Low'

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dream Destinations</h1>
            <p className="text-gray-500 mt-1">{wishlist.length} places on your bucket list</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            ⭐ Add Destination
          </button>
        </motion.div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <form onSubmit={handleAdd} className="card p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Add Dream Destination</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Machu Picchu" required />
                  </div>
                  <div>
                    <label className="label">Country *</label>
                    <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Peru" required />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cusco" />
                  </div>
                  <div>
                    <label className="label">Continent</label>
                    <select className="input" value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })}>
                      <option value="">Select...</option>
                      {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Latitude *</label>
                    <input className="input" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-13.1631" required />
                  </div>
                  <div>
                    <label className="label">Longitude *</label>
                    <input className="input" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="-72.5449" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Notes</label>
                    <textarea className="input resize-none" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Why do you want to visit?" />
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })}>
                      <option value={1}>🔥 High</option>
                      <option value={2}>⭐ Medium</option>
                      <option value={3}>📌 Low</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : '⭐ Add to Wishlist'}</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {wishlist.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">⭐</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Add dream destinations or click on the map to add wishlist locations</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">Add your first destination</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {item.country.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.city && `${item.city}, `}{item.country}
                          {item.continent && ` · ${item.continent}`}
                        </p>
                      </div>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic ml-13">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                      {priorityLabel(item.priority)}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
