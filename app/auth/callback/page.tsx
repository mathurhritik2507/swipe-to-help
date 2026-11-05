'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '../../../lib/supabase';
export default function Callback(){const [message,setMessage]=useState('Confirming your email…');useEffect(()=>{const run=async()=>{try{const params=new URLSearchParams(window.location.search);const code=params.get('code');if(code){const {error}=await supabase().auth.exchangeCodeForSession(code);if(error)throw error;}const {data}=await supabase().auth.getUser();if(data.user){window.location.replace('/dashboard');return;}setMessage('Unable to confirm this link. Please try signing in.');}catch(err){setMessage(err instanceof Error?err.message:'Confirmation failed.')}};void run()},[]);return <main className="shell"><h1>{message}</h1><Link href="/auth">Go to sign in</Link></main>}
