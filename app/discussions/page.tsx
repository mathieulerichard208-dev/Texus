'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const fakeChats = [
  { name: 'Bienvenue sur Texus', lastMessage: 'Commence à discuter !', time: 'Maintenant', avatar: '👋' },
]

const tabs = [
  { id: 'discussions', icon: '💬', label: 'Discussions' },
  { id: 'statuts', icon: '⭕', label: 'Statuts' },
  { id: 'appels', icon: '📞', label: 'Appels' },
  { id: 'publications', icon: '🎬', label: 'Publications' },
  { id: 'reglages', icon: '⚙️', label: 'Réglages' },
]

export default function DiscussionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('discussions')

  function handleTab(id: string) {
    if (id === 'reglages') {
      router.push('/reglages')
      return
    }
    if (id === 'publications') {
      router.push('/publications')
      return
    }
    setTab(id)
  }

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        <button onClick={() => router.push('/chat')} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'40px',height:'40px',fontSize:'20px',cursor:'pointer'}}>
          +
        </button>
      </div>

      <div style={{display:'flex',background:'#10121a',borderBottom:'1px solid #1a1d2e',overflowX:'auto',flexShrink:0}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} style={{flex:'0 0 auto',padding:'10px 14px',background:'none',border:'none',borderBottom: tab===t.id ? '2px solid #5b8dff' : '2px solid transparent',color: tab===t.id ? '#5b8dff' : '#888',fontSize:'12px',cursor:'pointer',whiteSpace:'nowrap'}}>
            <div style={{fontSize:'18px'}}>{t.icon}</div>{t.label}
          </button>
        ))}
      </div>

      {tab === 'discussions' && (
        <>
          <div style={{padding:'12px 16px',flexShrink:0}}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'10px 16px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}}
            />
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {fakeChats.map((chat, i) => (
              <div
                key={i}
                onClick={() => router.push('/chat')}
                style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #1a1d2e',cursor:'pointer'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',marginRight:'12px'}}>
                  {chat.avatar}
                </div>
                <div style={{flex:1}}>
                  <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>{chat.name}</div>
                  <div style={{color:'#888',fontSize:'13px'}}>{chat.lastMessage}</div>
                </div>
                <div style={{color:'#555',fontSize:'12px'}}>{chat.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab !== 'discussions' && (
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#555',fontSize:'14px'}}>
          Bientôt disponible 🚧
        </div>
      )}
    </main>
  )
}
