import { NextRequest,NextResponse } from 'next/server';
import {createClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const system='You are Swipe to Help Guide, a helpful product onboarding assistant. Explain how to explore assistance stories, startup ideas, create an account, submit requests for moderation, and report safety concerns. Current platform is an early-access preview; no verified assistance, real payments, or investment offerings. Never imply donations or investing are enabled. Never request sensitive personal, medical, banking or identification data. Keep responses concise. For financial, legal or medical questions, give general information only and recommend a qualified professional.';
export async function POST(request:NextRequest){
 try{
  const {message}=await request.json();
  if(typeof message!=='string'||!message.trim()||message.length>700)return NextResponse.json({error:'Enter a question under 700 characters.'},{status:400});
  const token=request.headers.get('authorization')?.replace(/^Bearer /i,'');
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!token||!url||!publicKey)return NextResponse.json({error:'Sign in to use the AI guide.'},{status:401});
  const {data:{user},error:authError}=await createClient(url,publicKey).auth.getUser(token);
  if(authError||!user)return NextResponse.json({error:'Your session expired. Sign in again.'},{status:401});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({error:'AI assistant is not configured yet. Contact the site administrator.'},{status:503});
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:system},{role:'user',content:message}],max_tokens:250,temperature:0.3}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)return NextResponse.json({error:'Assistant is temporarily unavailable.'},{status:502});
  const json=await response.json();const answer=json.choices?.[0]?.message?.content;
  if(typeof answer!=='string')return NextResponse.json({error:'Assistant returned no response.'},{status:502});
  return NextResponse.json({answer});
 }catch{return NextResponse.json({error:'Could not process this request.'},{status:500});}
}
