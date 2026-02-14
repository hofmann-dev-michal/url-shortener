'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LogOut, Link as LinkIcon } from "lucide-react"
import Image from "next/image"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

/* ================= LOGIN ================= */

function LoginForm({
  email,
  setEmail,
  password,
  setPassword
}: any) {

  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoginLoading(false)

    if (error) {
      setLoginError('Neplatný e-mail nebo heslo.')
      return
    }

    window.location.reload()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-slate-200">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Hofmann Link
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Interní správa zkratek
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d73a1] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Heslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d73a1] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200
              ${loginLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#0d73a1] hover:bg-[#0a5c80] active:scale-[0.98] shadow-md hover:shadow-lg"}
            `}
          >
            {loginLoading ? "Přihlašuji..." : "Přihlásit se"}
          </button>

        </form>

        {loginError && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {loginError}
          </div>
        )}

      </div>

    </main>
  )
}

/* ================= DASHBOARD ================= */

export default function Home() {

  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [links, setLinks] = useState<any[]>([])
  const [createdLink, setCreatedLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) fetchLinks()
    }
    checkUser()
  }, [])

  const fetchLinks = async () => {
    const { data } = await supabase
      .from('tab_zkracovace')
      .select('*')
      .order('id', { ascending: false })

    if (data) setLinks(data)
  }

  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setSlug(result)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('tab_zkracovace')
      .insert([{
  cilova_url: url,
  zkratka: slug,
  vytvoril: user.email
}])

    if (error) {
      alert('Zkratka už existuje.')
      return
    }

    const finalUrl = `${baseUrl}/${slug}`

    setCreatedLink(finalUrl)
    setCopied(false)
    setUrl('')
    setSlug('')
    fetchLinks()
  }

  const handleDelete = async (id: number) => {
    await supabase.from('tab_zkracovace').delete().eq('id', id)
    fetchLinks()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!user) {
    return (
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    )
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">

  <div className="flex items-center gap-3">
  <Image
    src="/logo.png"
    alt="Hofmann Link"
    width={42}
    height={42}
    priority
  />
  <h1 className="text-xl font-semibold tracking-tight text-slate-800">
    Hofmann Link
  </h1>
</div>

  <div className="flex items-center gap-4">
    <span className="text-sm text-slate-500">
      {user.email}
    </span>
    <button
  onClick={handleLogout}
  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
>
  <LogOut size={16} />
  Odhlásit
</button>
  </div>

</header>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">

        {/* CREATE FORM */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Vytvořit novou zkratku
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="url"
              placeholder="https://dlouhy-odkaz.cz"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d73a1]"
            />

            <div className="flex gap-2">
              <div className="flex flex-1 items-center border border-slate-300 rounded-xl px-4 py-3 text-sm bg-slate-50">
                <span className="text-slate-500 mr-1">{baseUrl}/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <button
                type="button"
                onClick={generateRandomSlug}
                className="px-4 rounded-xl bg-slate-800 text-white text-sm hover:bg-black transition"
              >
                Generovat
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-semibold text-white bg-[#0d73a1] hover:bg-[#0a5c80] active:scale-[0.98] transition-all"
            >
              Vytvořit
            </button>

          </form>

          {createdLink && (
            <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-sm font-medium mb-3">
                {createdLink}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdLink)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition
                    ${copied ? "bg-green-600" : "bg-[#0d73a1] hover:bg-[#0a5c80]"}
                  `}
                >
                  {copied ? "Zkopírováno ✓" : "Kopírovat"}
                </button>

                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-black transition"
                >
                  Otevřít
                </a>
              </div>
            </div>
          )}
        </div>

        {/* HISTORY */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Historie zkratek
          </h2>

          <div className="divide-y divide-slate-200">
            {links.map((item) => (
  <div key={item.id} className="py-4 flex justify-between items-start">
    <div>
      <div className="font-medium text-slate-800">
        {baseUrl}/{item.zkratka}
      </div>

      <div className="text-sm text-slate-500">
        {item.cilova_url}
      </div>

      <div className="text-xs text-slate-400 mt-2 space-y-1">
        <div>
          Kliků: {item.pocet_kliku || 0}
        </div>

        {item.posledni_klik && (
          <div>
            Poslední klik: {new Date(item.posledni_klik).toLocaleString()}
          </div>
        )}

        <div>
          Vytvořil: {item.vytvoril}
        </div>
      </div>
    </div>

    <button
      onClick={() => handleDelete(item.id)}
      className="text-sm text-red-500 hover:text-red-700 transition"
    >
      Smazat
    </button>
  </div>
))}

          </div>

        </div>

      </div>

    </main>
  )
}
