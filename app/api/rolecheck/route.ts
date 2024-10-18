import { NextRequest, NextResponse } from 'next/server';
import { roleCheck } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
      // Retrieve the token from HTTP-only cookies
      const token = request.cookies.get('token')?.value;
  
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      // Check if the user is an Admin
      const isAdmin = await roleCheck(token);
  
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
  
      // If user is an Admin, return success response
      return NextResponse.json({ success: true, role: 'Admin' });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }