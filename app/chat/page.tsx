'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<string | null>(null)
  const [audioPaused, setAudioPaused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<any>(null)
  const previewRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m + ":" + String(sec).padStart(2, "0")
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      mediaRecorder.ondataavailable = e => audioChunksRef.current.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = () => setAudioBlob(reader.result as string)
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorder.start()
      setRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } catch {
      alert('Autorise le micro dans les paramètres du navigateur')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    clearInterval(timerRef.current)
  }

  function cancelAudio() {
    setAudioBlob(null)
    setRecordingTime(0)
  }

  function sendAudio() {
    if (!audioBlob) return
    const now = new Date()
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
    const newMsg = { id: Date.now(), text: '', image: null, audio: audioBlob, duration: recordingTime, time, status: 'sent', mine: true }
    setMessages(prev => [...prev, newMsg])
    setAudioBlob(null)
    setRecordingTime(0)
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'delivered'} : m)), 1000)
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'read'} : m)), 2500)
  }

  function sendMessage() {
    if (!text.trim() && !image) return
    const now = new Date()
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
    const newMsg = { id: Date.now(), text, image, audio: null, time, status: 'sent', mine: true }
    setMessages(prev => [...prev, newMsg])
    setText('')
    setImage(null)
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'delivered'} : m)), 1000)
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'read'} : m)), 2500)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function getCheck(status: string) {
    if (status === 'sent') return <span style={{color:'#888'}}>✓</span>
    if (status === 'delivered') return <span style={{color:'#888'}}>✓✓</span>
    if (status === 'read') return <span style={{color:'#5b8dff'}}>✓✓</span>
    return null
  }

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'12px 16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
        <button onClick={() => router.push('/discussions')} style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>←</button>
        <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>👤</div>
        <div style={{flex:1}}>
          <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>Discussion</div>
          <div style={{color:'#888',fontSize:'12px'}}>En ligne</div>
        </div>
        <button style={{background:'none',border:'none',color:'#888',fontSize:'20px',cursor:'pointer'}}>📞</button>
        <button style={{background:'none',border:'none',color:'#888',fontSize:'20px',cursor:'pointer'}}>📹</button>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'12px'}}>
        {messages.length === 0 && (
          <div style={{textAlign:'center',color:'#555',marginTop:'60px'}}>
            <div style={{fontSize:'48px'}}>💬</div>
            <p>Commence la conversation !</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{display:'flex',justifyContent: msg.mine ? 'flex-end' : 'flex-start',marginBottom:'8px'}}>
            <div style={{background: msg.mine ? '#5b8dff' : '#1a1d2e',color:'#fff',padding:'10px 14px',borderRadius: msg.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',maxWidth:'75%',fontSize:'14px'}}>
              {msg.image && <img src={msg.image} alt="" style={{width:'100%',borderRadius:'8px',marginBottom:'6px',maxHeight:'200px',objectFit:'cover'}} />}
              {msg.audio && (
                <div style={{display:'flex',alignItems:'center',gap:'8px',minWidth:'180px'}}>
                  <span style={{fontSize:'20px'}}>🎙️</span>
                  <audio controls src={msg.audio} style={{flex:1,height:'32px'}} />
                  <span style={{fontSize:'11px',color:'rgba(255,255,255,0.7)'}}>{formatTime(msg.duration || 0)}</span>
                </div>
              )}
              {msg.text && <div>{msg.text}</div>}
              <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'4px',marginTop:'4px'}}>
                <span style={{fontSize:'11px',color:'rgba(255,255,255,0.6)'}}>{msg.time}</span>
                {msg.mine && getCheck(msg.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {image && (
        <div style={{padding:'8px 16px',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
          <div style={{position:'relative',display:'inline-block'}}>
            <img src={image} alt="preview" style={{height:'60px',borderRadius:'8px',objectFit:'cover'}} />
            <button onClick={() => setImage(null)} style={{position:'absolute',top:'-8px',right:'-8px',background:'#ff4444',border:'none',borderRadius:'50%',width:'20px',height:'20px',color:'#fff',cursor:'pointer',fontSize:'12px'}}>✕</button>
          </div>
        </div>
      )}

      {recording && (
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
          <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#ff4444',animation:'pulse 1s infinite'}}></div>
          <div style={{color:'#ff4444',fontSize:'14px',fontWeight:600}}>🎙️ {formatTime(recordingTime)}</div>
          <div style={{flex:1,height:'2px',background:'#222640',borderRadius:'2px'}}>
            <div style={{width: ${Math.min(recordingTime * 2, 100)}%,height:'100%',background:'#ff4444',borderRadius:'2px'}}></div>
          </div>
          <button onClick={stopRecording} style={{background:'#ff4444',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',cursor:'pointer',fontSize:'16px'}}>⏹️</button>
        </div>
      )}

      {audioBlob && !recording && (
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px 16px',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
          <button onClick={cancelAudio} style={{background:'#ff4444',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',cursor:'pointer',fontSize:'16px'}}>🗑️</button>
          <audio ref={previewRef} src={audioBlob} controls style={{flex:1,height:'32px'}} />
          <span style={{color:'#888',fontSize:'12px'}}>{formatTime(recordingTime)}</span>
          <button onClick={sendAudio} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',cursor:'pointer',fontSize:'16px'}}>➤</button>
        </div>
      )}

      {!recording && !audioBlob && (
        <div style={{display:'flex',padding:'8px 12px',gap:'6px',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0,alignItems:'center'}}>
          <button onClick={() => fileInputRef.current?.click()} style={{background:'none',border:'none',color:'#888',fontSize:'22px',cursor:'pointer',flexShrink:0,padding:'4px'}}>📎</button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Écris un message..."
            style={{flex:1,background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'10px 16px',color:'#fff',fontSize:'14px',minWidth:0}}
          />
          <button
            onClick={startRecording}
            style={{background:'none',border:'none',color:'#888',fontSize:'22px',cursor:'pointer',flexShrink:0,padding:'4px'}}>
            🎙️
          </button>
          <button onClick={sendMessage} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',cursor:'pointer',fontSize:'16px',flexShrink:0}}>➤</button>
        </div>
      )}
    </main>
  )
}
