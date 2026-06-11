'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '🗺️',
    title: 'Interactive World Map',
    description: 'Visualize your travels on a beautiful OpenStreetMap. Green pins mark visited places, red for planned, blue for wishlist.',
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    icon: '📸',
    title: 'Travel Gallery',
    description: 'Upload unlimited photos for each destination. Beautiful grid layout with full-screen viewer and captions.',
    gradient: 'from-blue-400 to-cyan-600',
  },
  {
    icon: '📊',
    title: 'Travel Dashboard',
    description: 'See your travel stats at a glance — countries visited, continents explored, and your travel percentage.',
    gradient: 'from-purple-400 to-violet-600',
  },
  {
    icon: '📅',
    title: 'Travel Timeline',
    description: 'Chronological history of all your adventures with photos, dates, ratings, and personal notes.',
    gradient: 'from-orange-400 to-red-600',
  },
  {
    icon: '⭐',
    title: 'Wishlist',
    description: 'Save dream destinations with blue markers. Prioritize your bucket list and plan your next adventure.',
    gradient: 'from-yellow-400 to-amber-600',
  },
  {
    icon: '📄',
    title: 'Export & Reports',
    description: 'Generate beautiful PDF travel reports or export your data as JSON. Your memories, your data.',
    gradient: 'from-pink-400 to-rose-600',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Everything you need to track your travels
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A premium travel journal experience, completely free and open source.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
