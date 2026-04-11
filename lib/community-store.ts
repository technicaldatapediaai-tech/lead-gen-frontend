import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface RegistrationRecord {
  id: string;
  fullName?: string;
  email: string;
  password?: string;
  linkedin?: string;
  startupName?: string;
  startupUrl?: string;
  stage?: string;
  industry?: string;
  lookingFor?: string[];
  betaPerk?: string;
  timestamp: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: string;
}

interface CommunityStore {
  registrations: RegistrationRecord[];
  waitlist: WaitlistEntry[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "community.json");

async function ensureStoreFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    const initial: CommunityStore = { registrations: [], waitlist: [] };
    await writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<CommunityStore> {
  await ensureStoreFile();
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      waitlist: Array.isArray(parsed.waitlist) ? parsed.waitlist : []
    };
  } catch {
    return { registrations: [], waitlist: [] };
  }
}

async function writeStore(store: CommunityStore) {
  await ensureStoreFile();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function addRegistration(
  payload: Omit<RegistrationRecord, "id" | "timestamp">
): Promise<RegistrationRecord> {
  const store = await readStore();
  const record: RegistrationRecord = {
    id: crypto.randomUUID(),
    ...payload,
    timestamp: new Date().toISOString()
  };

  store.registrations.unshift(record);
  await writeStore(store);
  return record;
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const store = await readStore();
  return [...store.registrations].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function upsertWaitlist(email: string): Promise<WaitlistEntry> {
  const normalizedEmail = email.trim().toLowerCase();
  const store = await readStore();
  const existing = store.waitlist.find(entry => entry.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return existing;
  }

  const entry: WaitlistEntry = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    timestamp: new Date().toISOString()
  };

  store.waitlist.unshift(entry);
  await writeStore(store);
  return entry;
}

export async function listWaitlist(): Promise<WaitlistEntry[]> {
  const store = await readStore();
  return [...store.waitlist].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
