'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const bottomNav = [
  { id: 'discussions', icon: '💬', label: 'Discussions', path: '/discussions' },
  { id: 'statuts', icon: '⭕', label: 'Statuts', path: '/statuts' },
  { id: 'appels', icon: '📞', label: 'Appels', path: '/appels' },
  { id: 'publicite', icon: '🎬', label: 'Publicité', path: '/publications' },
  { id: 'contacts', icon: '👥', label: 'Contacts', path: '/contacts' },
  { id: 'reglages', icon: '⚙️', label: 'Réglages', path: '/reglages' },
]

export default function BottomNav({ current }: { current: string }) {
  const router = useRouter()
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const currentIndex = bottomNav.findIndex(t => t.id === current)

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX
    }
    function handleTouchEnd(e: TouchEvent) {
      touchEndX.current = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX.current
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < bottomNav.length - 1) {
          router.push(bottomNav[currentIndex + 1].path)
        } else if (diff < 0 && currentIndex > 0) {
          router.push(bottomNav[currentIndex - 1].path)
        }
      }
    }
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentIndex, router])

  return (
    <div style={{display:'flex',background:'#10121a',borderTop:'1px solid #1a1d2e',flexShrink:0}}>
      {bottomNav.map(t => (
        <button key={t.id} onClick={() => router.push(t.path)} style={{flex:1,padding:'8px 4px',background:'none',border:'none',color: t.id===current ? '#5b8dff' : '#888',fontSize:'10px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
          <div style={{fontSize:'20px'}}>{t.icon}</div>
          <div>{t.label}</div>
        </button>
      ))}
    </div>
  )
}
