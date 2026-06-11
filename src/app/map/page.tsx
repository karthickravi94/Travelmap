import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TravelMap } from '@/components/map/TravelMap'

export const metadata = {
  title: 'Interactive Map — TravelMap',
}

export default async function MapPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="fixed inset-0 pt-16">
      <TravelMap />
    </div>
  )
}
