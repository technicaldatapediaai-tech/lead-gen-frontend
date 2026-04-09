import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}
