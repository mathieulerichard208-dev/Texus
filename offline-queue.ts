// lib/offline-queue.ts
// File d'attente IndexedDB : stocke les messages localement
// et les envoie automatiquement quand la connexion revient

import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface TexusDB extends DBSchema {
  'pending-messages': {
    key: string
    value: {
      id: string
      conversation_id: string
      sender_id: string
      type: 'text' | 'image'
      content: string | null
      image_data: string | null  // base64 de l'image en attente
      created_at: number
      retries: number
    }
  }
}

let db: IDBPDatabase<TexusDB> | null = null

async function getDB() {
  if (!db) {
    db = await openDB<TexusDB>('texus-offline', 1, {
      upgrade(db) {
        db.createObjectStore('pending-messages', { keyPath: 'id' })
      },
    })
  }
  return db
}

/** Ajoute un message à la file d'attente locale */
export async function queueMessage(msg: {
  id: string
  conversation_id: string
  sender_id: string
  type: 'text' | 'image'
  content: string | null
  image_data?: string | null
}) {
  const db = await getDB()
  await db.put('pending-messages', {
    ...msg,
    image_data: msg.image_data ?? null,
    created_at: Date.now(),
    retries: 0,
  })
}

/** Récupère tous les messages en attente */
export async function getPendingMessages() {
  const db = await getDB()
  return db.getAll('pending-messages')
}

/** Supprime un message de la file (après envoi réussi) */
export async function removePendingMessage(id: string) {
  const db = await getDB()
  await db.delete('pending-messages', id)
}

/** Écoute le retour de la connexion et vide la file */
export function startOfflineSync(
  sendFn: (msg: any) => Promise<void>,
  onSync?: (count: number) => void
) {
  const tryFlush = async () => {
    if (!navigator.onLine) return
    const pending = await getPendingMessages()
    if (pending.length === 0) return

    let sent = 0
    for (const msg of pending) {
      try {
        await sendFn(msg)
        await removePendingMessage(msg.id)
        sent++
      } catch {
        // On laisse pour la prochaine tentative
      }
    }
    if (sent > 0 && onSync) onSync(sent)
  }

  window.addEventListener('online', tryFlush)

  // Essai immédiat au chargement
  tryFlush()

  return () => window.removeEventListener('online', tryFlush)
}

/** Vérifie si l'utilisateur est en ligne */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}
