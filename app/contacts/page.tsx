'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('texus_contacts')
    if (saved) setContacts(JSON.parse(saved))
  }, [])

  function addContact() {
    if (!newName.trim() || !newPhone.trim()) return
    const contact = { id: Date.now(), name: newName, phone: newPhone }
    const updated = [...contacts, contact]
    setContacts(updated)
    localStorage.setItem('texus_contacts', JSON.stringify(updated))
    setNewName('')
    setNewPhone('')
    setShowAdd(false)
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  return (
    <main style={{height:'100vh',background:'#0d0f14',display:'flex',flexDirection:'column',fontFamily:'sans-serif',overflow:'hidden'}}>
      <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontSize:'22px',fontWeight:700,color:'#fff'}}>Tex<span style={{color:'#5b8dff'}}>us</span></div>
        <button onClick={() => setShowAdd(!showAdd)} style={{background:'#5b8dff',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer'}}>+</button>
      </div>

      {showAdd && (
        <div style={{background:'#10121a',padding:'16px',borderBottom:'1px solid #1a1d2e',flexShrink:0}}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nom" style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box',marginBottom:'8px'}} />
          <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+229 60 00 00 00" style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'14px',boxSizing:'border-box',marginBottom:'8px'}} />
          <button onClick={addContact} style={{width:'100%',background:'#5b8dff',color:'#fff',border:'none',borderRadius:'10px',padding:'12px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>Ajouter</button>
        </div>
      )}

      <div style={{padding:'12px 16px',flexShrink:0}}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{width:'100%',background:'#1a1d2e',border:'1px solid #222640',borderRadius:'20px',padding:'10px 16px',color:'#fff',fontSize:'14px',boxSizing:'border-box'}} />
      </div>

      <div style={{flex:1,overflowY:'auto'}}>
        {filtered.length === 0 && (
          <div style={{textAlign:'center',color:'#555',marginTop:'60px'}}>
            <div style={{fontSize:'48px'}}>👥</div>
            <p>Aucun contact pour l'instant</p>
          </div>
        )}
        {filtered.map(contact => (
          <div key={contact.id} onClick={() => router.push('/chat')} style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid #1a1d2e',cursor:'pointer'}}>
            <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#1a1d2e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',marginRight:'12px'}}>👤</div>
            <div style={{flex:1}}>
              <div style={{color:'#fff',fontSize:'15px',fontWeight:600}}>{contact.name}</div>
              <div style={{color:'#888',fontSize:'13px'}}>{contact.phone}</div>
            </div>
            <button style={{background:'none',border:'none',color:'#5b8dff',fontSize:'20px',cursor:'pointer'}}>💬</button>
          </div>
        ))}
      </div>

      <BottomNav current="contacts" />
    </main>
  )
}
