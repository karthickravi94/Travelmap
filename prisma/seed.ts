import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo1234', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@travelmap.app' },
    update: {},
    create: {
      email: 'demo@travelmap.app',
      name: 'Demo Traveler',
      password: hashedPassword,
      bio: 'Passionate traveler exploring the world one city at a time.',
    },
  })

  const locationsData = [
    {
      name: 'Paris, France',
      country: 'France',
      city: 'Paris',
      continent: 'Europe',
      latitude: 48.8566,
      longitude: 2.3522,
      visited: true,
      visitedAt: new Date('2023-04-15'),
      notes: 'Amazing city! Visited the Eiffel Tower and Louvre.',
      rating: 5,
    },
    {
      name: 'Tokyo, Japan',
      country: 'Japan',
      city: 'Tokyo',
      continent: 'Asia',
      latitude: 35.6762,
      longitude: 139.6503,
      visited: true,
      visitedAt: new Date('2023-08-20'),
      notes: 'Incredible food and culture. Must return!',
      rating: 5,
    },
    {
      name: 'New York, USA',
      country: 'United States',
      city: 'New York',
      continent: 'North America',
      latitude: 40.7128,
      longitude: -74.006,
      visited: true,
      visitedAt: new Date('2022-12-01'),
      notes: 'The city that never sleeps. Amazing skyline.',
      rating: 4,
    },
    {
      name: 'Sydney, Australia',
      country: 'Australia',
      city: 'Sydney',
      continent: 'Oceania',
      latitude: -33.8688,
      longitude: 151.2093,
      visited: true,
      visitedAt: new Date('2023-01-10'),
      notes: 'Beautiful harbor and Opera House.',
      rating: 5,
    },
    {
      name: 'Cape Town, South Africa',
      country: 'South Africa',
      city: 'Cape Town',
      continent: 'Africa',
      latitude: -33.9249,
      longitude: 18.4241,
      visited: true,
      visitedAt: new Date('2022-06-15'),
      notes: 'Table Mountain views are breathtaking.',
      rating: 5,
    },
    {
      name: 'London, UK',
      country: 'United Kingdom',
      city: 'London',
      continent: 'Europe',
      latitude: 51.5074,
      longitude: -0.1278,
      visited: false,
      notes: null,
      rating: null,
    },
    {
      name: 'Rio de Janeiro, Brazil',
      country: 'Brazil',
      city: 'Rio de Janeiro',
      continent: 'South America',
      latitude: -22.9068,
      longitude: -43.1729,
      visited: false,
      notes: null,
      rating: null,
    },
    {
      name: 'Barcelona, Spain',
      country: 'Spain',
      city: 'Barcelona',
      continent: 'Europe',
      latitude: 41.3851,
      longitude: 2.1734,
      visited: true,
      visitedAt: new Date('2023-07-04'),
      notes: 'Gaudi architecture is stunning. Great beaches too.',
      rating: 4,
    },
    {
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      city: 'Bali',
      continent: 'Asia',
      latitude: -8.3405,
      longitude: 115.092,
      visited: false,
      notes: null,
      rating: null,
    },
    {
      name: 'Dubai, UAE',
      country: 'United Arab Emirates',
      city: 'Dubai',
      continent: 'Asia',
      latitude: 25.2048,
      longitude: 55.2708,
      visited: true,
      visitedAt: new Date('2023-03-20'),
      notes: 'Futuristic city with amazing architecture.',
      rating: 4,
    },
  ]

  for (const loc of locationsData) {
    await prisma.location.create({
      data: {
        ...loc,
        userId: user.id,
      },
    })
  }

  const wishlistData = [
    {
      name: 'Machu Picchu, Peru',
      country: 'Peru',
      city: 'Cusco',
      continent: 'South America',
      latitude: -13.1631,
      longitude: -72.5449,
      notes: 'Dream to hike the Inca Trail.',
      priority: 1,
    },
    {
      name: 'Santorini, Greece',
      country: 'Greece',
      city: 'Santorini',
      continent: 'Europe',
      latitude: 36.3932,
      longitude: 25.4615,
      notes: 'Those blue domed churches!',
      priority: 2,
    },
    {
      name: 'Kyoto, Japan',
      country: 'Japan',
      city: 'Kyoto',
      continent: 'Asia',
      latitude: 35.0116,
      longitude: 135.7681,
      notes: 'Temples, geisha, and cherry blossoms.',
      priority: 1,
    },
    {
      name: 'Iceland',
      country: 'Iceland',
      city: 'Reykjavik',
      continent: 'Europe',
      latitude: 64.9631,
      longitude: -19.0208,
      notes: 'Northern lights and geysers!',
      priority: 2,
    },
  ]

  for (const wish of wishlistData) {
    await prisma.wishlist.create({
      data: {
        ...wish,
        userId: user.id,
      },
    })
  }

  console.log('✅ Seed data created successfully!')
  console.log('📧 Demo user: demo@travelmap.app')
  console.log('🔑 Password: demo1234')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
