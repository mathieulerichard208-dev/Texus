// hooks/useMessages.ts
// Écoute les messages en temps réel via Supabase Realtime
// Gère aussi la file d'attente offline

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase, Message } from '@/lib/supabase'
import { queueMessage, startOfflineSync, isOnline } from '@/lib/offline-queue'
import { compressImage, uploadImage } from '@/lib/compress'

export function useMessages(conversationId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const channelRef = useRef<any>(null)

  // Charger les messages existants
  useEffect(() => {
    if (!conversationId) return
    setLoading(true)

    supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? [])
        setLoading(false)
      })
  }, [conversationId])

  // S'abonner aux nouveaux messages en temps réel
  useEffect(() => {
    if (!conversationId) return

    channelRef.current = supabase
      .channel(`conv:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Charger les infos du sender
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single()

          const newMsg = { ...payload.new, sender } as Message

          setMessages((prev) => {
            // Éviter les doublons (le sender voit déjà son message)
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [conversationId])

  // Démarrer la sync offline au montage
  useEffect(() => {
    const cleanup = startOfflineSync(
      async (pending) => {
        await supabase.from('messages').insert({
          id: pending.id,
          conversation_id: pending.conversation_id,
          sender_id: pending.sender_id,
          type: pending.type,
          content: pending.content,
        })
      },
      (count) => console.log(`${count} message(s) synchronisé(s)`)
    )
    return cleanup
  }, [])

  // Envoyer un message texte
  const sendText = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      setSending(true)

      const id = crypto.randomUUID()
      const newMsg: Message = {
        id,
        conversation_id: conversationId,
        sender_id: userId,
        type: 'text',
        content,
        image_url: null,
        image_blurhash: null,
        image_width: null,
        image_height: null,
        is_read: false,
        sent_at: new Date().toISOString(),
      }

      // Afficher immédiatement (optimistic UI)
      setMessages((prev) => [...prev, newMsg])

      if (!isOnline()) {
        // Mettre en file d'attente si hors ligne
        await queueMessage({ id, conversation_id: conversationId, sender_id: userId, type: 'text', content })
        setSending(false)
        return
      }

      try {
        await supabase.from('messages').insert({
          id,
          conversation_id: conversationId,
          sender_id: userId,
          type: 'text',
          content,
        })
      } catch {
        // Si ça échoue → mettre en file d'attente
        await queueMessage({ id, conversation_id: conversationId, sender_id: userId, type: 'text', content })
      } finally {
        setSending(false)
      }
    },
    [conversationId, userId]
  )

  // Envoyer une photo (avec compression automatique)
  const sendImage = useCallback(
    async (file: File) => {
      setSending(true)
      setUploadProgress(0)

      try {
        // 1. Compresser (< 300 Ko)
        const compressed = await compressImage(file)
        setUploadProgress(30)

        // 2. Afficher immédiatement en local (aperçu flou)
        const tempId = crypto.randomUUID()
        const optimisticMsg: Message = {
          id: tempId,
          conversation_id: conversationId,
          sender_id: userId,
          type: 'image',
          content: null,
          image_url: compressed.previewUrl,
          image_blurhash: compressed.blurhash,
          image_width: compressed.width,
          image_height: compressed.height,
          is_read: false,
          sent_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, optimisticMsg])
        setUploadProgress(50)

        // 3. Upload sur Supabase Storage
        const imageUrl = await uploadImage(supabase, compressed.file, userId)
        setUploadProgress(90)

        // 4. Enregistrer le message en base
        const { data } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: userId,
            type: 'image',
            image_url: imageUrl,
            image_blurhash: compressed.blurhash,
            image_width: compressed.width,
            image_height: compressed.height,
          })
          .select()
          .single()

        // Remplacer le message temporaire par le vrai
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: data.id, image_url: imageUrl } : m))
        )
        setUploadProgress(null)
      } catch (err) {
        console.error('Erreur envoi photo :', err)
        setUploadProgress(null)
      } finally {
        setSending(false)
      }
    },
    [conversationId, userId]
  )

  return { messages, loading, sending, uploadProgress, sendText, sendImage }
}
