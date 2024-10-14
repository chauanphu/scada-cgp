// app/api/cluster.ts

import { getClusters, getFullClusters, createCluster, CreateClusterData } from '@/lib/api';
import { NextResponse } from 'next/server';

// GET method handler
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const full = url.searchParams.get('full');
    const token = request.headers.get('cookie')?.split('token=')[1] || '';

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let clusters;
    if (full) {
      clusters = await getFullClusters(token);
    } else {
      clusters = await getClusters(token);
    }

    return NextResponse.json(clusters, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST method handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, units, assignedUsers} = body;
    const token = request.headers.get('cookie')?.split('token=')[1] || '';

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const account_id = assignedUsers[0];
    const newCluster: CreateClusterData = { name, units, account_id };

    await createCluster(token, newCluster);
    return NextResponse.json(newCluster, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}