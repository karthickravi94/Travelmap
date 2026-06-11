import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { StatsPreview } from '@/components/home/StatsPreview'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="overflow-hidden">
      <HeroSection session={session} />
      <FeaturesSection />
      <StatsPreview />
    </div>
  )
}
