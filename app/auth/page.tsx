'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const countries = [
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+225', flag: '🇨🇮', name: 'Cote Ivoire' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
]

export default function AuthPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [country, setCountry] = useState(countries[0])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [otp, setOtp] = useState('')
  const [otpDisplay, setOtpDisplay] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isExisting, setIsExisting] = useState(false)
  const [existingProfile, setExistingProfile] = useState<any>(null)

  async function sendOtp() {
    if (!phone.trim()) { setMessage('Entre ton numero'); return }
    setLoading(true)
    const fullPhone = country.code + phone.replace(/\s/g, '')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      })
      const data = await res.json()
      if (data.success) {
        setOtp(data.otp)
        setOtpDisplay(data.otp)
        setIsExisting(data.isExisting || false)
        setExistingProfile(data.profile || null)
        setStep(2)
        setMessage('')
      } else {
        setMessage('Erreur - reessayez')
      }
    } catch {
      setMessage('Erreur reseau - reessayez')
    }
    setLoading(false)
  }

  async function verifyOtp() {
    if (code !== otp) {
      setMessage('Code incorrect - reessayez')
      return
    }
    
    const fullPhone = country.code + phone.replace(/\s/g, '')
    
    if (isExisting && existingProfile) {
      localStorage.setItem('texus_username', existingProfile.username || 'Utilisateur')
      localStorage.setItem('texus_phone', fullPhone)
      if (existingProfile.avatar) localStorage.setItem('texus_avatar', existingProfile.avatar)
      router.push('/discussions')
    } else {
      setMessage('')
      setStep(3)
    }
  }

  function goToPhoto() {
    if (username.trim().length < 2) {
      setMessage('Choisis un nom valide')
      return
    }
    setMessage('')
    setStep(4)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function finishSignup() {
    const fullPhone = country.code + phone.replace(/\s/g, '')
    try {
      await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, username })
      })
    } catch {}
    localStorage.setItem('texus_username', username)
    if (avatar) localStorage.setItem('texus_avatar', avatar)
    localStorage.setItem('texus_phone', fullPhone)
    router.push('/discussions')
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'20px'}}>
      <div style={{background:'#10121a',border:'1px solid #1a1d2e',borderRadius:'20px',padding:'40px 32px',width:'100%',maxWidth:'380px'}}>
        <div style={{fontSize:'28px',fontWeight:700,color:'#fff',textAlign:'center',marginBottom:'32px'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>

        {step===1 && (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'16px',fontSize:'14px'}}>Entre ton numero pour continuer</p>
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
            {isExisting && existingProfile && (
              <div style={{background:'#1a2e1a',border:'1px solid #2a4a2a',borderRadius:'10px',padding:'12px',marginBottom:'16px',textAlign:'center'}}>
                <div style={{color:'#4caf50',fontSize:'14px',fontWeight:600}}>Compte trouve !</div>
                <div style={{color:'#aaa',fontSize:'13px'}}>Bienvenue {existingProfile.username} 👋</div>
              </div>
            )}
            <div style={{background:'#1a1d2e',border:'2px solid #5b8dff',borderRadius:'12px',padding:'16px',textAlign:'center',marginBottom:'16px'}}>
              <div style={{color:'#888',fontSize:'12px',marginBottom:'8px'}}>Ton code</div>
              <div style={{color:'#5b8dff',fontSize:'32px',fontWeight:700,letterSpacing:'8px'}}>{otpDisplay}</div>
            </div>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Entre le code"
              maxLength={6}
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'18px',color:'#fff',boxSizing:'border-box',textAlign:'center',letterSpacing:'4px'}}
            />
            <button onClick={verifyOtp} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'12px'}}>
              {isExisting ? 'Se connecter' : 'Confirmer'}
            </button>
            <button onClick={() => setStep(1)} style={{width:'100%',background:'none',color:'#888',border:'none',padding:'10px',fontSize:'13px',cursor:'pointer',marginTop:'4px'}}>
              Changer de numero
            </button>
          </>
        )}

        {step===3 && (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'16px'}}>Choisis ton nom</p>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ton nom"
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',fontSize:'14px',color:'#fff',boxSizing:'border-box'}}
            />
            <button onClick={goToPhoto} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginTop:'12px'}}>
              Continuer
            </button>
          </>
        )}

        {step===4 && (
          <>
            <p style={{color:'#aaa',textAlign:'center',marginBottom:'20px'}}>Photo de profil (optionnel)</p>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'20px'}}>
              <div onClick={() => fileInputRef.current?.click()} style={{width:'100px',height:'100px',borderRadius:'50%',background:'#1a1d2e',border:'2px dashed #333',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden'}}>
                {avatar ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'32px',color:'#555'}}>📷</span>}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
            <button onClick={finishSignup} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
              {avatar ? 'Commencer' : 'Ignorer et commencer'}
            </button>
          </>
        )}

        {message && <p style={{color:'red',textAlign:'center',marginTop:'12px',fontSize:'13px'}}>{message}</p>}
      </div>
    </main>
  )
}
