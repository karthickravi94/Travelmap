import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [allLocations, visitedLocations, recentTrips] = await Promise.all([
    prisma.location.findMany({
      where: { userId: session.user.id },
      select: { country: true, city: true, continent: true, visited: true },
    }),
    prisma.location.findMany({
      where: { userId: session.user.id, visited: true },
      select: { country: true, city: true, continent: true },
    }),
    prisma.location.findMany({
      where: { userId: session.user.id, visited: true },
      orderBy: { visitedAt: 'desc' },
      take: 5,
      include: { photos: { take: 1 } },
    }),
  ])

  const countries = new Set(visitedLocations.map((l) => l.country)).size
  const cities = new Set(visitedLocations.map((l) => l.city).filter(Boolean)).size
  const continents = new Set(visitedLocations.map((l) => l.continent).filter(Boolean)).size

  const stats = {
    totalLocations: allLocations.length,
    visitedLocations: visitedLocations.length,
    unvisitedLocations: allLocations.length - visitedLocations.length,
    countries,
    cities,
    continents,
    travelPercentage: Math.round((countries / 195) * 100),
    recentTrips,
  }

  return NextResponse.json(stats)
}
