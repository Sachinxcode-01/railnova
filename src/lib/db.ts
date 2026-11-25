import fs from 'fs/promises';
import path from 'path';
import {
  AuditLog,
  BookingRecord,
  CancellationRequest,
  Station,
  Train,
  UserProfile,
} from './types';
import { STATIONS, TRAINS } from './railway-data';
import { hashPassword } from './auth';

export interface RailNovaDatabase {
  users: UserProfile[];
  stations: Station[];
  trains: Train[];
  bookings: BookingRecord[];
  cancellations: CancellationRequest[];
  auditLogs: AuditLog[];
}

const SEED_DB_PATH = path.join(process.cwd(), 'data', 'railnova-db.json');
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'railnova-data')
  : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'railnova-db.json');

let memoryCache: RailNovaDatabase | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function buildSeedDatabase(): RailNovaDatabase {
  const now = new Date().toISOString();
  const demoTravelerId = 'usr_demo_traveler';
  const demoAdminId = 'usr_demo_admin';

  const users: UserProfile[] = [
    {
      id: demoTravelerId,
      name: 'Aarav Menon',
      email: 'traveler@railnova.demo',
      phone: '+91 90000 00001',
      passwordHash: hashPassword('Travel@RailNova2026'),
      role: 'user',
      provider: 'credentials',
      savedPassengers: [
        {
          id: 'pax_saved_1',
          fullName: 'Aarav Menon',
          age: 29,
          gender: 'Male',
          berthPreference: 'LOWER',
          concession: 'NONE',
        },
        {
          id: 'pax_saved_2',
          fullName: 'Meera Menon',
          age: 27,
          gender: 'Female',
          berthPreference: 'SIDE_LOWER',
          concession: 'NONE',
        },
      ],
      favouriteRoutes: [
        { fromCode: 'SBC', toCode: 'MAO' },
        { fromCode: 'SBC', toCode: 'MYS' },
      ],
      favouriteDestinations: ['goa', 'mysuru', 'ooty'],
      recentSearches: [
        { fromCode: 'SBC', toCode: 'MAO', date: '2026-12-10', classCode: '3A' },
        { fromCode: 'CSMT', toCode: 'NDLS', date: '2026-12-18', classCode: '2A' },
      ],
      notifications: [
        {
          id: 'notif_1',
          title: 'Chart Preparation Alert (Demo)',
          message: 'Demonstration PNR 8429104521 for 20607 Vande Bharat is confirmed.',
          read: false,
          createdAt: now,
        },
      ],
      createdAt: now,
    },
    {
      id: demoAdminId,
      name: 'Kavya Nair',
      email: 'admin@railnova.demo',
      phone: '+91 90000 00002',
      passwordHash: hashPassword('Admin@RailNova2026'),
      role: 'admin',
      provider: 'credentials',
      savedPassengers: [],
      favouriteRoutes: [],
      favouriteDestinations: [],
      recentSearches: [],
      notifications: [],
      createdAt: now,
    },
  ];

  const bookings: BookingRecord[] = [
    {
      id: 'bkg_demo_1',
      pnr: '8429104521',
      bookingReference: 'RN-2026-8429',
      userId: demoTravelerId,
      trainNumber: '20607',
      trainName: 'MGR Chennai - Mysuru Vande Bharat',
      category: 'Vande Bharat',
      fromCode: 'SBC',
      fromName: 'KSR Bengaluru City Jn',
      toCode: 'MYS',
      toName: 'Mysuru Junction',
      journeyDate: '2026-12-12',
      departureTime: '10:35',
      arrivalTime: '12:25',
      durationLabel: '1h 50m',
      classCode: 'CC',
      className: 'AC Chair Car',
      quota: 'GN',
      passengers: [
        {
          id: 'p1',
          fullName: 'Aarav Menon',
          age: 29,
          gender: 'Male',
          berthPreference: 'WINDOW',
          concession: 'NONE',
          bookingStatus: 'CNF',
          assignedCoach: 'C4',
          assignedBerth: '18 (WS)',
        },
      ],
      contactEmail: 'traveler@railnova.demo',
      contactPhone: '+91 90000 00001',
      baseFare: 550,
      taxes: 28,
      convenienceFee: 35,
      totalAmount: 613,
      paymentId: 'pay_demo_99182',
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      chartPrepared: true,
      isDemo: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bkg_demo_2',
      pnr: '6193048271',
      bookingReference: 'RN-2026-6193',
      userId: demoTravelerId,
      trainNumber: '17309',
      trainName: 'Yesvantpur - Vasco-da-Gama Express',
      category: 'Mail/Express',
      fromCode: 'SBC',
      fromName: 'KSR Bengaluru City Jn',
      toCode: 'MAO',
      toName: 'Madgaon Junction',
      journeyDate: '2026-12-20',
      departureTime: '14:30',
      arrivalTime: '05:10',
      durationLabel: '14h 40m',
      classCode: '3A',
      className: 'Third AC',
      quota: 'GN',
      passengers: [
        {
          id: 'p2',
          fullName: 'Aarav Menon',
          age: 29,
          gender: 'Male',
          berthPreference: 'LOWER',
          concession: 'NONE',
          bookingStatus: 'RAC 4',
          assignedCoach: 'B2',
          assignedBerth: 'RAC 4 (SL)',
        },
        {
          id: 'p3',
          fullName: 'Meera Menon',
          age: 27,
          gender: 'Female',
          berthPreference: 'SIDE_LOWER',
          concession: 'NONE',
          bookingStatus: 'RAC 5',
          assignedCoach: 'B2',
          assignedBerth: 'RAC 5 (SL)',
        },
      ],
      contactEmail: 'traveler@railnova.demo',
      contactPhone: '+91 90000 00001',
      baseFare: 2130,
      taxes: 107,
      convenienceFee: 35,
      totalAmount: 2272,
      paymentId: 'pay_demo_77219',
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      bookingStatus: 'RAC',
      chartPrepared: false,
      isDemo: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'aud_1',
      actorId: demoAdminId,
      actorEmail: 'admin@railnova.demo',
      action: 'SYSTEM_SEED',
      target: 'database',
      details: 'Initialized demonstration railway catalogue and sample PNRs.',
      timestamp: now,
    },
  ];

  return {
    users,
    stations: STATIONS,
    trains: TRAINS,
    bookings,
    cancellations: [],
    auditLogs,
  };
}

