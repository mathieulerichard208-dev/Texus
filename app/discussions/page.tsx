'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const fakeChats = [
  { name: 'Bienvenue sur Texus', lastMessage: 'Commence à discuter !', time: 'Maintenant', avatar: '👋' },
]

export default function DiscussionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>
          Tex<span style={{color:'#5b8dff'}}>us</span>
        </div>
        <button onClick={() => router.push('/chat')} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'40px',height:'40px',fontSize:'20px',cursor:'pointer'}}>
          +
        </button>
      </div>

      <div style={{padding:'12px 16px'}}>
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

      <div style={{display:'flex',background:'#10121a',borderTop:'1px solid #1a1d2e',padding:'10px 0'}}>
        <div style={{flex:1,textAlign:'center',color:'#5b8dff',fontSize:'12px'}}>
          <div style={{fontSize:'20px'}}>💬</div>Discussions
        </div>
        <div style={{flex:1,textAlign:'center',color:'#555',fontSize:'12px'}}>
          <div style={{fontSize:'20px'}}>⭕</div>Statuts
        </div>
        <div style={{flex:1,textAlign:'center',color:'#555',fontSize:'12px'}}>
          <div style={{fontSize:'20px'}}>📞</div>Appels
        </div>
        <div style={{flex:1,textAlign:'center',color:'#555',fontSize:'12px'}}>
          <div style={{fontSize:'20px'}}>🎬</div>Publications
        </div>
        <div style={{flex:1,textAlign:'center',color:'#555',fontSize:'12px'}}>
          <div style={{fontSize:'20px'}}>⚙️</div>Réglages
        </div>
      </div>
    </main>
  )
}
