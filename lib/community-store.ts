import prisma from "./prisma";

export interface RegistrationRecord {
  id: number;
  fullName: string;
  email: string;
  password?: string | null;
  linkedin?: string | null;
  startupName?: string | null;
  startupUrl?: string | null;
  stage?: string | null;
  industry?: string | null;
  lookingFor: string[];
  betaPerk?: string | null;
  timestamp: Date;
}

export interface WaitlistEntry {
  id: number;
  email: string;
  timestamp: Date;
}

export async function addRegistration(
  payload: Omit<RegistrationRecord, "id" | "timestamp">
): Promise<RegistrationRecord> {
  const registration = await prisma.registration.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      linkedin: payload.linkedin,
      startupName: payload.startupName,
      startupUrl: payload.startupUrl,
      stage: payload.stage,
      industry: payload.industry,
      lookingFor: payload.lookingFor,
      betaPerk: payload.betaPerk,
    },
  });

  return registration as RegistrationRecord;
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const registrations = await prisma.registration.findMany({
    orderBy: {
      timestamp: 'desc',
    },
  });
  return registrations as RegistrationRecord[];
}

export async function upsertWaitlist(email: string): Promise<WaitlistEntry> {
  const normalizedEmail = email.trim().toLowerCase();
  
  const entry = await prisma.waitlist.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: { email: normalizedEmail },
  });

  return entry as WaitlistEntry;
}

export async function listWaitlist(): Promise<WaitlistEntry[]> {
  const waitlist = await prisma.waitlist.findMany({
    orderBy: {
      timestamp: 'desc',
    },
  });
  return waitlist as WaitlistEntry[];
}
