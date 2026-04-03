'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Total Area', value: '48.2 ha', sub: '+2.1 from last season', color: 'var(--moss-glow)' },
  { label: 'Active Alerts', value: '3', sub: '2 high risk cells', color: 'var(--danger)' },
  { label: 'Avg NDVI Score', value: '0.72', sub: 'Healthy range', color: 'var(--safe)' },
  { label: 'Soil pH', value: '6.4', sub: 'Optimal for wheat', color: 'var(--wheat)' },
];

const recentAlerts = [
  { cell: 'A4', type: 'NDVI Drop', severity: 'high', time: '2h ago' },
  { cell: 'B7', type: 'Pest Detected', severity: 'medium', time: '5h ago' },
  { cell: 'C2', type: 'N Deficiency', severity: 'low', time: '1d ago' },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="font-display" style={{ fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Farm Intelligence<br />
          <span style={{ color: 'var(--moss-glow)' }}>Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>
          Last updated: {new Date().toLocaleString()} · Keezhapavur Farm, Tamil Nadu
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px', animationDelay: `${i * 0.05}s` }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            <div className="font-mono" style={{ fontSize: '28px', color: s.color, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions + recent alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Quick actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/farm-map', label: '⬡ View Farm Map & NDVI Overlay' },
              { href: '/pest', label: '⬟ Upload Leaf for Pest Detection' },
              { href: '/soil', label: '◎ Analyze Soil Sample' },
              { href: '/chat', label: '◈ Ask AI Crop Advisor' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                display: 'block', padding: '12px 16px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text-primary)',
                textDecoration: 'none', fontSize: '14px', transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Recent Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentAlerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="font-mono" style={{ fontSize: '13px', color: 'var(--wheat)', background: 'rgba(212,168,83,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    Cell {a.cell}
                  </div>
                  <span style={{ fontSize: '14px' }}>{a.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge-${a.severity === 'high' ? 'danger' : a.severity === 'medium' ? 'warn' : 'safe'}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                    {a.severity}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { title: 'NDVI Risk Analysis', desc: 'Upload satellite imagery to get per-cell risk scores using EfficientNet-B0', href: '/ndvi', status: '3 cells flagged', statusType: 'danger' },
          { title: 'Soil Intelligence', desc: 'Input NPK/pH readings for deficiency analysis and fertilizer recommendations', href: '/soil', status: 'Last scan: 2d ago', statusType: 'safe' },
          { title: 'Pest & Disease', desc: 'Upload leaf images for AI-powered pest identification and pesticide guidance', href: '/pest', status: '1 active threat', statusType: 'warn' },
        ].map((m, i) => (
          <Link key={i} href={m.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</h3>
                <span className={`badge-${m.statusType}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{m.status}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
