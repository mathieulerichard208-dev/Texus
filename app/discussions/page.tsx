'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

const subTabs = ['Toutes', 'Non lues', 'Favoris', 'Groupes']

const fakeChats = [
  { id: 1, name: 'Bienvenue sur Texus', lastMessage: 'Commence à discuter !', time: 'Maintenant', avatar: '👋', unread: 1, favorite: false, group: false },
]

export default function DiscussionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [subTab, setSubTab] = useState('Toutes')

  const filtered = fakeChats.filter(c => {
    if (subTab === 'Non lues') return c.unread > 0
    if (subTab === 'Favoris') return c.favorite
    if (subTab === 'Groupes') return c.group
    return true
  }).filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        <button onClick={() => router.push('/chat')} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'40px',height:'40px',fontSize:'20px',cursor:'pointer'}}>+</button>
      </div>

      <div style={{display:'flex',background:'#10121a',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
        {subTabs.map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{flex:1,padding:'10px 4px',background:'none',border:'none',borderBottom: subTab===t ? '2px solid #5b8dff' : '2px solid transparent',color: subTab===t ? '#5b8dff' : '#888',fontSize:'12px',cursor:'pointer'}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{padding:'12px 16px',flexShrink:0}}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'10px 16px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}} />
      </div>

      <div style={{flex:1,overflowY:'auto'}}>
        {filtered.length === 0 && (
          <div style={{textAlign:'center',color:'#555',marginTop:'60px'}}>
            <div style={{fontSize:'48px'}}>💬</div>
            <p>Aucune discussion ici</p>
          </div>
        )}
        {filtered.map(chat => (
          <div key={chat.id} onClick={() => router.push('/chat')} style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #1a1d2e',cursor:'pointer'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',marginRight:'12px'}}>
              {chat.avatar}
            </div>
            <div style={{flex:1}}>
              <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>{chat.name}</div>
              <div style={{color:'#888',fontSize:'13px'}}>{chat.lastMessage}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
              <div style={{color:'#555',fontSize:'12px'}}>{chat.time}</div>
              {chat.unread > 0 && <div style={{background:'#5b8dff',color:'#fff',borderRadius:'50%',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px'}}>{chat.unread}</div>}
            </div>
          </div>
        ))}
      </div>

      <BottomNav current="discussions" />
    </main>
  )
}
