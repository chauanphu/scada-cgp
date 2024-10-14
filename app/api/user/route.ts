// app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser as externalCreateUser, User } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Retrieve the token from HTTP-only cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users: User[] = await getUsers(token);
    return NextResponse.json(users);
  } catch (error: any) {
    // If 401, return unauthorized
    if (error.message === 'Failed to fetch users') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, role, password } = body;

    // Basic validation
    if (!username || !email || !role || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Retrieve the token from HTTP-only cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newUser = await externalCreateUser(token, { username, email, role, password });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/user Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
