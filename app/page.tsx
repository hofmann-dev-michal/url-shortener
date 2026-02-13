'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [slug, setSlug] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    // 1. KONTROLA: Reaguje tlačítko?
    console.log('Tlačítko stisknuto');
    setStatus('Zkouším se spojit s databází...');

    if (!slug || !url) {
      alert('Vyplň obě políčka!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('links')
        .insert([{ slug, url }])
        .select();

      // 2. KONTROLA: Co odpovědělo Supabase?
      if (error) {
        console.error('Chyba ze Supabase:', error);
        setStatus('Chyba: ' + error.message);
        alert('Chyba z databáze: ' + error.message);
      } else {
        console.log('Úspěch:', data);
        setStatus('✅ Uloženo do databáze!');
        alert('Hurá! Uloženo.');
        setSlug('');
        setUrl('');
      }
    } catch (err) {
      console.error('Totální selhání:', err);
      alert('Něco se rozbilo v kódu, koukni do konzole (F12)');
    }
  };

  return (
    <main style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ color: '#003056' }}>Hofmann URL Shortener</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <input 
          type="text" 
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Zkratka (např. google)" 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }} 
        />
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cílová URL (https://...)" 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }} 
        />
        <button 
          onClick={handleSave}
          style={{ padding: '12px', backgroundColor: '#003056', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Uložit do databáze
        </button>
        <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>
      </div>
    </main>
  );
}