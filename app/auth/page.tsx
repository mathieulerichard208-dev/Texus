'use client'
import { useState } from 'react'

export default function AuthPage() {
  const [phone, setPhone] = useState('')
  
  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',border:'1px solid #1a1d2e',borderRadius:'20px',padding:'40px 32px',width:'100%',maxWidth:'380px'}}>
        <div style={{fontSize:'28px',fontWeight:700,color:'#fff',textAlign:'center',marginBottom:'32px'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+229 XX XX XX XX"
          style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px 14px',fontSize:'14px',color:'#e8eaf0',boxSizing:'border-box'}}
        />
        <button style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'16px'}}>
          Recevoir le code SMS
        </button>
      </div>
    </main>
  )
}
