/* =====================================================
   SEOView — Dashboard de SEO
   Keywords · Rankings · On-page · Backlinks
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { TrendingUp, Search, Link, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Minus, Globe, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const keywords = [
  { kw: 'zapatillas running uruguay', vol: 2400, pos: 2, posAnterior: 4, dificultad: 45, clicks: 890, intension: 'transaccional' },
  { kw: 'comprar auriculares bluetooth', vol: 1900, pos: 1, posAnterior: 1, dificultad: 62, clicks: 740, intension: 'transaccional' },
  { kw: 'tienda online uruguay', vol: 5400, pos: 8, posAnterior: 12, dificultad: 78, clicks: 320, intension: 'navegacional' },
  { kw: 'smartwatch barato', vol: 3200, pos: 5, posAnterior: 3, dificultad: 55, clicks: 480, intension: 'transaccional' },
  { kw: 'mochila universitaria precio', vol: 1200, pos: 3, posAnterior: 5, dificultad: 38, clicks: 290, intension: 'transaccional' },
  { kw: 'silla ergonomica trabajo', vol: 1800, pos: 11, posAnterior: 9, dificultad: 52, clicks: 180, intension: 'investigacion' },
  { kw: 'electrónica buenos precios', vol: 4800, pos: 15, posAnterior: 18, dificultad: 68, clicks: 140, intension: 'transaccional' },
];

const paginas = [
  { url: '/productos/zapatillas', titulo: 'Zapatillas Running', trafico: 2840, posMedia: 2.3, score: 92, issues: 0 },
  { url: '/productos/auriculares', titulo: 'Auriculares Bluetooth', trafico: 1920, posMedia: 1.8, score: 88, issues: 1 },
  { url: '/categoria/electronica', titulo: 'Electrónica', trafico: 1240, posMedia: 7.4, score: 74, issues: 3 },
  { url: '/productos/smartwatch', titulo: 'Smartwatch', trafico: 980, posMedia: 4.9, score: 81, issues: 2 },
  { url: '/', titulo: 'Home', trafico: 4200, posMedia: 8.1, score: 69, issues: 5 },
];

const backlinks = [
  { dominio: 'elmercurio.com.uy', autoridad: 72, tipo: 'editorial', anchor: 'tienda online', fecha: '2026-02-18' },
  { dominio: 'tecnologia.uy', autoridad: 58, tipo: 'mención', anchor: 'auriculares bluetooth uruguay', fecha: '2026-02-15' },
  { dominio: 'guia.com.uy', autoridad: 45, tipo: 'directorio', anchor: 'ODDY Store', fecha: '2026-02-10' },
  { dominio: 'blog-tech.uy', autoridad: 38, tipo: 'reseña', anchor: 'zapatillas running', fecha: '2026-02-05' },
  { dominio: 'compras.uy', autoridad: 65, tipo: 'editorial', anchor: 'mejores precios online', fecha: '2026-01-28' },
];

const tendenciaData = [
  { mes: 'Sep', trafico: 12400, posMedia: 8.2 }, { mes: 'Oct', trafico: 14800, posMedia: 7.8 },
  { mes: 'Nov', trafico: 17200, posMedia: 7.1 }, { mes: 'Dic', trafico: 21400, posMedia: 6.4 },
  { mes: 'Ene', trafico: 24800, posMedia: 5.9 }, { mes: 'Feb', trafico: 28400, posMedia: 5.2 },
];

const kpis = [
  { label: 'Tráfico Orgánico', value: '28.4K', change: '+14.5%', icon: TrendingUp, color: '#10B981', up: true },
  { label: 'Keywords en Top 10', value: '47', change: '+8 este mes', icon: Search, color: '#3B82F6', up: true },
  { label: 'Posición Media', value: '5.2', change: '-0.7 mejor', icon: BarChart2, color: ORANGE, up: true },
  { label: 'Backlinks Activos', value: '284', change: '+23 este mes', icon: Link, color: '#8B5CF6', up: true },
];

const iconoPosicion = (pos: number, ant: number) => {
  if (pos < ant) return <span style={{ color: '#059669', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}><ArrowUp size={10} /> {ant - pos}</span>;
  if (pos > ant) return <span style={{ color: '#DC2626', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}><ArrowDown size={10} /> {pos - ant}</span>;
  return <span style={{ color: '#9CA3AF', fontSize: '0.7rem' }}><Minus size={10} /></span>;
};

export function SEOView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'keywords' | 'paginas' | 'backlinks' | 'tendencias'>('keywords');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={TrendingUp}
        title="SEO — Search Engine Optimization"
        subtitle="Keywords · Rankings · Análisis on-page · Backlinks"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '🔄 Actualizar', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={20} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#10B981', marginTop: 2 }}>{k.change}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'keywords' as const, label: '🔑 Keywords' },
            { id: 'paginas' as const, label: '📄 Páginas' },
            { id: 'backlinks' as const, label: '🔗 Backlinks' },
            { id: 'tendencias' as const, label: '📈 Tendencias' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'keywords' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Keyword', 'Intención', 'Volumen', 'Posición', 'Cambio', 'Dificultad', 'Clicks'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{k.kw}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '5px', fontWeight: '600', backgroundColor: k.intension === 'transaccional' ? '#D1FAE5' : k.intension === 'navegacional' ? '#DBEAFE' : '#FEF3C7', color: k.intension === 'transaccional' ? '#059669' : k.intension === 'navegacional' ? '#1D4ED8' : '#D97706' }}>
                        {k.intension}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{k.vol.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: k.pos <= 3 ? '#059669' : k.pos <= 10 ? ORANGE : '#DC2626' }}>#{k.pos}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>{iconoPosicion(k.pos, k.posAnterior)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 50, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${k.dificultad}%`, height: '100%', backgroundColor: k.dificultad < 40 ? '#10B981' : k.dificultad < 65 ? ORANGE : '#EF4444', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#374151' }}>{k.dificultad}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{k.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'paginas' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Página', 'Tráfico', 'Posición Media', 'Score SEO', 'Issues'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginas.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{p.titulo}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.url}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1A1A2E' }}>{p.trafico.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>#{p.posMedia}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${p.score}%`, height: '100%', backgroundColor: p.score >= 85 ? '#10B981' : p.score >= 70 ? ORANGE : '#EF4444', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: '0.83rem', fontWeight: '700', color: p.score >= 85 ? '#059669' : p.score >= 70 ? '#D97706' : '#DC2626' }}>{p.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.issues === 0 ? (
                        <CheckCircle size={15} color="#10B981" />
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: '600', color: '#D97706' }}>
                          <AlertCircle size={14} color="#D97706" /> {p.issues} errores
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'backlinks' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Dominio', 'Autoridad', 'Tipo', 'Anchor Text', 'Fecha'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {backlinks.map((b, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Globe size={14} color="#9CA3AF" />
                        <span style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{b.dominio}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: '700', color: b.autoridad >= 60 ? '#059669' : b.autoridad >= 40 ? ORANGE : '#DC2626', fontSize: '0.9rem' }}>{b.autoridad}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '5px', backgroundColor: '#F3F4F6', color: '#374151' }}>{b.tipo}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.83rem', color: '#3B82F6', fontStyle: 'italic' }}>{b.anchor}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{b.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'tendencias' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Tráfico Orgánico (6 meses)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tendenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="trafico" fill={ORANGE} radius={[4, 4, 0, 0]} name="Visitas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Posición Media (6 meses)</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tendenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis reversed tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="posMedia" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Posición" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
