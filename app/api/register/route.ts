import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      fullName, 
      email,
      password,
      linkedin, 
      startupName, 
      startupUrl, 
      stage, 
      industry, 
      lookingFor, 
      betaPerk 
    } = body;

    const registration = await prisma.registration.create({
      data: {
        fullName,
        email,
        password,
        linkedin,
        startupName,
        startupUrl,
        stage,
        industry,
        lookingFor,
        betaPerk
      }
    });

    console.log('Registration saved with Prisma:', registration);
    return NextResponse.json({ message: 'Registration successful', registration }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving registration with Prisma:', err.message);
    return NextResponse.json({ error: 'Failed to save registration' }, { status: 500 });
  }
}
