'use client'
import { useRouter } from 'next/navigation'

const bottomNav = [
  { id: 'discussions', icon: '💬', label: 'Discussions', path: '/discussions' },
  { id: 'statuts', icon: '⭕', label: 'Statuts', path: '/statuts' },
  { id: 'appels', icon: '📞', label: 'Appels', path: '/appels' },
  { id: 'publicite', icon: '🎬', label: 'Publicité', path: '/publications' },
  { id: 'contacts', icon: '👥', label: 'Contacts', path: '/contacts' },
  { id: 'reglages', icon: '⚙️', label: 'Réglages', path: '/reglages' },
]

export default function AppelsPage() {
  const router = useRouter()

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
        <button style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'18px',cursor:'pointer'}}>📞</button>
      </div>

      <div style={{display:'flex',background:'#10121a',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
        <button style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom:'2px solid #5b8dff',color:'#5b8dff',fontSize:'13px',cursor:'pointer'}}>Tous</button>
        <button style={{flex:1,padding:'12px',background:'none',border:'none',borderBottom:'2px solid transparent',color:'#888',fontSize:'13px',cursor:'pointer'}}>Manqués</button>
      </div>

      <div style={{flex:1,overflowY:'auto',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',color:'#555'}}>
        <div style={{fontSize:'48px'}}>📞</div>
        <p>Aucun appel pour l'instant</p>
        <p style={{fontSize:'13px'}}>Bientôt disponible 🚧</p>
      </div>

      <div style={{display:'flex',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
        {bottomNav.map(t => (
          <button key={t.id} onClick={() => router.push(t.path)} style={{flex:1,padding:'8px 4px',background:'none',border:'none',color: t.id==='appels' ? '#5b8dff' : '#888',fontSize:'10px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
            <div style={{fontSize:'20px'}}>{t.icon}</div>
            <div>{t.label}</div>
          </button>
        ))}
      </div>
    </main>
  )
}
