'use client';
import { useState } from 'react';

const DEFICIENCY_MAP: Record<string, { color: string; fertilizer: string; dose: string }> = {
  nitrogen: { color: '#52C77A', fertilizer: 'Urea (46-0-0)', dose: '120 kg/ha' },
  phosphorus: { color: '#4A90B8', fertilizer: 'DAP (18-46-0)', dose: '80 kg/ha' },
  potassium: { color: '#D4A853', fertilizer: 'MOP (0-0-60)', dose: '60 kg/ha' },
  calcium: { color: '#A0522D', fertilizer: 'Lime / Gypsum', dose: '200 kg/ha' },
  magnesium: { color: '#7CB87D', fertilizer: 'Dolomite', dose: '50 kg/ha' },
};

export default function SoilModule() {
  const [form, setForm] = useState({ n: '', p: '', k: '', ph: '', moisture: '', temp: '', ec: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!form.n || !form.p || !form.k || !form.ph) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const n = parseFloat(form.n), p = parseFloat(form.p), k = parseFloat(form.k), ph = parseFloat(form.ph);
    const deficiencies = [];
    if (n < 40) deficiencies.push({ nutrient: 'nitrogen', severity: n < 20 ? 'critical' : 'moderate', value: n, optimal: '40-60 mg/kg' });
    if (p < 15) deficiencies.push({ nutrient: 'phosphorus', severity: p < 8 ? 'critical' : 'moderate', value: p, optimal: '15-25 mg/kg' });
    if (k < 120) deficiencies.push({ nutrient: 'potassium', severity: k < 80 ? 'critical' : 'moderate', value: k, optimal: '120-200 mg/kg' });
    const soilHealth = deficiencies.length === 0 ? 'optimal' : deficiencies.some(d => d.severity === 'critical') ? 'critical' : 'needs-treatment';
    const cropSuggestion = ph >= 6 && ph <= 7 ? 'Wheat, Rice, Maize' : ph < 6 ? 'Potatoes, Blueberries' : 'Alfalfa, Sugar Beet';
    setResult({ deficiencies, soilHealth, cropSuggestion, ph, moisture: form.moisture, score: Math.max(10, 100 - deficiencies.length * 25) });
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="font-display" style={{ fontSize: '32px' }}>
          Soil <span style={{ color: 'var(--wheat)' }}>Intelligence</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          XGBoost model · NPK/pH readings → deficiency analysis + fertilizer recommendations
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Input form */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Soil Sample Readings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'n', label: 'Nitrogen (N)', unit: 'mg/kg', placeholder: 'e.g. 35' },
              { key: 'p', label: 'Phosphorus (P)', unit: 'mg/kg', placeholder: 'e.g. 12' },
              { key: 'k', label: 'Potassium (K)', unit: 'mg/kg', placeholder: 'e.g. 150' },
              { key: 'ph', label: 'pH Level', unit: '0-14', placeholder: 'e.g. 6.5' },
              { key: 'moisture', label: 'Moisture', unit: '%', placeholder: 'e.g. 45' },
              { key: 'temp', label: 'Soil Temp', unit: '°C', placeholder: 'e.g. 28' },
              { key: 'ec', label: 'Electrical Conductivity', unit: 'dS/m', placeholder: 'e.g. 0.8' },
            ].map(({ key, label, unit, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{label}</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number" placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{
                      flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '6px', padding: '8px 12px', color: 'var(--text-primary)',
                      fontSize: '14px', outline: 'none',
                    }}
                  />
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-dim)', minWidth: '40px' }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={analyze} disabled={loading} style={{
            marginTop: '20px', width: '100%', padding: '12px',
            background: loading ? 'var(--border)' : 'var(--wheat)', color: 'var(--soil)',
            border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: 700,
          }}>
            {loading ? 'Running XGBoost Analysis...' : 'Analyze Soil Sample'}
          </button>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>◎</div>
              <div style={{ fontSize: '14px' }}>Enter soil readings to get AI analysis</div>
            </div>
          )}
          {loading && (
            <div className="card" style={{ padding: '24px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '8px' }} />
              ))}
            </div>
          )}
          {result && !loading && (
            <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Overall health */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Soil Health Score</span>
                  <span className={`badge-${result.soilHealth === 'optimal' ? 'safe' : result.soilHealth === 'critical' ? 'danger' : 'warn'}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>{result.soilHealth}</span>
                </div>
                <div className="font-mono" style={{ fontSize: '36px', color: result.score >= 75 ? 'var(--safe)' : result.score >= 50 ? 'var(--warn)' : 'var(--danger)', fontWeight: 700 }}>{result.score}/100</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Crop suggestion: <span style={{ color: 'var(--wheat)' }}>{result.cropSuggestion}</span></div>
              </div>

              {/* Deficiencies */}
              {result.deficiencies.length > 0 ? result.deficiencies.map((d: any) => {
                const info = DEFICIENCY_MAP[d.nutrient];
                return (
                  <div key={d.nutrient} className="card" style={{ padding: '16px', borderLeft: `3px solid ${info.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{d.nutrient} Deficiency</span>
                      <span className={`badge-${d.severity === 'critical' ? 'danger' : 'warn'}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>{d.severity}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Detected: <span className="font-mono" style={{ color: info.color }}>{d.value} mg/kg</span> · Optimal: {d.optimal}
                    </div>
                    <div style={{ padding: '10px', background: 'var(--bg)', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Recommended: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{info.fertilizer}</span></div>
                      <div style={{ color: 'var(--text-dim)' }}>Application rate: <span className="font-mono">{info.dose}</span></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div className="badge-safe" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px', fontSize: '12px' }}>All nutrients optimal</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No fertilizer intervention required</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
