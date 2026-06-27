'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

export default function StatutsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState('statuts')
  const [statuts, setStatuts] = useState<any[]>([])
  const [username, setUsername] = useState('Moi')
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    setUsername(localStorage.getItem('texus_username') || 'Moi')
    setAvatar(localStorage.getItem('texus_avatar') || null)
    const saved = localStorage.getItem('texus_statuts')
    if (saved) setStatuts(JSON.parse(saved))
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const newStatut = { id: Date.now(), username, avatar, image: reader.result as string, time: 'À l\'instant' }
        const updated = [newStatut, ...statuts]
        setStatuts(updated)
        localStorage.setItem('texus_statuts', JSON.stringify(updated))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
        <div style={{width:'36px'}}></div>
      </div>

      <div style={{display:'flex',background:'#10121a',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
        <button onClick={() => setTab('statuts')} style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom: tab==='statuts' ? '2px solid #5b8dff' : '2px solid transparent',color: tab==='statuts' ? '#5b8dff' : '#888',fontSize:'13px',cursor:'pointer'}}>Statuts</button>
        <button onClick={() => setTab('chaines')} style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom: tab==='chaines' ? '2px solid #5b8dff' : '2px solid transparent',color: tab==='chaines' ? '#5b8dff' : '#888',fontSize:'13px',cursor:'pointer'}}>Chaînes</button>
      </div>

      <div style={{flex:1,overflowY:'auto'}}>
        {tab === 'statuts' && (
          <div style={{padding:'16px'}}>
            <p style={{color:'#888',fontSize:'12px',marginBottom:'12px'}}>MON STATUT</p>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
              <div onClick={() => fileInputRef.current?.click()} style={{position:'relative',cursor:'pointer'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',border:'2px solid #5b8dff'}}>
                  {avatar ? <img src={avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'24px'}}>👤</span>}
                </div>
                <div style={{position:'absolute',bottom:0,right:0,background:'#5b8dff',borderRadius:'50%',width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'14px',fontWeight:'bold'}}>+</div>
              </div>
              <div>
                <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>Mon statut</div>
                <div style={{color:'#888',fontSize:'12px'}}>Appuie pour ajouter</div>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
            {statuts.length === 0 && (
              <div style={{textAlign:'center',color:'#555',marginTop:'40px'}}>
                <div style={{fontSize:'48px'}}>⭕</div>
                <p>Aucun statut pour l'instant</p>
              </div>
            )}
            {statuts.map(s => (
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'50%',overflow:'hidden',border:'2px solid #5b8dff'}}>
                  <img src={s.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div>
                  <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>{s.username}</div>
                  <div style={{color:'#888',fontSize:'12px'}}>{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'chaines' && (
          <div style={{textAlign:'center',color:'#555',marginTop:'80px'}}>
            <div style={{fontSize:'48px'}}>📡</div>
            <p>Aucune chaîne pour l'instant</p>
            <p style={{fontSize:'13px'}}>Bientôt disponible 🚧</p>
          </div>
        )}
      </div>

      <BottomNav current="statuts" />
    </main>
  )
}
