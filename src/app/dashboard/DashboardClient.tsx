'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Session } from 'next-auth'
import Link from 'next/link'
import { DashboardStats, Location } from '@/types'
import { formatDate, getContinentColor } from '@/lib/utils'
import { PageLoader } from '@/components/ui/LoadingSpinner'

interface Props { session: Session }

const statCards = (stats: DashboardStats) => [
  { label: 'Countries visited', value: stats.countries, icon: '🌍', gradient: 'stat-gradient-blue', change: `of 195` },
  { label: 'Cities explored', value: stats.cities, icon: '🏙️', gradient: 'stat-gradient-green', change: `destinations` },
  { label: 'Continents', value: stats.continents, icon: '✈️', gradient: 'stat-gradient-orange', change: `of 7` },
  { label: 'World explored', value: `${stats.travelPercentage}%`, icon: '🌐', gradient: 'stat-gradient-purple', change: `${stats.visitedLocations} places visited` },
]

function StatCard({ card, index }: { card: ReturnType<typeof statCards>[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${card.gradient} rounded-2xl p-6 text-white`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{card.label}</p>
          <p className="text-4xl font-extrabold mt-2">{card.value}</p>
          <p className="text-white/60 text-xs mt-1">{card.change}</p>
        </div>
        <span className="text-3xl">{card.icon}</span>
      </div>
    </motion.div>
  )
}

function TravelProgress({ stats }: { stats: DashboardStats }) {
  const continentData = [
    { name: 'Europe', total: 44 },
    { name: 'Asia', total: 48 },
    { name: 'Africa', total: 54 },
    { name: 'North America', total: 23 },
    { name: 'South America', total: 12 },
    { name: 'Oceania', total: 14 },
  ]

  return (
    <div className="card p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">World Coverage</h3>
      <div className="space-y-3">
        {continentData.map((continent) => (
          <div key={continent.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: getContinentColor(continent.name) }} />
                {continent.name}
              </span>
              <span className="text-gray-400 text-xs">0 / {continent.total}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${0}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: getContinentColor(continent.name) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentTrip({ location }: { location: Location }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {location.country.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{location.name}</p>
        <p className="text-xs text-gray-400">{formatDate(location.visitedAt)}</p>
      </div>
      {location.rating && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: location.rating }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-xs">★</span>
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardClient({ session }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    const res = await fetch('/api/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travelmap-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleExportPDF = async () => {
    if (!stats) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    doc.setFontSize(24)
    doc.setTextColor(37, 99, 235)
    doc.text('TravelMap Report', 20, 30)

    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40)
    doc.text(`Traveler: ${session.user?.name || session.user?.email}`, 20, 48)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Travel Statistics', 20, 65)

    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    const lines = [
      `Countries visited: ${stats.countries} / 195`,
      `Cities explored: ${stats.cities}`,
      `Continents: ${stats.continents} / 7`,
      `Total locations: ${stats.totalLocations}`,
      `World explored: ${stats.travelPercentage}%`,
    ]
    lines.forEach((line, i) => doc.text(line, 20, 80 + i * 10))

    if (stats.recentTrips.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('Recent Trips', 20, 145)
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      stats.recentTrips.forEach((trip, i) => {
        doc.text(`• ${trip.name}, ${trip.country} — ${formatDate(trip.visitedAt)}`, 20, 160 + i * 10)
      })
    }

    doc.save(`travelmap-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  if (loading || !stats) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {session.user?.name?.split(' ')[0] || 'Traveler'} 👋
            </h1>
            <p className="text-gray-500 mt-1">Here&apos;s your travel summary</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2 text-sm">
              📄 PDF Report
            </button>
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
              ⬇️ Export Data
            </button>
            <Link href="/map" className="btn-primary flex items-center gap-2 text-sm">
              🗺️ Open Map
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards(stats).map((card, i) => (
            <StatCard key={card.label} card={card} index={i} />
          ))}
        </div>

        {/* Progress + Travel goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TravelProgress stats={stats} />
          </div>

          {/* Travel goal card */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Travel Goal</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#3b82f6" strokeWidth="2.5"
                  strokeDasharray={`${stats.travelPercentage} ${100 - stats.travelPercentage}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.travelPercentage}%</span>
                <span className="text-xs text-gray-400">of world</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              {stats.countries} countries visited · {195 - stats.countries} to go
            </p>
          </div>
        </div>

        {/* Recent trips + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Trips</h3>
              <Link href="/timeline" className="text-sm text-blue-600 hover:text-blue-700">
                View timeline →
              </Link>
            </div>
            {stats.recentTrips.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-3xl block mb-2">✈️</span>
                <p className="text-sm">No trips recorded yet</p>
                <Link href="/map" className="text-blue-600 text-sm mt-2 block hover:underline">
                  Add your first trip →
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {stats.recentTrips.map((trip) => (
                  <RecentTrip key={trip.id} location={trip} />
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🗺️', label: 'Open Map', href: '/map', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
                { icon: '📸', label: 'Gallery', href: '/gallery', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
                { icon: '📅', label: 'Timeline', href: '/timeline', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
                { icon: '⭐', label: 'Wishlist', href: '/wishlist', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
