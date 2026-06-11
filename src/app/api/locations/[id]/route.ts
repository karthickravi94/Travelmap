import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const location = await prisma.location.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { photos: { orderBy: { createdAt: 'desc' } } },
  })

  if (!location) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 })
  }

  return NextResponse.json(location)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const location = await prisma.location.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const updated = await prisma.location.update({
      where: { id: params.id },
      data: {
        ...body,
        visitedAt: body.visitedAt ? new Date(body.visitedAt) : body.visitedAt,
      },
      include: { photos: { orderBy: { createdAt: 'desc' } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update location error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const location = await prisma.location.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!location) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 })
  }

  await prisma.location.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
