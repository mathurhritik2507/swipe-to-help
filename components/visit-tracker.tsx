'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {supabase} from '../lib/supabase';
const tracked=new Set(['/','/auth','/dashboard','/privacy','/terms','/report']);
export default function VisitTracker(){
 const path=usePathname();
 useEffect(()=>{
  if(!tracked.has(path))return;
  try{
   const key='swipe_session_key';
   let id=sessionStorage.getItem(key);
   if(!id){id=crypto.randomUUID();sessionStorage.setItem(key,id)}
   // One event per page per UTC day. No email, IP, device fingerprint or personal details sent.
   const day=new Date().toISOString().slice(0,10);
   const once='swipe_view_'+day+'_'+path;
   if(sessionStorage.getItem(once))return;
   sessionStorage.setItem(once,'1');
   void supabase().from('site_page_views').insert({session_key:id,page_path:path,visit_day:day}).then(({error})=>{if(error)sessionStorage.removeItem(once)});
  }catch{/* Storage can be disabled; tracking is optional. */}
 },[path]);
 return null;
}
