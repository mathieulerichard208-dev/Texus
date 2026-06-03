// lib/compress.ts
// Compression automatique des photos avant envoi
// Objectif : < 300 Ko même pour les grandes images

import imageCompression from 'browser-image-compression'

export interface CompressedImage {
  file: File
  width: number
  height: number
  blurhash: string  // aperçu flou pendant le chargement
  previewUrl: string
}

/**
 * Compresse une image pour envoi sur réseau faible (2G/3G)
 * Réduit à max 300 Ko, max 1200px de large
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  const options = {
    maxSizeMB: 0.3,          // 300 Ko maximum
    maxWidthOrHeight: 1200,  // 1200px maximum
    useWebWorker: true,
    fileType: 'image/webp',  // WebP = meilleure compression
    initialQuality: 0.8,
  }

  const compressed = await imageCompression(file, options)

  // Obtenir dimensions réelles
  const { width, height } = await getImageDimensions(compressed)

  // Générer un blurhash (aperçu flou de 4x3 pixels encodé)
  const blurhash = await generateSimpleBlurhash(compressed)

  const previewUrl = URL.createObjectURL(compressed)

  return { file: compressed, width, height, blurhash, previewUrl }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = URL.createObjectURL(file)
  })
}

// Génère un blurhash simplifié (couleur dominante encodée en base64)
async function generateSimpleBlurhash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 8, 8)
      resolve(canvas.toDataURL('image/jpeg', 0.1))
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Upload d'une image vers Supabase Storage
 * avec retry automatique si la connexion coupe
 */
export async function uploadImage(
  supabase: any,
  file: File,
  userId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = 'webp'
  const fileName = `${userId}/${Date.now()}.${ext}`

  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    try {
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      attempts++
      if (attempts === maxAttempts) throw err
      // Attendre avant de réessayer (1s, 2s, 4s)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts - 1)))
    }
  }

  throw new Error('Upload échoué après 3 tentatives')
}
