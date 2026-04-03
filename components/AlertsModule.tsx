'use client';
import { useState } from 'react';

const MOCK_ALERTS = [
  { id: 1, cell: 'A4', type: 'NDVI Critical Drop', severity: 'critical', message: 'NDVI dropped to 0.28 (was 0.61 last week). Immediate irrigation and inspection needed.', time: '2 hours ago', resolved: false, module: 'NDVI' },
  { id: 2, cell: 'B7', type: 'Pest: Leaf Blight Detected', severity: 'high', message: 'MobileNet-V2 detected Leaf Blight with 91% confidence. Apply Mancozeb 75% WP immediately.', time: '5 hours ago', resolved: false, module: 'Pest' },
  { id: 3, cell: 'C2', type: 'Nitrogen Deficiency', severity: 'medium', message: 'N reading at 22 mg/kg (optimal: 40-60). Apply Urea 120 kg/ha within 3 days.', time: '1 day ago', resolved: false, module: 'Soil' },
  { id: 4, cell: 'D5', type: 'NDVI Recovery', severity: 'low', message: 'Cell D5 NDVI improved from 0.41 to 0.63 after irrigation. Risk downgraded to low.', time: '2 days ago', resolved: true, module: 'NDVI' },
  { id: 5, cell: 'E1', type: 'Potassium Deficiency', severity: 'medium', message: 'K reading at 95 mg/kg (optimal: 120-200). Apply MOP (0-0-60) at 60 kg/ha.', time: '3 days ago', resolved: true, module: 'Soil' },
];

const SEV_COLORS: Record<string, string> = { critical: '#E85D4A', high: '#F0A500', medium: '#D4A853', low: '#52C77A' };
const MOD_ICONS: Record<string, string> = { NDVI: '◉', Pest: '⬟', Soil: '◎' };

export default function AlertsModule() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const resolve = (id: number) => setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));

  const filtered = alerts.filter(a => {
    if (filter === 'active' && a.resolved) return false;
    if (filter === 'resolved' && !a.resolved) return false;
    if (moduleFilter !== 'all' && a.module !== moduleFilter) return false;
    return true;
  });

  const stats = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.resolved).length,
    total: alerts.filter(a => !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length,
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="font-display" style={{ fontSize: '32px' }}>
          Alerts & <span style={{ color: 'var(--warn)' }}>Notifications</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          Auto-triggered when NDVI, pest, or soil thresholds are breached
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Critical', value: stats.critical, color: 'var(--danger)' },
          { label: 'High Risk', value: stats.high, color: 'var(--warn)' },
          { label: 'Active Total', value: stats.total, color: 'var(--wheat)' },
          { label: 'Resolved', value: stats.resolved, color: 'var(--safe)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '28px', color, fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border)',
            background: filter === f ? 'var(--moss)' : 'transparent',
            color: filter === f ? 'white' : 'var(--text-muted)',
            fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize',
          }}>{f}</button>
        ))}
        <div style={{ width: '1px', background: 'var(--border)' }} />
        {(['all', 'NDVI', 'Pest', 'Soil'] as const).map(m => (
          <button key={m} onClick={() => setModuleFilter(m)} style={{
            padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border)',
            background: moduleFilter === m ? 'var(--bg-elevated)' : 'transparent',
            color: moduleFilter === m ? 'var(--text-primary)' : 'var(--text-dim)',
            fontSize: '13px', cursor: 'pointer',
          }}>{m === 'all' ? 'All Modules' : `${MOD_ICONS[m]} ${m}`}</button>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(alert => (
          <div key={alert.id} className="card" style={{
            padding: '16px 20px',
            borderLeft: `3px solid ${alert.resolved ? 'var(--border)' : SEV_COLORS[alert.severity]}`,
            opacity: alert.resolved ? 0.6 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="font-mono" style={{ fontSize: '12px', color: 'var(--wheat)', background: 'rgba(212,168,83,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {MOD_ICONS[alert.module]} Cell {alert.cell}
                </div>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{alert.type}</span>
                {!alert.resolved && (
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: `${SEV_COLORS[alert.severity]}20`, color: SEV_COLORS[alert.severity], border: `1px solid ${SEV_COLORS[alert.severity]}40` }}>
                    {alert.severity}
                  </span>
                )}
                {alert.resolved && <span className="badge-safe" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>resolved</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{alert.time}</span>
                {!alert.resolved && (
                  <button onClick={() => resolve(alert.id)} style={{
                    padding: '4px 12px', background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer',
                  }}>
                    Mark resolved
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{alert.message}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
            <div>No alerts match this filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
