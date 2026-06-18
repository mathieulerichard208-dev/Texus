'use client'
import { useState } from 'react'

export default function AuthPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')

  async function sendOtp() {
    setLoading(true)
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    const data = await res.json()
    if (data.success) setStep(2)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#10121a',border:'1px solid #1a1d2e',borderRadius:'20px',padding:'40px',width:'340px'}}>
        <h1 style={{color:'#fff',textAlign:'center'}}>Tex<span style={{color:'#5b8dff'}}>us</span></h1>
        {step===1 ? (
          <>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+229 60000000" style={{width:'100%',background:'#1a1d2e',border:'none',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}} />
            <button onClick={sendOtp} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',marginTop:'12px',cursor:'pointer',fontSize:'14px'}}>
              {loading ? 'Envoi...' : 'Recevoir le code SMS'}
            </button>
          </>
        ) : (
          <>
            <p style={{color:'#fff',textAlign:'center'}}>Code envoyé ! Entre-le ici</p>
            <input type="text" value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" style={{width:'100%',background:'#1a1d2e',border:'none',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}} />
            <button style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',marginTop:'12px',cursor:'pointer',fontSize:'14px'}}>Confirmer</button>
          </>
        )}
      </div>
    </main>
  )
}
