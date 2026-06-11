'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@travelmap.app')
    setPassword('demo1234')
    setLoading(true)
    const result = await signIn('credentials', {
      email: 'demo@travelmap.app',
      password: 'demo1234',
      redirect: false,
    })
    if (result?.error) {
      setError('Demo account not available. Please register.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl">✈️</span>
            <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
            <p className="text-white/60 mt-2">Sign in to your TravelMap account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-white/70">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-blue-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="label text-white/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-blue-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent px-4 text-white/40">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all duration-200 disabled:opacity-50"
          >
            🎯 Try Demo Account
          </button>

          <p className="text-center text-white/50 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
