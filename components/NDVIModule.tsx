'use client';
import { useState, useCallback } from 'react';

const NDVI_COLORS: Record<string, string> = {
  critical: '#E85D4A', high: '#F0A500', medium: '#D4A853', low: '#7CB87D', healthy: '#52C77A',
};

export default function NDVIModule() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    // Simulate API call — in prod: POST to /api/backend/ndvi/analyze
    await new Promise(r => setTimeout(r, 2000));
    const levels = ['healthy', 'low', 'medium', 'high', 'critical'];
    const cells = Array.from({ length: 12 }, (_, i) => {
      const ndvi = Math.random() * 0.7 + 0.2;
      const level = ndvi > 0.7 ? 'healthy' : ndvi > 0.55 ? 'low' : ndvi > 0.45 ? 'medium' : ndvi > 0.35 ? 'high' : 'critical';
      return { id: `Cell ${i + 1}`, ndvi: parseFloat(ndvi.toFixed(3)), level, risk: parseFloat((1 - ndvi).toFixed(3)) };
    });
    setResult({ cells, avgNdvi: parseFloat((cells.reduce((s, c) => s + c.ndvi, 0) / cells.length).toFixed(3)), highRiskCount: cells.filter(c => c.level === 'critical' || c.level === 'high').length });
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="font-display" style={{ fontSize: '32px' }}>
          NDVI Risk <span style={{ color: 'var(--moss-glow)' }}>Analysis</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          Upload satellite imagery → EfficientNet-B0 scores each grid cell 0–1 risk probability
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Upload */}
        <div>
          <div className={`upload-zone ${dragging ? 'active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{ padding: '40px', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => document.getElementById('ndvi-input')?.click()}>
            <input id="ndvi-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: '200px', borderRadius: '8px', maxWidth: '100%' }} />
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>◉</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Drop satellite image here</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>Supports TIFF, PNG, JPG · NDVI bands preferred</div>
              </>
            )}
          </div>
          {file && (
            <button onClick={analyze} disabled={loading} style={{
              marginTop: '12px', width: '100%', padding: '12px',
              background: loading ? 'var(--border)' : 'var(--moss)', color: 'white',
              border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600,
            }}>
              {loading ? 'Analyzing with EfficientNet-B0...' : 'Run NDVI Risk Analysis'}
            </button>
          )}
        </div>

        {/* Info card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            How It Works
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { step: '01', title: 'Image Upload', desc: 'Satellite image (Sentinel-2 or drone) is uploaded and segmented into grid cells' },
              { step: '02', title: 'EfficientNet-B0', desc: 'Each patch is fed through fine-tuned EfficientNet → risk probability 0–1' },
              { step: '03', title: 'NDVI Scoring', desc: 'NDVI bands normalized · Risk classified: Critical → Healthy' },
              { step: '04', title: 'Alert Trigger', desc: 'Cells above threshold auto-trigger alerts and recommendations' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: '12px' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: 'var(--moss-glow)', minWidth: '24px', paddingTop: '2px' }}>{step}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ color: 'var(--moss-glow)', marginBottom: '8px', fontSize: '14px' }}>Analyzing image patches through EfficientNet-B0...</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginTop: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: '6px' }} />
            ))}
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="card animate-fade-up" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Analysis Results</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Avg NDVI: <span className="font-mono" style={{ color: 'var(--moss-glow)' }}>{result.avgNdvi}</span></span>
              {result.highRiskCount > 0 && <span className="badge-danger" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>{result.highRiskCount} high-risk cells</span>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {result.cells.map((cell: any) => (
              <div key={cell.id} style={{
                padding: '12px', borderRadius: '8px', border: '1px solid var(--border)',
                background: `${NDVI_COLORS[cell.level]}15`,
                borderLeft: `3px solid ${NDVI_COLORS[cell.level]}`,
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{cell.id}</div>
                <div className="font-mono" style={{ fontSize: '18px', color: NDVI_COLORS[cell.level], fontWeight: 700 }}>{cell.ndvi}</div>
                <div style={{ fontSize: '10px', color: NDVI_COLORS[cell.level], textTransform: 'uppercase', marginTop: '2px' }}>{cell.level}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>Risk: {cell.risk}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
