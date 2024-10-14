// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { getToken } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const token = await getToken(username, password);

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 24 // 1 hour
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}