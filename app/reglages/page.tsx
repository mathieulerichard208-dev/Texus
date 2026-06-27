'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

export default function ReglagesPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    setUsername(localStorage.getItem('texus_username') || 'Utilisateur')
    setPhone(localStorage.getItem('texus_phone') || '')
    setAvatar(localStorage.getItem('texus_avatar') || null)
  }, [])

  function saveName() {
    if (newName.trim().length > 1) {
      localStorage.setItem('texus_username', newName)
      setUsername(newName)
      setEditName(false)
    }
  }

  function handlePhotoClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setAvatar(result)
        localStorage.setItem('texus_avatar', result)
      }
      reader.readAsDataURL(file)
    }
  }

  function logout() {
    localStorage.clear()
    router.push('/auth')
  }

  function deleteAccount() {
    if (confirm('Supprimer ton compte ? Cette action est irréversible !')) {
      localStorage.clear()
      router.push('/auth')
    }
  }

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'24px 16px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'32px'}}>
          <div onClick={handlePhotoClick} style={{width:'90px',height:'90px',borderRadius:'50%',background:'#1a1d2e',border:'2px dashed #333',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',marginBottom:'12px'}}>
            {avatar ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'32px'}}>👤</span>}
          </div>
          <button onClick={handlePhotoClick} style={{background:'none',border:'none',color:'#5b8dff',fontSize:'13px',cursor:'pointer'}}>Changer la photo</button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
        </div>

        <div style={{background:'#10121a',borderRadius:'12px',padding:'16px',marginBottom:'12px',border:'1px solid #1a1d2e'}}>
          <div style={{color:'#888',fontSize:'12px',marginBottom:'4px'}}>Nom d'utilisateur</div>
          {editName ? (
            <div style={{display:'flex',gap:'8px'}}>
              <input value={newName} onChange={e => setNewName(e.target.value)} style={{flex:1,background:'#1a1d2e',border:'1px solid #222640',borderRadius:'8px',padding:'8px',color:'#fff',fontSize:'14px'}} />
              <button onClick={saveName} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 12px',cursor:'pointer'}}>✓</button>
            </div>
          ) : (
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'#fff',fontSize:'15px'}}>{username}</div>
              <button onClick={() => { setNewName(username); setEditName(true) }} style={{background:'none',border:'none',color:'#5b8dff',fontSize:'13px',cursor:'pointer'}}>Modifier</button>
            </div>
          )}
        </div>

        <div style={{background:'#10121a',borderRadius:'12px',padding:'16px',marginBottom:'24px',border:'1px solid #1a1d2e'}}>
          <div style={{color:'#888',fontSize:'12px',marginBottom:'4px'}}>Numéro de téléphone</div>
          <div style={{color:'#fff',fontSize:'15px'}}>{phone || 'Non défini'}</div>
        </div>

        <button onClick={logout} style={{width:'100%',background:'#1a1d2e',color:'#ff6b6b',border:'1px solid #2a1d1d',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:600,cursor:'pointer',marginBottom:'12px'}}>
          🚪 Se déconnecter
        </button>

        <button onClick={deleteAccount} style={{width:'100%',background:'#1a1d2e',color:'#ff4444',border:'1px solid #2a1d1d',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
          🗑️ Supprimer mon compte
        </button>
      </div>

      <BottomNav current="reglages" />
    </main>
  )
}
