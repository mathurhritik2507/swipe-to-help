import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ app: 'ok', auth: 'not_configured' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const endpoint = new URL('/auth/v1/health', url);
    if (endpoint.protocol !== 'https:') throw new Error('Invalid upstream protocol');
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { apikey: key },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json(
      { app: 'ok', auth: response.ok ? 'reachable' : 'upstream_error', upstreamStatus: response.status },
      { status: response.ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { app: 'ok', auth: 'unreachable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
