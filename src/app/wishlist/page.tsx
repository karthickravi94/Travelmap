import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WishlistClient } from './WishlistClient'

export const metadata = { title: 'Wishlist — TravelMap' }

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return <WishlistClient />
}
