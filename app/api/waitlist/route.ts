import { NextResponse } from 'next/server';
import { listNewsletter, upsertNewsletter } from '@/lib/community-store';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const entry = await upsertNewsletter(email);

    console.log('Newsletter entry saved:', entry);
    return NextResponse.json({ message: 'Successfully joined the newsletter', entry }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving newsletter entry:', err.message);
    return NextResponse.json({ error: 'Failed to join newsletter' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await listNewsletter();
    return NextResponse.json(entries);
  } catch (err) {
    console.error('Error fetching newsletter entries:', err);
    return NextResponse.json({ error: 'Failed to fetch newsletter entries' }, { status: 500 });
  }
}
