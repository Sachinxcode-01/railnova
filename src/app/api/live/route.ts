import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { computeLiveTrainPosition } from '@/lib/railway-data';
import { fetchLiveTrainStatus } from '@/lib/irctc-provider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainNumber = searchParams.get('trainNumber')?.trim();

  const db = await getDb();

  if (trainNumber) {
    const train = db.trains.find((t) => t.number === trainNumber);
    if (!train) {
      return NextResponse.json({ error: 'Train not found.' }, { status: 404 });
    }
    const liveFeed = await fetchLiveTrainStatus(trainNumber);
    return NextResponse.json({
      train,
      telemetry: computeLiveTrainPosition(train),
      liveFeed,
      dataSource: liveFeed ? 'live-api' : 'simulated-ist',
    });
  }

  const fleet = db.trains.map((t) => ({
    number: t.number,
    name: t.name,
    category: t.category,
    fromCode: t.fromCode,
    toCode: t.toCode,
    telemetry: computeLiveTrainPosition(t),
  }));

  return NextResponse.json({ fleet, isSimulatedTelemetry: true });
}
