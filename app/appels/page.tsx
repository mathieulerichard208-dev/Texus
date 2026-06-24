'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AppelsPage() {
  const router = useRouter()
  const [appels, setAppels] = useState<any[]>([
    { id: 1, name: 'Inconnu', type: 'manqué', time: 'Hier 14:32', icon: '📞' },
    { id: 2, name: 'Inconnu', type: 'reçu', time: 'Hier 10:15', icon: '📞' },
    { id: 3, name: 'Inconnu', type: 'émis', time: 'Avant-hier', icon: '📞' },
  ])

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0}}>
        <button onClick={() => router.push('/discussions')} style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>←</button>
        <div style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Appels</div>
        <button style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer'}}>📞</button>
      </div>

      <div style={{padding:'12px'}}>
        {appels.map(appel => (
          <div key={appel.id} style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #1a1d2e'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',marginRight:'12px'}}>
              👤
            </div>
            <div style={{flex:1}}>
              <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>{appel.name}</div>
              <div style={{color: appel.type==='manqué' ? '#ff4444' : '#888',fontSize:'13px'}}>
                {appel.type==='manqué' ? '↙️ Manqué' : appel.type==='reçu' ? '↙️ Reçu' : '↗️ Émis'} · {appel.time}
              </div>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>📞</button>
              <button style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>📹</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
