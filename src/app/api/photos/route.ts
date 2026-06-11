import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const photoId = searchParams.get('id')

  if (!photoId) {
    return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
  }

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, userId: session.user.id },
  })

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  try {
    if (photo.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', photo.url)
      await unlink(filePath).catch(() => {})
    }
  } catch {}

  await prisma.photo.delete({ where: { id: photoId } })

  return NextResponse.json({ success: true })
}
