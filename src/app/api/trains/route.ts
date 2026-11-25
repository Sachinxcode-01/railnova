import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim().toLowerCase();
  const from = searchParams.get('from')?.trim().toUpperCase();
  const to = searchParams.get('to')?.trim().toUpperCase();
  const classCode = searchParams.get('classCode')?.trim().toUpperCase();
  const quota = searchParams.get('quota')?.trim().toUpperCase();
  const trainNumber = searchParams.get('trainNumber')?.trim();

  const db = await getDb();

  // Station autocomplete mode
  if (q !== undefined && !from && !to && !trainNumber) {
    const stations = db.stations.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    );
    return NextResponse.json({ stations });
  }

  if (trainNumber) {
    const train = db.trains.find((t) => t.number === trainNumber);
    return NextResponse.json({ trains: train ? [train] : [], stations: db.stations });
  }

  let results = db.trains;

  if (from && to) {
    results = results.filter((t) => {
      const fromIdx = t.stops.findIndex((s) => s.stationCode === from);
      const toIdx = t.stops.findIndex((s) => s.stationCode === to);
      return (t.fromCode === from && t.toCode === to) || (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx);
    });
  } else if (from) {
    results = results.filter((t) => t.fromCode === from || t.stops.some((s) => s.stationCode === from));
  } else if (to) {
    results = results.filter((t) => t.toCode === to || t.stops.some((s) => s.stationCode === to));
  }

  if (classCode && classCode !== 'ALL') {
    results = results.filter((t) => t.classes.some((c) => c.classCode === classCode));
  }

  if (quota) {
    results = results.filter((t) => t.applicableQuotas.includes(quota as typeof t.applicableQuotas[number]));
  }

  return NextResponse.json({
    trains: results,
    isDemoData: true,
    notice: 'Demonstration railway schedule & fare data. Not connected to live IRCTC reservation.',
  });
}
