import { NextResponse } from 'next/server';
import { listWaitlist, upsertWaitlist } from '@/lib/community-store';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const entry = await upsertWaitlist(email);

    console.log('Waitlist entry saved:', entry);
    return NextResponse.json({ message: 'Successfully joined the waitlist', entry }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving waitlist entry:', err.message);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await listWaitlist();
    return NextResponse.json(entries);
  } catch (err) {
    console.error('Error fetching waitlist:', err);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}
