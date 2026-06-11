'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function StatsPreview() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Track every adventure with beautiful statistics
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Watch your travel percentage grow. See which continents you&apos;ve conquered and discover how much of the world is still waiting for you.
            </p>
            <div className="space-y-4">
              {[
                { label: '100% Free', desc: 'No paid APIs, no subscriptions', icon: '💚' },
                { label: 'Open Source Maps', desc: 'Powered by OpenStreetMap & Leaflet', icon: '🗺️' },
                { label: 'Your Data', desc: 'Export anytime, own everything', icon: '🔒' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/register" className="btn-primary inline-flex items-center gap-2">
                Start your travel journal →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: 'Countries visited', value: '12', icon: '🌍', gradient: 'stat-gradient-blue' },
              { label: 'Cities explored', value: '47', icon: '🏙️', gradient: 'stat-gradient-green' },
              { label: 'Continents', value: '4', icon: '✈️', gradient: 'stat-gradient-orange' },
              { label: 'World explored', value: '6%', icon: '🌐', gradient: 'stat-gradient-purple' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${stat.gradient} rounded-2xl p-6 text-white`}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-white/70 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
