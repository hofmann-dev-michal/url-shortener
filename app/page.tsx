'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage('Chyba: ' + error.message)
    else window.location.reload()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Generuji odkaz...')

    const { error } = await supabase
      .from('tab_zkracovace')
      .insert([{ cilova_url: url, zkratka: slug }])

    if (error) {
      setMessage('Chyba: ' + error.message)
    } else {
      setMessage(`✅ Hotovo! click.hofmann-personal.cz/${slug}`)
      setUrl('')
      setSlug('')
    }
  }

  // --- STYLY ---
  const colors = {
    primary: '#004a99', // Hofmann modrá (uprav si podle potřeby)
    secondary: '#f2f2f2',
    text: '#333',
    white: '#ffffff'
  }

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: colors.white, padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
             <h2 style={{ color: colors.primary, margin: 0 }}>HOFMANN</h2>
             <p style={{ color: '#666', fontSize: '14px' }}>Interní zkracovač odkazů</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required 
                   style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
            <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} required 
                   style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Přihlásit se
            </button>
          </form>
          {message && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.secondary, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <nav style={{ backgroundColor: colors.primary, color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, letterSpacing: '1px' }}>HOFMANN</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>{user.email}</span>
          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            Odhlásit
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: colors.white, padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
          <h3 style={{ marginTop: 0, color: colors.primary }}>Vytvořit novou zkratku</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Cílová URL adresa</label>
              <input type="url" placeholder="https://vlozte-dlouhy-odkaz.cz" value={url} onChange={(e) => setUrl(e.target.value)} required 
                     style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Vlastní zkratka</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '6px', paddingLeft: '12px' }}>
                <span style={{ color: '#888', fontSize: '14px' }}>click.h-p.cz/</span>
                <input type="text" placeholder="akce2024" value={slug} onChange={(e) => setSlug(e.target.value)} required 
                       style={{ flex: 1, padding: '12px', border: 'none', background: 'transparent', outline: 'none' }} />
              </div>
            </div>

            <button type="submit" style={{ padding: '15px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
              Vytvořit a uložit
            </button>
          </form>

          {message && (
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '6px', textAlign: 'center', color: '#0050b3', fontWeight: 'bold' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}