'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
export default function AuthPage(){
 const [mode,setMode]=useState<'login'|'signup'|'reset'>('signup');
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [name,setName]=useState('');
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage('');
 try{
  const client=supabase();
  if(mode==='reset'){const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/auth/update-password'});if(error)throw error;setMessage('Check your inbox for a password reset link.');}
  else if(mode==='signup'){const {error}=await client.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:window.location.origin+'/auth/callback'}});if(error)throw error;setMessage('Account request received. Check your email to confirm your account, if confirmation is enabled.');}
  else {const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;window.location.assign('/dashboard');}
 }catch(err){setMessage(err instanceof Error?err.message:'Something went wrong.');}finally{setBusy(false);}
 }
 return <main className="shell"><header className="top"><Link className="brand" href="/">✳ Swipe to Help</Link><Link href="/">← Home</Link></header><section className="auth-panel"><div className="eyebrow">YOUR COMMUNITY STARTS HERE</div><h1>{mode==='signup'?'Create your account':mode==='login'?'Welcome back':'Reset password'}</h1><p className="muted">Join the community, discover ideas and submit requests for review. Payments and investments are not available.</p><form onSubmit={submit} className="form">{mode==='signup'&&<label>Display name<input required minLength={2} maxLength={80} value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label>{mode!=='reset'&&<label>Password<input type="password" minLength={12} required value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='signup'?'new-password':'current-password'}/></label>}<button disabled={busy}>{busy?'Please wait…':mode==='signup'?'Create account':mode==='login'?'Sign in':'Send reset email'}</button></form>{message&&<p role="status" className="notice">{message}</p>}<div className="auth-links"><button className="text-button" onClick={()=>{setMode(mode==='signup'?'login':'signup');setMessage('')}}>{mode==='signup'?'Already registered? Sign in':'Create an account'}</button><button className="text-button" onClick={()=>{setMode('reset');setMessage('')}}>Forgot password?</button></div></section></main>
}
