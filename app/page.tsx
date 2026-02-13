'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Propojení přímo zde - žádné složité importy
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
    setMessage('Pracuji na tom...')

    const { error } = await supabase
      .from('tab_zkracovace') // Tvůj nový název
      .insert([{ 
        cilova_url: url,      // Tvůj nový název
        zkratka: slug         // Tvůj nový název
      }])

    if (error) {
      setMessage('Chyba: ' + error.message)
    } else {
      setMessage(`Hotovo! Odkaz je: click.hofmann-personal.cz/${slug}`)
      setUrl('')
      setSlug('')
    }
  }

  if (!user) {
    return (
      <main style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Hofmann - Přihlášení</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Vstoupit</button>
        </form>
        {message && <p>{message}</p>}
      </main>
    )
  }

  return (
    <main style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Hofmann Zkracovač</h1>
        <button onClick={handleLogout}>Odhlásit se ({user.email})</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: '30px' }}>
        <input type="url" placeholder="Dlouhá URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <input type="text" placeholder="Zkratka" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        <button type="submit">Vytvořit</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  )
}