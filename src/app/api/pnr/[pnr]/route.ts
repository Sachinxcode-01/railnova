import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

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
