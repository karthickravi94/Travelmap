import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TimelineClient } from './TimelineClient'

export const metadata = { title: 'Travel Timeline — TravelMap' }

export default async function TimelinePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return <TimelineClient />
}
