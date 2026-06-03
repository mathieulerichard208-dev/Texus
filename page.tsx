'use client'
// app/auth/page.tsx
// Écran de connexion Texus — OTP par SMS

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'
import { useRouter } from 'next/navigation'

type Step = 'phone' | 'otp' | 'profile'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Étape 1 : Envoi du SMS ─────────────────────────────────────────────────
  async function sendOtp() {
    setError('')
    const raw = phone.trim()

    // Validation du numéro (accepte formats internationaux)
    let formatted = raw
    try {
      if (!raw.startsWith('+')) {
        setError('Ajoute le code pays, ex: +229 pour le Bénin')
        return
      }
      if (!isValidPhoneNumber(raw)) {
        setError('Numéro de téléphone invalide')
        return
      }
      formatted = parsePhoneNumber(raw).format('E.164')
    } catch {
      setError('Numéro de téléphone invalide')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    setLoading(false)

    if (error) {
      setError('Erreur envoi SMS. Réessaie dans quelques secondes.')
      return
    }
    setStep('otp')
  }

  // ── Étape 2 : Vérification OTP ────────────────────────────────────────────
  async function verifyOtp() {
    setError('')
    const token = otp.join('')
    if (token.length !== 6) {
      setError('Entre les 6 chiffres du SMS')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token,
      type: 'sms',
    })
    setLoading(false)

    if (error) {
      setError('Code incorrect ou expiré. Réessaie.')
      return
    }

    // Vérifier si le profil existe déjà
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user!.id)
      .single()

    if (profile) {
      router.push('/chat')
    } else {
      setStep('profile')
    }
  }

  // ── Étape 3 : Création du profil ──────────────────────────────────────────
  async function createProfile() {
    setError('')
    if (displayName.trim().length < 2) {
      setError('Entre au moins 2 caractères')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('profiles').insert({
      id: user!.id,
      phone: phone.trim(),
      display_name: displayName.trim(),
      status_text: 'Disponible',
      status_emoji: '👋',
    })

    // Créer abonnement gratuit
    await supabase.from('subscriptions').insert({
      user_id: user!.id,
      plan: 'free',
      status: 'active',
    })

    setLoading(false)
    router.push('/chat')
  }

  // ── Gestion clavier OTP ───────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0d0f14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#10121a',
        border: '1px solid #1a1d2e',
        borderRadius: '20px',
        padding: '40px 32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>
            Tex<span style={{ color: '#5b8dff' }}>us</span>
          </div>
          <div style={{ fontSize: '13px', color: '#4a5070', marginTop: '6px' }}>
            {step === 'phone' && 'Entre ton numéro pour continuer'}
            {step === 'otp' && `Code envoyé au ${phone}`}
            {step === 'profile' && 'Crée ton profil'}
          </div>
        </div>

        {/* ── Étape : numéro ── */}
        {step === 'phone' && (
          <div>
            <label style={{ fontSize: '12px', color: '#4a5070', marginBottom: '8px', display: 'block' }}>
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+229 XX XX XX XX"
              onKeyDown={e => e.key === 'Enter' && sendOtp()}
              style={inputStyle}
            />
            <div style={{ fontSize: '11px', color: '#3a4060', marginTop: '6px' }}>
              Format international requis (+229, +33, +1…)
            </div>
            {error && <div style={errorStyle}>{error}</div>}
            <button onClick={sendOtp} disabled={loading} style={btnStyle}>
              {loading ? 'Envoi...' : 'Recevoir le code SMS'}
            </button>
          </div>
        )}

        {/* ── Étape : OTP ── */}
        {step === 'otp' && (
          <div>
            <label style={{ fontSize: '12px', color: '#4a5070', marginBottom: '12px', display: 'block' }}>
              Code à 6 chiffres
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: '44px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 600,
                    background: '#1a1d2e',
                    border: `1px solid ${digit ? '#5b8dff' : '#222640'}`,
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: "'DM Mono', monospace",
                  }}
                />
              ))}
            </div>
            {error && <div style={errorStyle}>{error}</div>}
            <button onClick={verifyOtp} disabled={loading} style={btnStyle}>
              {loading ? 'Vérification...' : 'Confirmer'}
            </button>
            <button
              onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError('') }}
              style={{ ...ghostBtnStyle, marginTop: '8px' }}
            >
              ← Changer de numéro
            </button>
          </div>
        )}

        {/* ── Étape : profil ── */}
        {step === 'profile' && (
          <div>
            <label style={{ fontSize: '12px', color: '#4a5070', marginBottom: '8px', display: 'block' }}>
              Ton prénom ou pseudo
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Ex: Amina, Roméo..."
              onKeyDown={e => e.key === 'Enter' && createProfile()}
              style={inputStyle}
            />
            {error && <div style={errorStyle}>{error}</div>}
            <button onClick={createProfile} disabled={loading} style={btnStyle}>
              {loading ? 'Création...' : 'Commencer à utiliser Texus'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1d2e',
  border: '1px solid #222640',
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#e8eaf0',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  width: '100%',
  background: '#5b8dff',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '13px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '16px',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'background .15s',
}

const ghostBtnStyle: React.CSSProperties = {
  width: '100%',
  background: 'none',
  color: '#4a5070',
  border: 'none',
  borderRadius: '10px',
  padding: '10px',
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

const errorStyle: React.CSSProperties = {
  background: '#2a1a1a',
  border: '1px solid #5a2020',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  color: '#ff6b6b',
  marginTop: '10px',
}
