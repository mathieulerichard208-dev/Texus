'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PublicationsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [text, setText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [username, setUsername] = useState('Utilisateur')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    setUsername(localStorage.getItem('texus_username') || 'Utilisateur')
    setAvatar(localStorage.getItem('texus_avatar') || null)
    const saved = localStorage.getItem('texus_posts')
    if (saved) setPosts(JSON.parse(saved))
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function publish() {
    if (!text.trim() && !image) return
    const newPost = {
      id: Date.now(),
      username,
      avatar,
      text,
      image,
      time: 'À l\'instant',
      likes: 0,
      liked: false,
    }
    const updated = [newPost, ...posts]
    setPosts(updated)
    localStorage.setItem('texus_posts', JSON.stringify(updated))
    setText('')
    setImage(null)
    setShowNew(false)
  }

  function toggleLike(id: number) {
    const updated = posts.map(p => p.id === id ? {...p, liked: !p.liked, likes: p.liked ? p.likes-1 : p.likes+1} : p)
    setPosts(updated)
    localStorage.setItem('texus_posts', JSON.stringify(updated))
  }

  return (
    <main style={{minHeight:'100vh',background:'#0d0f14',fontFamily:'sans-serif'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <button onClick={() => router.push('/discussions')} style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>←</button>
        <div style={{fontSize:'18px',fontWeight:700,color:'#fff'}}>Publications</div>
        <button onClick={() => setShowNew(!showNew)} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer'}}>+</button>
      </div>

      {showNew && (
        <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e'}}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Quoi de neuf ?"
            style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',minHeight:'80px',boxSizing:'border-box',resize:'none'}}
          />
          {image && <img src={image} alt="preview" style={{width:'100%',borderRadius:'10px',marginTop:'8px',maxHeight:'200px',objectFit:'cover'}} />}
          <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
            <button onClick={() => fileInputRef.current?.click()} style={{background:'#1a1d2e',color:'#aaa',border:'1px solid #222640',borderRadius:'8px',padding:'8px 12px',cursor:'pointer',fontSize:'13px'}}>
              📷 Photo
            </button>
            <button onClick={publish} style={{flex:1,background:'#5b8dff',color:'#fff',border:'none',borderRadius:'8px',padding:'8px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>
              Publier
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
        </div>
      )}

      <div style={{padding:'12px'}}>
        {posts.length === 0 && (
          <div style={{textAlign:'center',color:'#555',marginTop:'60px'}}>
            <div style={{fontSize:'48px'}}>📝</div>
            <p>Aucune publication pour l'instant</p>
            <p style={{fontSize:'13px'}}>Appuie sur + pour publier quelque chose !</p>
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} style={{background:'#10121a',borderRadius:'16px',padding:'16px',marginBottom:'12px',border:'1px solid #1a1d2e'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                {post.avatar ? <img src={post.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'18px'}}>👤</span>}
              </div>
              <div>
                <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>{post.username}</div>
                <div style={{color:'#555',fontSize:'12px'}}>{post.time}</div>
              </div>
            </div>
            {post.text && <p style={{color:'#e8eaf0',fontSize:'14px',marginBottom:'10px'}}>{post.text}</p>}
            {post.image && <img src={post.image} alt="" style={{width:'100%',borderRadius:'10px',marginBottom:'10px',maxHeight:'300px',objectFit:'cover'}} />}
            <div style={{display:'flex',gap:'16px',paddingTop:'8px',borderTop:'1px solid #1a1d2e'}}>
              <button onClick={() => toggleLike(post.id)} style={{background:'none',border:'none',color: post.liked ? '#ff6b6b' : '#888',fontSize:'13px',cursor:'pointer'}}>
                {post.liked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button style={{background:'none',border:'none',color:'#888',fontSize:'13px',cursor:'pointer'}}>
                💬 Commenter
              </button>
              <button style={{background:'none',border:'none',color:'#888',fontSize:'13px',cursor:'pointer'}}>
                🔗 Partager
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
