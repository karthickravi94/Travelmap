'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Location, Photo } from '@/types'
import { PhotoUpload } from './PhotoUpload'

interface PhotoGalleryProps {
  location: Location
  onClose: () => void
  onUpdate: (location: Location) => void
}

export function PhotoGallery({ location, onClose, onUpdate }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(location.photos || [])
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handlePhotoUploaded = (photo: Photo) => {
    const updated = [...photos, photo]
    setPhotos(updated)
    onUpdate({ ...location, photos: updated })
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return
    setDeleting(photoId)
    try {
      await fetch(`/api/photos?id=${photoId}`, { method: 'DELETE' })
      const updated = photos.filter((p) => p.id !== photoId)
      setPhotos(updated)
      onUpdate({ ...location, photos: updated })
      if (lightboxPhoto?.id === photoId) setLightboxPhoto(null)
    } catch (error) {
      console.error('Delete photo error:', error)
    } finally {
      setDeleting(null)
    }
  }

  const goNext = () => {
    if (!lightboxPhoto) return
    const idx = photos.findIndex((p) => p.id === lightboxPhoto.id)
    setLightboxPhoto(photos[(idx + 1) % photos.length])
  }

  const goPrev = () => {
    if (!lightboxPhoto) return
    const idx = photos.findIndex((p) => p.id === lightboxPhoto.id)
    setLightboxPhoto(photos[(idx - 1 + photos.length) % photos.length])
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{location.name}</h2>
            <p className="text-sm text-gray-500">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="btn-primary text-sm py-2"
            >
              + Add Photos
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Upload area */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-gray-100 dark:border-gray-800"
            >
              <div className="p-6">
                <PhotoUpload locationId={location.id} onUploaded={handlePhotoUploaded} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-4">📷</span>
              <p className="text-lg font-medium">No photos yet</p>
              <p className="text-sm mt-1">Upload photos to bring this location to life</p>
              <button onClick={() => setShowUpload(true)} className="btn-primary mt-6">
                Upload first photo
              </button>
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setLightboxPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || location.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
                      {photo.caption && (
                        <p className="text-white text-xs bg-black/50 rounded-lg px-2 py-1 truncate">{photo.caption}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id) }}
                    disabled={deleting === photo.id}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[700] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
            >
              ←
            </button>
            <motion.img
              key={lightboxPhoto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption || ''}
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
              onClick={(e) => { e.stopPropagation(); goNext() }}
            >
              →
            </button>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLightboxPhoto(null)}
            >
              ✕
            </button>
            {lightboxPhoto.caption && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {lightboxPhoto.caption}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
