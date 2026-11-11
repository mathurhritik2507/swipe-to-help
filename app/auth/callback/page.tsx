'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const [message, setMessage] = useState('Confirming your account…');
  useEffect(() => {
    let active = true;
    async function finish() {
      try {
        const client = supabase();
        const url = new URL(window.location.href);
        const error = url.searchParams.get('error_description') || url.searchParams.get('error');
        if (error) throw new Error(error);
        const code = url.searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          const fragment = new URLSearchParams(url.hash.slice(1));
          if (fragment.get('error_description')) throw new Error(fragment.get('error_description')!);
          const accessToken = fragment.get('access_token');
          const refreshToken = fragment.get('refresh_token');
          if (accessToken && refreshToken) {
            const { error: sessionError } = await client.auth.setSession({
              access_token: accessToken, refresh_token: refreshToken
            });
            if (sessionError) throw sessionError;
          }
        }
        const { data: { user }, error: userError } = await client.auth.getUser();
        if (userError || !user) throw new Error('The confirmation link is invalid or has expired. Please sign in or request a new link.');
        if (active) window.location.replace('/dashboard');
      } catch (err) {
        if (active) setMessage(err instanceof Error ? err.message : 'Unable to confirm this link.');
      }
    }
    void finish();
    return () => { active = false; };
  }, []);
  return <main className="shell"><header className="top"><Link href="/" className="brand">✳ Swipe to Help</Link></header><section className="auth-panel"><h1>Email confirmation</h1><p role="status">{message}</p><Link href="/auth">Return to sign in</Link></section></main>;
}
