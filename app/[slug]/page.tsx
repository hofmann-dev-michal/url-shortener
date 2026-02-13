console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('tab_zkracovace')
    .select('cilova_url')
    .eq('zkratka', params.slug)
    .single()

  if (data?.cilova_url) {
    redirect(data.cilova_url)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>404 - Nenalezeno</h1>
      <p>Zkratka <strong>{params.slug}</strong> neexistuje.</p>
    </div>
  )
}