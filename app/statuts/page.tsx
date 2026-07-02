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
  const [showViewer, setShowViewer] = useState(false)
  const [selectedStatut, setSelectedStatut] = useState<any>(null)
  const [showNew, setShowNew] = useState(false)
  const [newText, setNewText] = useState('')
  const [newType, setNewType] = useState<'image'|'text'>('image')

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
        const newStatut = {
          id: Date.now(),
          username,
          avatar,
          image: reader.result as string,
          text: '',
          type: 'image',
          time: 'A instant',
          vues: 0,
          likes: 0,
          liked: false,
          viewers: [],
        }
        const updated = [newStatut, ...statuts]
        setStatuts(updated)
        localStorage.setItem('texus_statuts', JSON.stringify(updated))
      }
      reader.readAsDataURL(file)
    }
  }

  function addTextStatut() {
    if (!newText.trim()) return
    const newStatut = {
      id: Date.now(),
      username,
      avatar,
      image: null,
      text: newText,
      type: 'text',
      time: 'A instant',
      vues: 0,
      likes: 0,
      liked: false,
      viewers: [],
    }
    const updated = [newStatut, ...statuts]
    setStatuts(updated)
    localStorage.setItem('texus_statuts', JSON.stringify(updated))
    setNewText('')
    setShowNew(false)
  }

  function viewStatut(s: any) {
    const updated = statuts.map(st => st.id === s.id ? {...st, vues: st.vues + 1} : st)
    setStatuts(updated)
    localStorage.setItem('texus_statuts', JSON.stringify(updated))
    setSelectedStatut({...s, vues: s.vues + 1})
    setShowViewer(true)
  }

  function toggleLike(id: number) {
    const updated = statuts.map(s => s.id === id ? {...s, liked: !s.liked, likes: s.liked ? s.likes-1 : s.likes+1} : s)
    setStatuts(updated)
    localStorage.setItem('texus_statuts', JSON.stringify(updated))
    if (selectedStatut?.id === id) {
      setSelectedStatut((prev: any) => ({...prev, liked: !prev.liked, likes: prev.liked ? prev.likes-1 : prev.likes+1}))
    }
  }

  if (showViewer && selectedStatut) {
    return (
      <main style={{height:'100vh',background:'#000',display:'flex',flexDirection:'column',fontFamily:'sans-serif'}}>
        <div style={{padding:'16px',display:'flex',alignItems:'center',gap:'12px',position:'absolute',top:0,left:0,right:0,zIndex:10,background:'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}}>
          <button onClick={() => setShowViewer(false)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer'}}>←</button>
          <div style={{width:'40px',height:'40px',borderRadius:'50%',overflow:'hidden',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {selectedStatut.avatar ? <img src={selectedStatut.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span>👤</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{color:'#fff',fontWeight:600}}>{selectedStatut.username}</div>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:'12px'}}>{selectedStatut.time}</div>
          </div>
        </div>

        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {selectedStatut.image && <img src={selectedStatut.image} alt="" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} />}
          {selectedStatut.type === 'text' && (
            <div style={{padding:'32px',textAlign:'center',color:'#fff',fontSize:'24px',fontWeight:600}}>{selectedStatut.text}</div>
          )}
        </div>

        <div style={{padding:'16px',background:'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',position:'absolute',bottom:0,left:0,right:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',color:'rgba(255,255,255,0.8)',fontSize:'13px'}}>
              <span>👁️</span>
              <span>{selectedStatut.vues} vues</span>
            </div>
            <button onClick={() => toggleLike(selectedStatut.id)} style={{background:'none',border:'none',color:'#fff',fontSize:'24px',cursor:'pointer'}}>
              {selectedStatut.liked ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => { setNewType('text'); setShowNew(true) }} style={{background:'#1a1d2e',border:'none',color:'#fff',borderRadius:'20px',padding:'8px 12px',fontSize:'12px',cursor:'pointer'}}>✏️ Texte</button>
          <button onClick={() => fileInputRef.current?.click()} style={{background:'#5b8dff',border:'none',color:'#fff',borderRadius:'20px',padding:'8px 12px',fontSize:'12px',cursor:'pointer'}}>📷 Photo</button>
        </div>
      </div>

      <div style={{display:'flex',background:'#10121a',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
        <button onClick={() => setTab('statuts')} style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom: tab==='statuts' ? '2px solid #5b8dff' : '2px solid transparent',color: tab==='statuts' ? '#5b8dff' : '#888',fontSize:'13px',cursor:'pointer'}}>Statuts</button>
        <button onClick={() => setTab('chaines')} style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom: tab==='chaines' ? '2px solid #5b8dff' : '2px solid transparent',color: tab==='chaines' ? '#5b8dff' : '#888',fontSize:'13px',cursor:'pointer'}}>Chaines</button>
      </div>

      {showNew && (
        <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Ecris ton statut..."
            style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',minHeight:'80px',boxSizing:'border-box',resize:'none'}}
          />
          <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
            <button onClick={() => setShowNew(false)} style={{flex:1,background:'#1a1d2e',color:'#888',border:'none',borderRadius:'10px',padding:'10px',cursor:'pointer'}}>Annuler</button>
            <button onClick={addTextStatut} style={{flex:1,background:'#5b8dff',color:'#fff',border:'none',borderRadius:'10px',padding:'10px',cursor:'pointer',fontWeight:600}}>Publier</button>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/,video/" onChange={handleFileChange} style={{display:'none'}} />

      <div style={{flex:1,overflowY:'auto'}}>
        {tab === 'statuts' && (
          <div style={{padding:'16px'}}>
            <p style={{color:'#888',fontSize:'12px',marginBottom:'12px'}}>MES STATUTS</p>

            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',cursor:'pointer'}} onClick={() => statuts.length > 0 && viewStatut(statuts[0])}>
              <div style={{position:'relative'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',border: statuts.length > 0 ? '2px solid #5b8dff' : '2px dashed #333'}}>
                  {avatar ? <img src={avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'24px'}}>👤</span>}
                </div>
                {statuts.length === 0 && (
                  <div style={{position:'absolute',bottom:0,right:0,background:'#5b8dff',borderRadius:'50%',width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'14px',fontWeight:'bold'}}>+</div>
                )}
              </div>
              <div style={{flex:1}}>
                <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>Mon statut</div>
                <div style={{color:'#888',fontSize:'12px'}}>{statuts.length > 0 ? statuts.length + ' statut(s)' : 'Appuie pour ajouter'}</div>
              </div>
            </div>

            {statuts.length > 0 && (
              <>
                <p style={{color:'#888',fontSize:'12px',marginBottom:'12px'}}>MES PUBLICATIONS RECENTES</p>
                {statuts.map(s => (
                  <div key={s.id} onClick={() => viewStatut(s)} style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px',cursor:'pointer'}}>
                    <div style={{width:'56px',height:'56px',borderRadius:'50%',overflow:'hidden',border:'2px solid #5b8dff',flexShrink:0}}>
                      {s.image ? <img src={s.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : (
                        <div style={{width:'100%',height:'100%',background:'#5b8dff',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',padding:'4px',textAlign:'center'}}>
                          {s.text.substring(0, 15)}
                        </div>
                      )}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>{s.time}</div>
                      <div style={{color:'#888',fontSize:'12px'}}>👁️ {s.vues} vues · ❤️ {s.likes} likes</div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {statuts.length === 0 && (
              <div style={{textAlign:'center',color:'#555',marginTop:'40px'}}>
                <div style={{fontSize:'48px'}}>⭕</div>
                <p>Aucun statut pour l'instant</p>
                <p style={{fontSize:'13px'}}>Appuie sur Photo ou Texte pour ajouter</p>
              </div>
            )}
          </div>
        )}

        {tab === 'chaines' && (
          <div style={{textAlign:'center',color:'#555',marginTop:'80px'}}>
            <div style={{fontSize:'48px'}}>📡</div>
            <p>Aucune chaine pour l'instant</p>
            <p style={{fontSize:'13px'}}>Bientot disponible</p>
          </div>
        )}
      </div>

      <BottomNav current="statuts" />
    </main>
  )
}
