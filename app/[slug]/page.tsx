export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function RedirectPage(props: any) {
  const params = await props.params
  const slug = params?.slug

  console.log("SLUG:", slug)

  if (!slug) {
    return <h1>Slug není předán</h1>
  }

  const { data, error } = await supabase
    .from('tab_zkracovace')
    .select('cilova_url')
    .eq('zkratka', slug)
    .single()

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (data?.cilova_url) {
    redirect(data.cilova_url)
  }

  return <h1>404 – Nenalezeno</h1>
}
