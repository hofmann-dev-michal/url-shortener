import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  // 1. Získáme tu zkratku z adresy (např. 'google')
  const { slug } = await params;

  // 2. Zeptáme se databáze: "Máš tu někoho s tímhle jménem?"
  const { data, error } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug)
    .single();

  // 3. Pokud ho najdeme, pošleme ho na cílovou URL
  if (data && data.url) {
    redirect(data.url);
  }

  // 4. Pokud ho nenajdeme, ukážeme chybu
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>404 - Odkaz nenalezen</h1>
      <p>Litujeme, ale zkratka <strong>{slug}</strong> v naší databázi neexistuje.</p>
      <a href="/" style={{ color: '#003056' }}>Vytvořit nový odkaz</a>
    </div>
  );
}