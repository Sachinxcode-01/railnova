import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { fetchLivePnrStatus } from '@/lib/irctc-provider';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ pnr: string }> }
) {
  const { pnr } = await context.params;
  const cleaned = pnr.trim();

  if (!/^\d{10}$/.test(cleaned)) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit PNR number.' },
      { status: 400 }
    );
  }

  const db = await getDb();
  const booking = db.bookings.find((b) => b.pnr === cleaned);

  if (!booking) {
    const livePnr = await fetchLivePnrStatus(cleaned);
    if (livePnr) {
      return NextResponse.json({
        livePnr,
        dataSource: 'live-api',
        lastUpdated: new Date().toISOString(),
        notice: 'Live PNR status retrieved via configured railway provider.',
      });
    }
    return NextResponse.json(
      {
        error:
          'No demonstration booking found for this PNR. RailNova does not fabricate official IRCTC PNR records. Try demo PNR 8429104521 or 6193048271, or create a new demo booking.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    booking,
    lastUpdated: new Date().toISOString(),
    notice: 'Demonstration PNR record from RailNova local database. Not an official IRCTC verification.',
  });
}
