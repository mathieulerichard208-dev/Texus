'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([])
  const [text, setText] = useState('')

  function sendMessage() {
    if (text.trim()) {
      setMessages([...messages, text])
      setText('')
    }
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e'}}>
        <div style={{fontSize:'20px',fontWeight:700,color:'#fff'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
      </div>
      <div style={{flex:1,padding:'16px',overflowY:'auto'}}>
        {messages.length === 0 && (
          <p style={{color:'#555',textAlign:'center',marginTop:'40px'}}>Aucun message pour l'instant</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{background:'#5b8dff',color:'#fff',padding:'10px 14px',borderRadius:'14px',marginBottom:'8px',maxWidth:'70%',marginLeft:'auto',fontSize:'14px'}}>
            {msg}
          </div>
        ))}
      </div>
      <div style={{display:'flex',padding:'12px',gap:'8px',background:'#10121a',borderTop:'1px solid #1a1d2e'}}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Écris un message..."
          style={{flex:1,background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'12px 16px',color:'#fff',fontSize:'14px'}}
        />
        <button onClick={sendMessage} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'44px',height:'44px',cursor:'pointer',fontSize:'18px'}}>
          ➤
        </button>
      </div>
    </main>
  )
}
