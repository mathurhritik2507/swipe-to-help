'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '../../lib/supabase';
type Entry={id:string;title:string;status:string;created_at:string;kind:'help'|'startup';description:string};
export default function AdminPage(){
 const [entries,setEntries]=useState<Entry[]>([]);
 const [loading,setLoading]=useState(true),[allowed,setAllowed]=useState(false);
 const [message,setMessage]=useState(''),[busy,setBusy]=useState('');
 async function refresh(){
  const client=supabase();
  const {data:{user}}=await client.auth.getUser();
  if(!user){setAllowed(false);setLoading(false);return;}
  const {data:isAdmin,error:checkError}=await client.rpc('is_swipe_moderator');
  if(checkError||isAdmin!==true){setAllowed(false);setLoading(false);return;}
  setAllowed(true);
  const [a,b]=await Promise.all([
   client.from('help_requests').select('id,title,description,status,created_at').eq('status','pending').order('created_at',{ascending:true}).limit(100),
   client.from('startup_pitches').select('id,name,summary,status,created_at').eq('status','pending').order('created_at',{ascending:true}).limit(100)
  ]);
  if(a.error||b.error)setMessage(a.error?.message||b.error?.message||'Unable to load queue');
  else setEntries([
   ...(a.data||[]).map(x=>({id:x.id,title:x.title,description:x.description,status:x.status,created_at:x.created_at,kind:'help' as const})),
   ...(b.data||[]).map(x=>({id:x.id,title:x.name,description:x.summary,status:x.status,created_at:x.created_at,kind:'startup' as const}))
  ].sort((x,y)=>x.created_at.localeCompare(y.created_at)));
  setLoading(false);
 }
 useEffect(()=>{void refresh()},[]);
 async function review(entry:Entry,status:'approved'|'rejected'){
  if(!window.confirm(`Mark "${entry.title}" as ${status}?`))return;
  setBusy(entry.id);setMessage('');
  try{
   const {data:{user}}=await supabase().auth.getUser();
   const {data:admin}=await supabase().rpc('is_swipe_moderator');
   if(!user||admin!==true)throw new Error('Moderator access required.');
   const table=entry.kind==='help'?'help_requests':'startup_pitches';
   const {data,error}=await supabase().from(table).update({status}).eq('id',entry.id).eq('status','pending').select('id');
   if(error)throw error;
   if(!data?.length)throw new Error('The record was not updated. Refresh the queue.');
   setMessage(`Submission ${status}.`);await refresh();
  }catch(e){setMessage(e instanceof Error?e.message:'Review failed.')}finally{setBusy('')}
 }
 return <main className="shell"><header className="top"><Link className="brand" href="/">✳ Swipe to Help</Link><div className="header-links"><Link href="/dashboard">My dashboard</Link></div></header>
 <section className="hero compact"><div className="eyebrow">TRUST & SAFETY</div><h1>Moderation queue</h1><p className="muted">Only designated moderators can review submissions. Approving makes a submission eligible for public discovery.</p></section>
 {loading?<p>Checking moderator access…</p>:!allowed?<section className="panel"><h2>Access restricted</h2><p className="muted">This page is available only to authorized moderators. No submissions have been loaded.</p></section>:<section className="panel"><h2>Pending submissions ({entries.length})</h2>{message&&<p className="notice" role="status">{message}</p>}{entries.length===0?<p className="muted">No submissions awaiting review.</p>:entries.map(entry=><article className="submission" key={entry.kind+entry.id}><div className="eyebrow">{entry.kind==='help'?'Assistance request':'Startup pitch'}</div><h3>{entry.title}</h3><p className="muted" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{entry.description}</p><p className="muted">{new Date(entry.created_at).toLocaleString()}</p><div className="actions"><button disabled={!!busy} onClick={()=>review(entry,'approved')}>Approve</button><button className="secondary" disabled={!!busy} onClick={()=>review(entry,'rejected')}>Reject</button></div></article>)}</section>}</main>;
}
