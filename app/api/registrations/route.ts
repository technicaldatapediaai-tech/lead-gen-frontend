import { NextResponse } from 'next/server';
import { listRegistrations } from '@/lib/community-store';

export async function GET() {
  try {
    const registrations = await listRegistrations();
    return NextResponse.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}
