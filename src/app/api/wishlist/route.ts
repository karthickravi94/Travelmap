import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(wishlists)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, country, city, continent, latitude, longitude, notes, priority } = body

    if (!name || !country || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        name,
        country,
        city: city || null,
        continent: continent || null,
        latitude,
        longitude,
        notes: notes || null,
        priority: priority || 1,
        userId: session.user.id,
      },
    })

    return NextResponse.json(wishlist, { status: 201 })
  } catch (error) {
    console.error('Create wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  const item = await prisma.wishlist.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.wishlist.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
