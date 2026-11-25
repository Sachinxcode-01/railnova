import { Train, TrainCategory, TravelClassCode } from './types';
import { computeRealisticFare } from './railway-data';
import * as railkit from '../vendor/railkit/index.obfuscated.js';

let configured = false;

function ensureRailKit(): boolean {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) return false;
  if (!configured) {
    railkit.configure(key);
    configured = true;
  }
  return true;
}

function toDdMmYyyy(isoDate?: string): string {
  const d = isoDate ? new Date(isoDate) : new Date(Date.now() + 5.5 * 3600 * 1000);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function mapCategory(rawType?: string, name?: string): TrainCategory {
  const t = `${rawType || ''} ${name || ''}`.toLowerCase();
  if (t.includes('vande')) return 'Vande Bharat';
  if (t.includes('rajdhani')) return 'Rajdhani';
  if (t.includes('shatabdi') || t.includes('tejas')) return 'Shatabdi';
  if (t.includes('duronto')) return 'Duronto';
  if (t.includes('super') || t.includes('sf')) return 'Superfast';
  return 'Mail/Express';
}

function parseRunningDays(bitmask?: string): Train['runningDays'] {
  const days: Train['runningDays'] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (!bitmask || bitmask.length !== 7) return days;
  return days.filter((_, idx) => bitmask[idx] === '1');
}

function parseDurationMinutes(travelTime?: string): number {
  if (!travelTime) return 360;
  const m = travelTime.match(/(\d{1,2}):(\d{2})/);
  if (!m) return 360;
  return Number(m[1]) * 60 + Number(m[2]);
}

function parseClasses(raw?: string): TravelClassCode[] {
  if (!raw) return ['3A', 'SL'];
  const tokens = raw
    .split(/[,\s/]+/)
    .map((x) => x.trim().toUpperCase())
    .filter((x): x is TravelClassCode =>
      ['1A', '2A', '3A', '3E', 'SL', 'CC', 'EC', '2S'].includes(x)
    );
  return tokens.length > 0 ? tokens : ['2S', 'SL'];
}

export async function fetchLiveTrainsBetweenStations(
  fromCode: string,
  toCode: string,
  date?: string
): Promise<Train[] | null> {
  if (!ensureRailKit()) return null;

  try {
    const res = await railkit.searchTrainBetweenStations(
      fromCode.toUpperCase(),
      toCode.toUpperCase(),
      date ? toDdMmYyyy(date) : undefined
    );
    if (!res?.success || !Array.isArray(res.data) || res.data.length === 0) return null;

    return res.data.slice(0, 25).map((item: Record<string, unknown>) => {
      const category = mapCategory(
        String(item.train_type_name || ''),
        String(item.train_name || '')
      );
      const distanceKm = Number(item.distance) || 250;
      const classCodes = parseClasses(String(item.classes_of_travel || ''));
      const travelTime = String(item.travel_time || '06:00 hrs');

      return {
        number: String(item.train_no || '00000'),
        name: String(item.train_name || 'Indian Railways Express'),
        category,
        fromCode: String(item.from_stn_code || fromCode).toUpperCase(),
        toCode: String(item.to_stn_code || toCode).toUpperCase(),
        departureTime: String(item.from_time || '06:00'),
        arrivalTime: String(item.to_time || '12:00'),
        durationMinutes: parseDurationMinutes(travelTime),
        durationLabel: travelTime.replace(' hrs', '').trim(),
        distanceKm,
        runningDays: parseRunningDays(String(item.running_days || '1111111')),
        applicableQuotas: ['GN', 'TQ', 'LD', 'SS'],
        pantry: category === 'Vande Bharat' || category === 'Rajdhani' || category === 'Shatabdi',
        avgSpeedKmph: Math.max(35, Math.round(distanceKm / Math.max(1, parseDurationMinutes(travelTime) / 60))),
        hasBioVacuum: true,
        classes: classCodes.map((code) => ({
          classCode: code,
          className: code,
          fare: computeRealisticFare(distanceKm, code, category),
          status: 'AVAILABLE',
          count: 32,
          statusText: 'AVL (LIVE)',
          coachPrefix: code[0] || 'S',
        })),
        stops: [],
      };
    });
  } catch {
    return null;
  }
}

export async function fetchLivePnrStatus(pnr: string): Promise<Record<string, unknown> | null> {
  if (!ensureRailKit()) return null;
  try {
    const res = await railkit.checkPNRStatus(pnr);
    if (!res?.success || !res.data) return null;
    return res.data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchLiveTrainStatus(trainNumber: string): Promise<Record<string, unknown> | null> {
  if (!ensureRailKit()) return null;
  try {
    const res = await railkit.trackTrain(trainNumber, toDdMmYyyy());
    if (!res?.success || !res.data) return null;
    return res.data as Record<string, unknown>;
  } catch {
    return null;
  }
}
