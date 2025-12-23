import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload || !payload.packageName) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const packageName = payload.packageName as string;
    const body = await request.json();
    const { logs } = body;

    if (!Array.isArray(logs)) {
      return NextResponse.json({ error: 'Invalid logs format' }, { status: 400 });
    }

    // Insert logs securely with server-side client
    const { error } = await supabase
      .from('logs')
      .insert(logs.map((log: any) => ({
        ...log,
        package_name: packageName, // Enforce package name from token
        created_at: log.timestamp || new Date().toISOString()
      })));

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to store logs' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
