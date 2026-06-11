'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Session } from 'next-auth'

interface HeroSectionProps {
  session: Session | null
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />

      {/* Animated world map dots */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { emoji: '✈️', top: '15%', left: '10%', delay: 0 },
          { emoji: '🗺️', top: '70%', left: '15%', delay: 1 },
          { emoji: '📸', top: '20%', right: '10%', delay: 2 },
          { emoji: '🌏', top: '60%', right: '8%', delay: 0.5 },
          { emoji: '⭐', top: '40%', left: '5%', delay: 1.5 },
          { emoji: '🏔️', top: '80%', right: '20%', delay: 2.5 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none"
            style={{ top: item.top, left: (item as any).left, right: (item as any).right }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Track • Explore • Remember
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          Your World,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            Your Journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Pin every place you've visited, cherish your travel memories, and plan your next adventure on an interactive world map.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {session ? (
            <>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
              >
                <span>🗺️</span> Open My Map
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all duration-200 border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-100"
              >
                <span>📊</span> Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
              >
                <span>🚀</span> Start for Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all duration-200 border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-100"
              >
                Sign in
              </Link>
            </>
          )}
        </motion.div>

        {/* Quick stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { label: 'Countries', value: '195', icon: '🌍' },
            { label: 'Free Forever', value: '100%', icon: '💚' },
            { label: 'Open Source', value: 'MIT', icon: '🔓' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" className="fill-white dark:fill-gray-950" />
        </svg>
      </div>
    </section>
  )
}
