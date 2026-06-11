import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { GalleryClient } from './GalleryClient'

export const metadata = { title: 'Travel Gallery — TravelMap' }

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return <GalleryClient />
}
