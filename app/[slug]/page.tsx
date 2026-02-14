import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export default async function SlugPage(props: { params: Promise<{ slug: string }> }) {

  const { slug } = await props.params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('tab_zkracovace')
    .select('*')
    .eq('zkratka', slug)
    .single()

  if (!data) {
    return <div style={{ padding: 40 }}>Odkaz nenalezen</div>
  }

  await supabase
    .from('tab_zkracovace')
    .update({
      pocet_kliku: (data.pocet_kliku || 0) + 1,
      posledni_klik: new Date().toISOString()
    })
    .eq('id', data.id)

  redirect(data.cilova_url)
}
