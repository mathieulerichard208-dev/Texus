export async function compressImage(file: File) {
  const previewUrl = URL.createObjectURL(file)
  return { file, width: 800, height: 600, blurhash: previewUrl, previewUrl }
}

export async function uploadImage(supabase: any, file: File, userId: string) {
  const fileName = `${userId}/${Date.now()}.webp`
  const { error } = await supabase.storage.from('chat-images').upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage.from('chat-images').getPublicUrl(fileName)
  return data.publicUrl
}
