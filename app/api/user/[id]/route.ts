// app/api/user/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { updateUser as externalUpdateUser, deleteUser as externalDeleteUser, User } from '@/lib/api';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { username, email, role } = body;

    // Retrieve the token from HTTP-only cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const updatedUser: User = await externalUpdateUser(token, userId, { username, email, role });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`PATCH /api/user/${params.id} Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Retrieve the token from HTTP-only cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await externalDeleteUser(token, userId);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/user/${params.id} Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