function parseTwelveMonthExpiry(dateStr: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    const lastDayOfMonth = new Date(Date.UTC(year + 1, month + 1, 0)).getUTCDate();
    const clampedDay = Math.min(day, lastDayOfMonth);
    return Date.UTC(year + 1, month, clampedDay, 23, 59, 59, 999);
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  const expiry = new Date(parsed);
  expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
  return expiry.getTime();
}

export function purgeExpiredRecords(db: RailNovaDatabase, now = new Date()): boolean {
  const nowMs = now.getTime();
  const expiredBookingIds = new Set<string>();
  const expiredPnrs = new Set<string>();
  const activeBookingIds = new Set<string>();

  const nextBookings = db.bookings.filter((b) => {
    const expiryMs = parseTwelveMonthExpiry(b.journeyDate);
    if (expiryMs !== null && nowMs > expiryMs) {
      expiredBookingIds.add(b.id);
      expiredPnrs.add(b.pnr);
      return false;
    }
    activeBookingIds.add(b.id);
    return true;
  });

  const nextCancellations = db.cancellations.filter((c) => {
    if (expiredBookingIds.has(c.bookingId) || expiredPnrs.has(c.pnr)) {
      return false;
    }
    if (!activeBookingIds.has(c.bookingId)) {
      const expiryMs = parseTwelveMonthExpiry(c.processedAt || c.createdAt);
      if (expiryMs !== null && nowMs > expiryMs) {
        return false;
      }
    }
    return true;
  });

  const changed =
    nextBookings.length !== db.bookings.length ||
    nextCancellations.length !== db.cancellations.length;
  if (changed) {
    db.bookings = nextBookings;
    db.cancellations = nextCancellations;
  }
  return changed;
}

export async function getDb(): Promise<RailNovaDatabase> {
  if (memoryCache) {
    if (purgeExpiredRecords(memoryCache)) {
      await persistDb(memoryCache);
    }
    return memoryCache;
  }

  try {
    let raw: string;
    try {
      raw = await fs.readFile(DB_PATH, 'utf8');
    } catch {
      raw = await fs.readFile(SEED_DB_PATH, 'utf8');
    }
    const parsed = JSON.parse(raw) as RailNovaDatabase;
    // Merge any newly added stations or trains into existing local DB without overwriting bookings
    let dirty = purgeExpiredRecords(parsed);
    const existingStationCodes = new Set(parsed.stations.map((s) => s.code));
    for (const st of STATIONS) {
      if (!existingStationCodes.has(st.code)) {
        parsed.stations.push(st);
        dirty = true;
      }
    }
    const existingTrainNumbers = new Set(parsed.trains.map((t) => t.number));
    for (const tr of TRAINS) {
      if (!existingTrainNumbers.has(tr.number)) {
        parsed.trains.push(tr);
        dirty = true;
      }
    }
    memoryCache = parsed;
    if (dirty) await persistDb(parsed);
    return memoryCache;
  } catch {
    const seeded = buildSeedDatabase();
    memoryCache = seeded;
    await persistDb(seeded);
    return seeded;
  }
}

export async function persistDb(db: RailNovaDatabase): Promise<void> {
  memoryCache = db;
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(db, null, 2), 'utf8');
    await fs.rename(tempPath, DB_PATH);
  });
  await writeQueue;
}
