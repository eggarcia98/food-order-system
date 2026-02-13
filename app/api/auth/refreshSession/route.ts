import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || 'http://localhost:8080/api/v1/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? null;
    const refreshToken = cookieStore.get('refreshToken')?.value ?? null;

    console.log('Received tokens from cookies:', { accessToken: !!accessToken, refreshToken: !!refreshToken });

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { valid: false, message: 'Missing tokens in cookies' },
        { status: 401 },
      );
    }

    // Forward tokens to auth service for validation/refresh
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${encodeURIComponent(accessToken)}`);
    if (refreshToken) cookieParts.push(`refreshToken=${encodeURIComponent(refreshToken)}`);
    const cookieHeader = cookieParts.join('; ');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    // Forward tokens in the Cookie header to the auth service; do not send tokens in the JSON body.
    const upstreamRes = await fetch(`${AUTH_ENDPOINT}/validate-token`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const text = await upstreamRes.text();
    let upstreamData: any = null;
    try {
      upstreamData = JSON.parse(text);
    } catch {
      upstreamData = text;
    }

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { valid: false, message: 'Token validation failed', details: upstreamData },
        { status: upstreamRes.status },
      );
    }

    // If upstream returned new tokens, set them as cookies
    const newTokens = upstreamData?.data?.tokens ?? upstreamData?.tokens ?? null;
    const payload = upstreamData?.data ?? upstreamData;

    const response = NextResponse.json({ valid: true, ...payload }, { status: upstreamRes.status });

    if (newTokens && typeof newTokens === 'object') {
      if (newTokens.accessToken) {
        response.cookies.set('accessToken', String(newTokens.accessToken), { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 });
      }
      if (newTokens.refreshToken) {
        response.cookies.set('refreshToken', String(newTokens.refreshToken), { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
      }
    }

    return response;
  } catch (error) {
    console.error('Session refresh error:', error);
    const isAbort = (error as any)?.name === 'AbortError';
    return NextResponse.json(
      {
        valid: false,
        message: isAbort ? 'Upstream request timed out' : (error instanceof Error ? error.message : 'Internal server error'),
      },
      { status: 500 },
    );
  }
}
