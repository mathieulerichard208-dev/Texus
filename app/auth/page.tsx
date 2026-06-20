'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const countries = [
  { code: '+229', flag: '🇧🇯', name: 'Bénin' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
]

export default function AuthPage() {
  const router = useRouter()
  const [country, setCountry] = useState(countries[0])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function sendOtp() {
    setLoading(true)
    const fullPhone = country.code + phone.replace(/\s/g, '')
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: fullPhone })
    })
    const data = await res.json()
    if (data.success) {
      setOtp(data.otp)
      setStep(2)
      setMessage('Code envoyé !')
    } else {
      setMessage('Erreur - réessayez')
    }
    setLoading(false)
  }

  function verifyOtp() {
    if (code === otp) {
      setMessage('')
      setStep(3)
    } else {
      setMessage('Code incorrect - réessayez')
    }
  }

  function finishSignup() {
    if (username.trim().length < 2) {
      setMessage('Choisis un nom valide')
      return
    }
    localStorage.setItem('texus_username', username)
    router.push('/discussions')
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',border:'1px solid #1a1d2e',borderRadius:'20px',padding:'40px 32px',width:'100%',maxWidth:'380px'}}>
        <div style={{fontSize:'28px',fontWeight:700,color:'#fff',textAlign:'center',marginBottom:'32px'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        {step===1 && (
          <>
            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
              <select
                value={country.code}
                onChange={e => setCountry(countries.find(c => c.code === e.target.value) || countries[0])}
                style={{background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px 8px',color:'#fff',fontSize:'14px',cursor:'pointer'}}>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="60 00 00 00"
                style={{flex:1,background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'14px',color:'#fff'}}
              />
            </div>
            <button onClick={sendOtp} disabled={loading} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
              {loading ? 'Envoi...' : 'Recevoir le code SMS'}
            </button>
          </>
        )}
        {step===2 && (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'16px'}}>Entre le code reçu</p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'14px',color:'#fff',boxSizing:'border-box'}}
            />
            <button onClick={verifyOtp} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'12px'}}>
              Confirmer le code
            </button>
          </>
        )}
        {step===3 && (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'16px'}}>Choisis ton nom d'utilisateur</p>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ton nom"
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'14px',color:'#fff',boxSizing:'border-box'}}
            />
            <button onClick={finishSignup} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'12px'}}>
              Commencer
            </button>
          </>
        )}
        {message && <p style={{color:'red',textAlign:'center',marginTop:'12px',fontSize:'13px'}}>{message}</p>}
      </div>
    </main>
  )
}
