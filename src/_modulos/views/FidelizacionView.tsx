/* =====================================================
   FidelizacionView — Programa de Fidelización
   Niveles: Bronce / Plata / Oro / Platino
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Target, Users, Star, Gift, TrendingUp, Search, ChevronRight, Award, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const niveles = [
  { nombre: 'Bronce', emoji: '🥉', color: '#CD7F32', minPuntos: 0, maxPuntos: 999, beneficio: '5% descuento', cantidad: 3240, porcentaje: 58 },
  { nombre: 'Plata', emoji: '🥈', color: '#9CA3AF', minPuntos: 1000, maxPuntos: 4999, beneficio: '10% + envío gratis', cantidad: 1580, porcentaje: 28 },
  { nombre: 'Oro', emoji: '🥇', color: '#F59E0B', minPuntos: 5000, maxPuntos: 19999, beneficio: '15% + acceso anticipado', cantidad: 560, porcentaje: 10 },
  { nombre: 'Platino', emoji: '💎', color: '#8B5CF6', minPuntos: 20000, maxPuntos: Infinity, beneficio: '20% + atención VIP', cantidad: 220, porcentaje: 4 },
];

const clientes = [
  { nombre: 'María López', avatar: 'ML', color: '#8B5CF6', nivel: 'Platino', puntos: 24800, gastado: 89200, canje: 12, ult: '2026-02-22' },
  { nombre: 'Ana García', avatar: 'AG', color: ORANGE, nivel: 'Oro', puntos: 8420, gastado: 42100, canje: 6, ult: '2026-02-24' },
  { nombre: 'Roberto Fernández', avatar: 'RF', color: '#10B981', nivel: 'Oro', puntos: 6100, gastado: 38500, canje: 4, ult: '2026-02-20' },
  { nombre: 'Carlos Rodríguez', avatar: 'CR', color: '#3B82F6', nivel: 'Plata', puntos: 2340, gastado: 18200, canje: 3, ult: '2026-02-18' },
  { nombre: 'Laura Martínez', avatar: 'LM', color: '#EC4899', nivel: 'Plata', puntos: 1890, gastado: 12600, canje: 2, ult: '2026-02-15' },
  { nombre: 'Diego Pérez', avatar: 'DP', color: '#6B7280', nivel: 'Bronce', puntos: 450, gastado: 3200, canje: 1, ult: '2026-02-10' },
];

const canjesData = [
  { mes: 'Sep', canjes: 42 }, { mes: 'Oct', canjes: 65 }, { mes: 'Nov', canjes: 89 },
  { mes: 'Dic', canjes: 124 }, { mes: 'Ene', canjes: 78 }, { mes: 'Feb', canjes: 96 },
];

const pieData = niveles.map(n => ({ name: n.nombre, value: n.cantidad, color: n.color }));

const kpis = [
  { label: 'Miembros Activos', value: '5.600', icon: Users, color: '#3B82F6' },
  { label: 'Puntos Emitidos', value: '2.8M', icon: Star, color: '#F59E0B' },
  { label: 'Canjes Realizados', value: '494', icon: Gift, color: ORANGE },
  { label: 'Retención +6 meses', value: '78%', icon: TrendingUp, color: '#10B981' },
];

const colorNivel: Record<string, string> = { Bronce: '#CD7F32', Plata: '#9CA3AF', Oro: '#F59E0B', Platino: '#8B5CF6' };

export function FidelizacionView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'overview' | 'clientes' | 'config'>('overview');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Target}
        title="Programa de Fidelización"
        subtitle="Puntos · Niveles · Recompensas automáticas"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('marketing') },
          { label: '+ Nueva Recompensa', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={20} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D', marginTop: 2 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'overview' as const, label: '📊 Overview' },
            { id: 'clientes' as const, label: '👥 Miembros' },
            { id: 'config' as const, label: '⚙️ Config. Niveles' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Distribución por Nivel</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Canjes por Mes</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={canjesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="canjes" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {niveles.map((n, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${n.color}30`, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>{n.emoji}</span>
                    <div>
                      <div style={{ fontWeight: '800', color: n.color }}>{n.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{n.minPuntos.toLocaleString()}{n.maxPuntos !== Infinity ? `–${n.maxPuntos.toLocaleString()}` : '+'} pts</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A1A2E' }}>{n.cantidad.toLocaleString()}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>miembros ({n.porcentaje}%)</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#374151', backgroundColor: `${n.color}10`, padding: '6px 10px', borderRadius: '6px' }}>
                  ✅ {n.beneficio}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'clientes' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar miembro..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Miembro', 'Nivel', 'Puntos', 'Total Gastado', 'Canjes', 'Última Actividad'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientes.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#fff' }}>{c.avatar}</div>
                        <span style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{c.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: colorNivel[c.nivel], backgroundColor: `${colorNivel[c.nivel]}15`, padding: '2px 8px', borderRadius: '6px' }}>{c.nivel}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#1A1A2E' }}>{c.puntos.toLocaleString()} pts</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151' }}>${c.gastado.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151' }}>{c.canje}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9CA3AF' }}>{c.ult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'config' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {niveles.map((n, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${n.color}40`, padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: '2rem' }}>{n.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: n.color }}>{n.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                      {n.maxPuntos === Infinity ? `+${n.minPuntos.toLocaleString()} puntos` : `${n.minPuntos.toLocaleString()} – ${n.maxPuntos.toLocaleString()} puntos`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.4rem', color: n.color }}>{n.porcentaje}%</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{n.cantidad.toLocaleString()} miembros</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 3 }}>BENEFICIO PRINCIPAL</div>
                    <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.88rem' }}>{n.beneficio}</div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 3 }}>MULTIPLICADOR DE PUNTOS</div>
                    <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.88rem' }}>{1 + i * 0.25}x por $1 gastado</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
