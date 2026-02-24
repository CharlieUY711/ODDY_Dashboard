/* =====================================================
   GoogleAdsView — Gestión de Campañas Google Ads
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { TrendingUp, DollarSign, MousePointer, Eye, Search, Plus, BarChart2, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const campanas = [
  { id: 1, nombre: 'Búsqueda — Productos Tech', estado: 'activa', presupuesto: 1500, gastado: 1120, clicks: 3420, impresiones: 48000, ctr: 7.1, cpc: 0.33, conversiones: 142, roas: 4.8, color: '#10B981' },
  { id: 2, nombre: 'Display — Retargeting', estado: 'activa', presupuesto: 800, gastado: 560, clicks: 1240, impresiones: 82000, ctr: 1.5, cpc: 0.45, conversiones: 38, roas: 3.2, color: '#10B981' },
  { id: 3, nombre: 'Shopping — Calzado', estado: 'activa', presupuesto: 2000, gastado: 1890, clicks: 5600, impresiones: 124000, ctr: 4.5, cpc: 0.34, conversiones: 289, roas: 6.1, color: '#10B981' },
  { id: 4, nombre: 'YouTube — Marca', estado: 'pausada', presupuesto: 500, gastado: 380, clicks: 620, impresiones: 35000, ctr: 1.8, cpc: 0.61, conversiones: 22, roas: 2.1, color: '#D97706' },
  { id: 5, nombre: 'Performance Max', estado: 'activa', presupuesto: 3000, gastado: 2840, clicks: 8900, impresiones: 210000, ctr: 4.2, cpc: 0.32, conversiones: 450, roas: 7.4, color: '#10B981' },
  { id: 6, nombre: 'Búsqueda — Marca', estado: 'activa', presupuesto: 400, gastado: 210, clicks: 1800, impresiones: 19000, ctr: 9.5, cpc: 0.12, conversiones: 190, roas: 12.8, color: '#10B981' },
];

const tendenciaData = [
  { dia: 'Lun', clicks: 2100, gasto: 890, conversiones: 84 },
  { dia: 'Mar', clicks: 2800, gasto: 1120, conversiones: 112 },
  { dia: 'Mié', clicks: 3200, gasto: 1350, conversiones: 128 },
  { dia: 'Jue', clicks: 2600, gasto: 980, conversiones: 98 },
  { dia: 'Vie', clicks: 3800, gasto: 1580, conversiones: 152 },
  { dia: 'Sáb', clicks: 4200, gasto: 1780, conversiones: 168 },
  { dia: 'Dom', clicks: 3100, gasto: 1240, conversiones: 124 },
];

const keywords = [
  { kw: 'zapatillas running baratas', posicion: 1.2, clicks: 890, cpc: 0.28, conv: 45, qs: 9 },
  { kw: 'auriculares bluetooth buenos', posicion: 2.1, clicks: 640, cpc: 0.41, conv: 28, qs: 8 },
  { kw: 'comprar smartwatch online', posicion: 1.8, clicks: 510, cpc: 0.55, conv: 22, qs: 7 },
  { kw: 'mochila universitaria', posicion: 3.4, clicks: 380, cpc: 0.19, conv: 18, qs: 6 },
  { kw: 'silla ergonomica home office', posicion: 2.6, clicks: 290, cpc: 0.78, conv: 12, qs: 7 },
];

const kpis = [
  { label: 'Inversión Total (mes)', value: '$7.000', change: '+12% vs mes ant.', icon: DollarSign, color: '#3B82F6', up: true },
  { label: 'Clicks Totales', value: '22.6K', change: '+8% vs mes ant.', icon: MousePointer, color: ORANGE, up: true },
  { label: 'Impresiones', value: '518K', change: '+15% vs mes ant.', icon: Eye, color: '#8B5CF6', up: true },
  { label: 'ROAS Promedio', value: '5.9x', change: '+0.4 vs mes ant.', icon: TrendingUp, color: '#10B981', up: true },
];

export function GoogleAdsView({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'campanas' | 'keywords' | 'tendencias'>('campanas');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={TrendingUp}
        title="Google Ads"
        subtitle="Gestión de campañas · ROAS promedio 5.9x"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('marketing') },
          { label: '+ Nueva Campaña', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '22px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={20} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D', marginTop: 2 }}>{k.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#10B981', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ArrowUp size={10} />{k.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '20px', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'campanas' as const, label: '📢 Campañas' },
            { id: 'keywords' as const, label: '🔑 Keywords' },
            { id: 'tendencias' as const, label: '📈 Tendencias' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: activeTab === t.id ? '#fff' : 'transparent',
              color: activeTab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Campañas */}
        {activeTab === 'campanas' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Campaña', 'Estado', 'Presupuesto', 'Gastado', 'Clicks', 'CTR', 'CPC', 'Conv.', 'ROAS'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campanas.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{c.nombre}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: c.color === '#10B981' ? '#D1FAE5' : '#FEF3C7', color: c.color, padding: '2px 8px', borderRadius: '6px' }}>
                        {c.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>${c.presupuesto.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>${c.gastado.toLocaleString()}</div>
                        <div style={{ width: 60, height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${(c.gastado / c.presupuesto) * 100}%`, height: '100%', backgroundColor: ORANGE, borderRadius: 2 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{c.clicks.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{c.ctr}%</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>${c.cpc}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: '600', color: '#059669' }}>{c.conversiones}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: c.roas >= 5 ? '#059669' : c.roas >= 3 ? ORANGE : '#DC2626' }}>{c.roas}x</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Keywords */}
        {activeTab === 'keywords' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input placeholder="Buscar keywords..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Keyword', 'Posición', 'Clicks', 'CPC', 'Conv.', 'Quality Score'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{k.kw}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: '700', color: k.posicion <= 2 ? '#059669' : k.posicion <= 3 ? ORANGE : '#DC2626', fontSize: '0.9rem' }}>#{k.posicion}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{k.clicks.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>${k.cpc}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: '600', color: '#059669' }}>{k.conv}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: j < k.qs ? '#10B981' : '#E5E7EB' }} />
                        ))}
                        <span style={{ marginLeft: 6, fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>{k.qs}/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tendencias */}
        {activeTab === 'tendencias' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Clicks últimos 7 días</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tendenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Conversiones últimos 7 días</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={tendenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversiones" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
