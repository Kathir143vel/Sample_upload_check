'use client';
import { useEffect, useState, useRef } from 'react';

// NDVI risk levels mapped to colors
const NDVI_COLORS: Record<string, string> = {
  critical: '#E85D4A',
  high: '#F0A500',
  medium: '#D4A853',
  low: '#7CB87D',
  healthy: '#52C77A',
};

// Mock grid cells for a 6x8 farm grid
function generateGrid() {
  const levels = ['healthy', 'low', 'medium', 'high', 'critical'];
  const cells: Array<{ id: string; row: number; col: number; ndvi: number; level: string; area: number }> = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      const ndvi = Math.random() * 0.6 + 0.3;
      const idx = ndvi > 0.75 ? 4 : ndvi > 0.6 ? 3 : ndvi > 0.5 ? 2 : ndvi > 0.4 ? 1 : 0;
      cells.push({ id: `${String.fromCharCode(65 + r)}${c + 1}`, row: r, col: c, ndvi: parseFloat(ndvi.toFixed(3)), level: levels[idx], area: parseFloat((Math.random() * 0.8 + 0.5).toFixed(2)) });
    }
  }
  return cells;
}

export default function FarmMapClient() {
  const [cells] = useState(generateGrid);
  const [selected, setSelected] = useState<typeof cells[0] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import leaflet only on client
    import('react-leaflet').then((rl) => {
      setMapComponent(rl);
    });
    setShowMap(true);
  }, []);

  const counts = ['critical', 'high', 'medium', 'low', 'healthy'].map(l => ({
    level: l, count: cells.filter(c => c.level === l).length
  }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="font-display" style={{ fontSize: '32px', color: 'var(--text-primary)' }}>
          Farm Map & <span style={{ color: 'var(--moss-glow)' }}>NDVI Grid</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          48.2 ha · 48 cells · 6×8 grid overlay
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        {/* Grid heatmap */}
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                NDVI Heatmap Grid
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.entries(NDVI_COLORS).map(([level, color]) => (
                  <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                    {level}
                  </div>
                ))}
              </div>
            </div>
            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
              {cells.map(cell => (
                <button key={cell.id} onClick={() => setSelected(cell)} style={{
                  aspectRatio: '1', borderRadius: '6px',
                  background: NDVI_COLORS[cell.level],
                  opacity: selected?.id === cell.id ? 1 : 0.75,
                  border: selected?.id === cell.id ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', color: 'rgba(0,0,0,0.6)', fontWeight: 700,
                }}>
                  {cell.id}
                </button>
              ))}
            </div>
          </div>

          {/* Risk summary bar */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '0', overflow: 'hidden', borderRadius: '6px', marginBottom: '12px' }}>
              {counts.map(({ level, count }) => (
                <div key={level} style={{
                  flex: count, background: NDVI_COLORS[level],
                  height: '20px', transition: 'flex 0.5s',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {counts.map(({ level, count }) => (
                <div key={level} style={{ textAlign: 'center', fontSize: '12px' }}>
                  <div className="font-mono" style={{ color: NDVI_COLORS[level], fontWeight: 700 }}>{count}</div>
                  <div style={{ color: 'var(--text-dim)' }}>{level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cell detail + legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selected ? (
            <div className="card" style={{ padding: '20px' }}>
              <div className="font-mono" style={{ fontSize: '24px', color: NDVI_COLORS[selected.level], marginBottom: '4px' }}>
                Cell {selected.id}
              </div>
              <span className={`badge-${selected.level === 'critical' || selected.level === 'high' ? 'danger' : selected.level === 'medium' ? 'warn' : 'safe'}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                {selected.level.toUpperCase()}
              </span>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'NDVI Score', value: selected.ndvi.toFixed(3) },
                  { label: 'Cell Area', value: `${selected.area} ha` },
                  { label: 'Row / Col', value: `${String.fromCharCode(65 + selected.row)} / ${selected.col + 1}` },
                  { label: 'Risk Level', value: selected.level },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '2px' }}>{label}</div>
                    <div className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{value}</div>
                  </div>
                ))}
              </div>
              {(selected.level === 'critical' || selected.level === 'high') && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(232,93,74,0.1)', borderRadius: '8px', border: '1px solid rgba(232,93,74,0.3)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  ⚠ Recommend immediate soil inspection and irrigation check for this cell.
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⬡</div>
              Click a grid cell to view details
            </div>
          )}

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Farm Stats
            </h3>
            {[
              { label: 'Total Cells', value: '48' },
              { label: 'Critical + High', value: `${counts[0].count + counts[1].count}`, color: 'var(--danger)' },
              { label: 'Avg NDVI', value: (cells.reduce((s, c) => s + c.ndvi, 0) / cells.length).toFixed(3), color: 'var(--moss-glow)' },
              { label: 'Needs Action', value: `${cells.filter(c => c.level === 'critical' || c.level === 'high').length} cells`, color: 'var(--warn)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
                <span className="font-mono" style={{ fontSize: '13px', color: color || 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
