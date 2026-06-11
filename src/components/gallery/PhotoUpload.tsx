'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Photo } from '@/types'
import { formatFileSize } from '@/lib/utils'

interface PhotoUploadProps {
  locationId: string
  onUploaded: (photo: Photo) => void
}

interface UploadFile {
  file: File
  preview: string
  caption: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
}

export function PhotoUpload({ locationId, onUploaded }: PhotoUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      status: 'pending' as const,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  })

  const uploadFile = async (uploadFile: UploadFile, index: number) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: 'uploading', progress: 0 } : f)))

    const formData = new FormData()
    formData.append('file', uploadFile.file)
    formData.append('locationId', locationId)
    formData.append('caption', uploadFile.caption)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const photo = await res.json()
      if (res.ok) {
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: 'done', progress: 100 } : f)))
        onUploaded(photo)
      } else {
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: 'error' } : f)))
      }
    } catch {
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: 'error' } : f)))
    }
  }

  const uploadAll = async () => {
    const pending = files.filter((f) => f.status === 'pending')
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') await uploadFile(files[i], i)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📸</div>
        <p className="font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? 'Drop photos here!' : 'Drag & drop photos, or click to browse'}
        </p>
        <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <img src={f.preview} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{f.file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(f.file.size)}</p>
                {f.status === 'pending' && (
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={f.caption}
                    onChange={(e) => setFiles((prev) => prev.map((file, idx) => idx === i ? { ...file, caption: e.target.value } : file))}
                    className="mt-1 text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-full"
                  />
                )}
                {f.status === 'uploading' && (
                  <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {f.status === 'pending' && (
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 p-1">✕</button>
                )}
                {f.status === 'done' && <span className="text-green-500 text-lg">✓</span>}
                {f.status === 'error' && <span className="text-red-500 text-sm">Failed</span>}
                {f.status === 'uploading' && (
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>
            </div>
          ))}

          {pendingCount > 0 && (
            <button onClick={uploadAll} className="btn-primary w-full">
              Upload {pendingCount} photo{pendingCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
