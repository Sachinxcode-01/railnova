import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RailNova — Beyond the Destination | Next-Generation Indian Railway Booking';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0C0D10 0%, #17191F 55%, #231E36 100%)',
          color: '#F8F9FC',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#17191F',
              border: '2px solid #2A2D35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '22px', height: '14px', background: '#D4FF3F', borderRadius: '3px' }} />
          </div>
          <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Rail<span style={{ color: '#D4FF3F' }}>Nova</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#D4FF3F',
            }}
          >
            NEXT-GEN INDIAN RAILWAY BOOKING
          </div>
          <div style={{ fontSize: '68px', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>
            Beyond the Destination.
          </div>
          <div style={{ fontSize: '26px', color: '#A1A6B3', lineHeight: 1.4 }}>
            Search Vande Bharat &amp; Rajdhani corridors, inspect coach layouts, track live trains, and book demonstration tickets.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#A1A6B3' }}>
          <span>12 Iconic Indian Cities</span>
          <span>Live Telemetry · Coach Layouts · PNR Enquiry</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
