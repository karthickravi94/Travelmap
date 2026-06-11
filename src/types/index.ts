export interface Location {
  id: string
  name: string
  country: string
  city?: string | null
  continent?: string | null
  latitude: number
  longitude: number
  visited: boolean
  visitedAt?: Date | string | null
  notes?: string | null
  rating?: number | null
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
  photos?: Photo[]
}

export interface Photo {
  id: string
  url: string
  thumbnail?: string | null
  caption?: string | null
  locationId: string
  userId: string
  takenAt?: Date | string | null
  createdAt: Date | string
}

export interface Wishlist {
  id: string
  name: string
  country: string
  city?: string | null
  continent?: string | null
  latitude: number
  longitude: number
  notes?: string | null
  priority: number
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  bio?: string | null
  createdAt: Date | string
}

export interface DashboardStats {
  totalLocations: number
  visitedLocations: number
  unvisitedLocations: number
  countries: number
  cities: number
  continents: number
  travelPercentage: number
  recentTrips: Location[]
}

export type MarkerType = 'visited' | 'unvisited' | 'wishlist'

export interface MapMarkerData {
  id: string
  name: string
  latitude: number
  longitude: number
  type: MarkerType
  country: string
  city?: string | null
  photos?: Photo[]
}
