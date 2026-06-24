'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [username, setUsername] = useState('Moi')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUsername(localStorage.getItem('texus_username') || 'Moi')
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!text.trim() && !image) return
    const now = new Date()
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
    const newMsg = {
      id: Date.now(),
      text,
      image,
      time,
      status: 'sent',
      mine: true,
    }
    setMessages(prev => [...prev, newMsg])
    setText('')
    setImage(null)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'delivered'} : m))
    }, 1000)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? {...m, status: 'read'} : m))
    }, 2500)
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
        <div>
          <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>Discussion</div>
          <div style={{color:'#888',fontSize:'12px'}}>En ligne</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:'12px'}}>
          <button style={{background:'none',border:'none',color:'#888',fontSize:'20px',cursor:'pointer'}}>📞</button>
          <button style={{background:'none',border:'none',color:'#888',fontSize:'20px',cursor:'pointer'}}>📹</button>
        </div>
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
            <div style={{background: msg.mine ? '#5b8dff' : '#1a1d2e',color:'#fff',padding:'10px 14px',borderRadius: msg.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',maxWidth:'70%',fontSize:'14px'}}>
              {msg.image && <img src={msg.image} alt="" style={{width:'100%',borderRadius:'8px',marginBottom:'6px',maxHeight:'200px',objectFit:'cover'}} />}
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
        <div style={{padding:'8px 16px',background:'#10121a',borderTop:'1px solid #1a1d2e'}}>
          <div style={{position:'relative',display:'inline-block'}}>
            <img src={image} alt="preview" style={{height:'60px',borderRadius:'8px',objectFit:'cover'}} />
            <button onClick={() => setImage(null)} style={{position:'absolute',top:'-8px',right:'-8px',background:'#ff4444',border:'none',borderRadius:'50%',width:'20px',height:'20px',color:'#fff',cursor:'pointer',fontSize:'12px'}}>✕</button>
          </div>
        </div>
      )}

      <div style={{display:'flex',padding:'12px',gap:'8px',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
        <button onClick={() => fileInputRef.current?.click()} style={{background:'#1a1d2e',border:'none',borderRadius:'50%',width:'44px',height:'44px',cursor:'pointer',fontSize:'18px'}}>📷</button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Écris un message..."
          style={{flex:1,background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'12px 16px',color:'#fff',fontSize:'14px'}}
        />
        <button onClick={sendMessage} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'44px',height:'44px',cursor:'pointer',fontSize:'18px'}}>➤</button>
      </div>
    </main>
  )
}
