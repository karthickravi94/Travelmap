export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Unknown date'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getContinentColor(continent: string | null | undefined): string {
  const colors: Record<string, string> = {
    Europe: '#3b82f6',
    Asia: '#f59e0b',
    'North America': '#10b981',
    'South America': '#8b5cf6',
    Africa: '#ef4444',
    Oceania: '#06b6d4',
    Antarctica: '#6b7280',
  }
  return colors[continent || ''] || '#6b7280'
}

export function getCountryFromCoords(lat: number, lng: number): string {
  return 'Unknown'
}

export function calculateTravelPercentage(visited: number, total: number): number {
  if (total === 0) return 0
  return Math.round((visited / total) * 100)
}

export function groupByContinent(locations: Array<{ continent?: string | null }>): Record<string, number> {
  return locations.reduce(
    (acc, loc) => {
      const continent = loc.continent || 'Unknown'
      acc[continent] = (acc[continent] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

export function groupByCountry(locations: Array<{ country: string }>): Record<string, number> {
  return locations.reduce(
    (acc, loc) => {
      acc[loc.country] = (acc[loc.country] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const CONTINENTS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
]

export const COUNTRIES_COUNT = 195
