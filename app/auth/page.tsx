'use client'
import { useState } from 'react'

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
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: '+243', flag: '🇨🇩', name: 'RD Congo' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+20', flag: '🇪🇬', name: 'Egypte' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+27', flag: '🇿🇦', name: 'Afrique du Sud' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopie' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzanie' },
  { code: '+256', flag: '🇺🇬', name: 'Ouganda' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne' },
]

export default function AuthPage() {
  const [country, setCountry] = useState(countries[0])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
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
      setStep(2)
      setMessage('Code envoyé sur ' + fullPhone)
    } else {
      setMessage('Erreur: ' + (data.error || 'Réessayez'))
    }
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',border:'1px solid #1a1d2e',borderRadius:'20px',padding:'40px 32px',width:'100%',maxWidth:'380px'}}>
        <div style={{fontSize:'28px',fontWeight:700,color:'#fff',textAlign:'center',marginBottom:'32px'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        {step===1 ? (
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
        ) : (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'16px'}}>{message}</p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'14px',color:'#fff',boxSizing:'border-box'}}
            />
            <button style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'12px'}}>
              Confirmer le code
            </button>
          </>
        )}
        {message && step===1 && <p style={{color:'red',textAlign:'center',marginTop:'12px',fontSize:'13px'}}>{message}</p>}
      </div>
    </main>
  )
}
