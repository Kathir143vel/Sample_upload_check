'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/farm-map', label: 'Farm Map', icon: '⬡' },
  { href: '/ndvi', label: 'NDVI Risk', icon: '◉' },
  { href: '/soil', label: 'Soil Analysis', icon: '◎' },
  { href: '/pest', label: 'Pest Detector', icon: '⬟' },
  { href: '/chat', label: 'AI Advisor', icon: '◈' },
  { href: '/alerts', label: 'Alerts', icon: '⚠' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px',
      background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      <div style={{ padding: '28px 24px 20px' }}>
        <div className="font-display" style={{ fontSize: '22px', color: 'var(--moss-glow)', lineHeight: 1 }}>
          AgriAI
        </div>
        <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', letterSpacing: '0.15em' }}>
          PRECISION FARM INTEL
        </div>
      </div>
      <div style={{ padding: '0 12px', flex: 1 }}>
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
              background: active ? 'rgba(92,139,93,0.15)' : 'transparent',
              color: active ? 'var(--moss-glow)' : 'var(--text-muted)',
              textDecoration: 'none', fontSize: '14px', fontWeight: active ? 500 : 400,
              transition: 'all 0.15s',
              borderLeft: active ? '2px solid var(--moss-glow)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          <div className="font-mono" style={{ color: 'var(--safe)', marginBottom: '2px' }}>● SYSTEM ONLINE</div>
          Models: EfficientNet-B0 • XGBoost • MobileNet
        </div>
      </div>
    </aside>
  );
}
