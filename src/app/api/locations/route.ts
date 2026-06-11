import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const visited = searchParams.get('visited')

  const locations = await prisma.location.findMany({
    where: {
      userId: session.user.id,
      ...(visited !== null ? { visited: visited === 'true' } : {}),
    },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(locations)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, country, city, continent, latitude, longitude, visited, visitedAt, notes, rating } = body

    if (!name || !country || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const location = await prisma.location.create({
      data: {
        name,
        country,
        city: city || null,
        continent: continent || null,
        latitude,
        longitude,
        visited: visited ?? false,
        visitedAt: visitedAt ? new Date(visitedAt) : null,
        notes: notes || null,
        rating: rating || null,
        userId: session.user.id,
      },
      include: { photos: true },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Create location error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
