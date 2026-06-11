import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [locations, wishlist, user] = await Promise.all([
    prisma.location.findMany({
      where: { userId: session.user.id },
      include: { photos: true },
      orderBy: { visitedAt: 'desc' },
    }),
    prisma.wishlist.findMany({
      where: { userId: session.user.id },
      orderBy: { priority: 'asc' },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, createdAt: true },
    }),
  ])

  const visitedLocations = locations.filter((l) => l.visited)
  const countries = new Set(visitedLocations.map((l) => l.country)).size
  const continents = new Set(visitedLocations.map((l) => l.continent).filter(Boolean)).size

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      name: user?.name,
      email: user?.email,
      memberSince: user?.createdAt,
    },
    summary: {
      totalLocations: locations.length,
      visited: visitedLocations.length,
      countries,
      continents,
      wishlistItems: wishlist.length,
    },
    locations: locations.map((l) => ({
      name: l.name,
      country: l.country,
      city: l.city,
      continent: l.continent,
      coordinates: { lat: l.latitude, lng: l.longitude },
      visited: l.visited,
      visitedAt: l.visitedAt,
      rating: l.rating,
      notes: l.notes,
      photosCount: l.photos.length,
    })),
    wishlist: wishlist.map((w) => ({
      name: w.name,
      country: w.country,
      city: w.city,
      continent: w.continent,
      priority: w.priority,
      notes: w.notes,
    })),
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="travelmap-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}
