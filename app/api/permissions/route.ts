import { NextResponse } from 'next/server';
import { getPermissions } from '@/lib/api';
import Cookies from 'js-cookie';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const permissions = await getPermissions(token);
    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
