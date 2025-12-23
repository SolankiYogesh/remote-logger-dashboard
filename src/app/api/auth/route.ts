import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageName, password, isNewAccount } = body;

    if (!packageName || !password) {
      return NextResponse.json({ error: 'Package name and password required' }, { status: 400 });
    }

    if (isNewAccount) {
      // Check if exists
      const { data: existing } = await supabase
        .from('packages')
        .select('*')
        .eq('name', packageName)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Package already exists' }, { status: 409 });
      }

      // Create new
      const { error: createError } = await supabase
        .from('packages')
        .insert({ name: packageName, password }); // Use hashing in production!

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
    } else {
      // Login
      const { data: pkg, error } = await supabase
        .from('packages')
        .select('*')
        .eq('name', packageName)
        .single();

      if (error || !pkg || pkg.password !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Success - generate token
    const token = await signToken({ packageName });
    
    return NextResponse.json({ token, packageName });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
