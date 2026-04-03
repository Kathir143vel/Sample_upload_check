'use client';
import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are AgriAI, an expert agricultural advisor for Indian farmers, specializing in Tamil Nadu crops like paddy, sugarcane, banana, cotton, and groundnut. You have deep knowledge of:
- Crop diseases, pests, and organic/chemical treatments with Indian brand names
- Soil nutrition, NPK ratios, fertilizer scheduling
- NDVI interpretation and satellite imagery for precision agriculture  
- Weather impact on crops in Tamil Nadu/South India climate
- Government agricultural schemes (PM-KISAN, soil health card)
- Irrigation methods: drip, sprinkler, flood
Keep answers practical, specific, and farmer-friendly. Use metric units. Reference Indian agricultural standards.`;

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'My paddy leaves are turning yellow. What deficiency could this be?',
  'Best time to apply urea for sugarcane in Tamil Nadu?',
  'How to interpret NDVI score of 0.45 for my rice field?',
  'What pesticide for aphids on cotton crop?',
];

export default function ChatModule() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Vanakkam! I\'m your AgriAI crop advisor. I can help with pest management, soil nutrition, NDVI interpretation, fertilizer scheduling, and crop-specific advice for Tamil Nadu. What\'s your question today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not process that. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 className="font-display" style={{ fontSize: '32px' }}>
          AI Crop <span style={{ color: 'var(--moss-glow)' }}>Advisor</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          Powered by Claude · Agricultural RAG knowledge base · Tamil Nadu specialist
        </p>
      </div>

      {/* Chat window */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--moss)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '8px', flexShrink: 0, marginTop: '2px' }}>
                ◈
              </div>
            )}
            <div className={m.role === 'user' ? 'chat-user' : 'chat-ai'} style={{ maxWidth: '75%', padding: '12px 16px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--moss)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>◈</div>
            <div className="chat-ai" style={{ padding: '12px 16px', display: 'flex', gap: '4px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--moss-glow)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding: '6px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '20px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Ask about crops, pests, soil, NDVI..."
          style={{
            flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '12px 16px', color: 'var(--text-primary)',
            fontSize: '14px', outline: 'none',
          }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          padding: '12px 20px', background: 'var(--moss)', color: 'white',
          border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          Send
        </button>
      </div>
    </div>
  );
}
