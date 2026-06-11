'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Location, Wishlist } from '@/types'

function createColoredIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })
}

const visitedIcon = createColoredIcon('#22c55e')
const unvisitedIcon = createColoredIcon('#ef4444')
const wishlistIcon = createColoredIcon('#3b82f6')

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MapComponentProps {
  locations: Location[]
  wishlists: Wishlist[]
  onLocationClick: (location: Location) => void
  onMapClick: (coords: { lat: number; lng: number }) => void
}

export default function MapComponent({ locations, wishlists, onLocationClick, onMapClick }: MapComponentProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onClick={(lat, lng) => onMapClick({ lat, lng })} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={location.visited ? visitedIcon : unvisitedIcon}
          eventHandlers={{
            click: () => onLocationClick(location),
          }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <div className="font-bold text-gray-900">{location.name}</div>
              <div className="text-sm text-gray-500">{location.country}</div>
              <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                location.visited
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {location.visited ? '✓ Visited' : '● Not visited'}
              </div>
              {location.photos && location.photos.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  📸 {location.photos.length} photo{location.photos.length > 1 ? 's' : ''}
                </div>
              )}
              <button
                onClick={() => onLocationClick(location)}
                className="mt-3 w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {wishlists.map((wish) => (
        <Marker
          key={wish.id}
          position={[wish.latitude, wish.longitude]}
          icon={wishlistIcon}
        >
          <Popup>
            <div className="min-w-[160px]">
              <div className="font-bold text-gray-900">{wish.name}</div>
              <div className="text-sm text-gray-500">{wish.country}</div>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                ⭐ Wishlist
              </div>
              {wish.notes && (
                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{wish.notes}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
