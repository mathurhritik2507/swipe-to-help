'use client';
import { useState } from 'react';
type Story={title:string;country:string;category:string;description:string;amount:string};
const help:Story[]=[
{title:'Help a student stay in school',country:'Kenya',category:'Education',description:'Illustrative request: school supplies and transport for a semester.',amount:'$180'},
{title:'Support a community food pantry',country:'United States',category:'Community',description:'Illustrative request: staple groceries for families.',amount:'$450'},
{title:'Help with emergency travel',country:'India',category:'Essential needs',description:'Illustrative request: urgent transport assistance.',amount:'$120'}
];
const ideas:Story[]=[
{title:'Solar-powered cold storage',country:'India',category:'Climate tech',description:'Illustrative startup: affordable modular cold storage for small farmers.',amount:'Concept'},
{title:'Accessible language tutoring',country:'United States',category:'EdTech',description:'Illustrative startup: adaptive lessons for underserved learners.',amount:'Concept'},
{title:'Community water monitoring',country:'Kenya',category:'Civic tech',description:'Illustrative startup: low-cost water quality alerts.',amount:'Concept'}
];
export default function Home(){
 const [lane,setLane]=useState<'help'|'ideas'>('help'); const [index,setIndex]=useState(0); const [saved,setSaved]=useState<string[]>([]);
 const data=lane==='help'?help:ideas; const item=data[index%data.length];
 const next=()=>setIndex(v=>v+1);
 const save=()=>{setSaved(v=>v.includes(item.title)?v:[...v,item.title]);next()};
 return <main className="shell">
 <header className="top"><span className="brand">✳ Swipe to Help</span><span className="tag">Early-access preview · No live transactions</span></header>
 <section className="hero"><h1>One swipe can start something good.</h1><p className="muted">Explore assistance stories and discover startup ideas in one global community. This preview uses fictional examples; real submissions and financial services are not enabled here.</p></section>
 <nav className="tabs" aria-label="Discovery lane"><button className={lane==='help'?'active':''} onClick={()=>{setLane('help');setIndex(0)}}>Help someone</button><button className={lane==='ideas'?'active':''} onClick={()=>{setLane('ideas');setIndex(0)}}>Discover startups</button></nav>
 <article className="card"><div className="eyebrow">{item.category} · {item.country}</div><h2>{item.title}</h2><p className="muted">{item.description}</p><p><strong>{lane==='help'?'Illustrative need: ':'Stage: '}{item.amount}</strong></p><div className="actions"><button className="secondary" onClick={next}>Pass →</button><button onClick={save}>♡ Save interest</button></div></article>
 <p className="muted">Saved in this session: {saved.length ? saved.join(' · ') : 'None yet'}</p>
 <aside className="notice"><strong>Important:</strong> This is a public concept preview. There are no real user accounts, verified cases, donations, securities offerings, or investment transactions on this deployment. Do not submit personal or financial information.</aside>
 <footer className="foot">© Swipe to Help · Preview build · <a href="https://github.com/mathurhritik2507/swipe-to-help">Source repository</a></footer>
 </main>
}
