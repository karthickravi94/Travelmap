import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const locationId = formData.get('locationId') as string
    const caption = formData.get('caption') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID required' }, { status: 400 })
    }

    const location = await prisma.location.findFirst({
      where: { id: locationId, userId: session.user.id },
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760')
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    const url = `/uploads/${filename}`

    const photo = await prisma.photo.create({
      data: {
        url,
        thumbnail: url,
        caption: caption || null,
        locationId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
