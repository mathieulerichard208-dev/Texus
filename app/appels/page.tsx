'use client'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

export default function AppelsPage() {
  const router = useRouter()

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
        <button style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'18px',cursor:'pointer'}}>📞</button>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',color:'#555'}}>
        <div style={{fontSize:'48px'}}>📞</div>
        <p>Aucun appel pour l'instant</p>
      </div>
      <BottomNav current="appels" />
    </main>
  )
}
