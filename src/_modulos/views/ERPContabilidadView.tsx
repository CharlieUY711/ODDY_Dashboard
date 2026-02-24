/* =====================================================
   ERPContabilidadView — Contabilidad / Plan de Cuentas
   Asientos · Balance · P&L · Bancos
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { BarChart2, DollarSign, TrendingUp, TrendingDown, Building2, Plus, Search, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const cuentas = [
  { codigo: '1.1.01', nombre: 'Caja', tipo: 'activo', saldo: 24800, movs: 142 },
  { codigo: '1.1.02', nombre: 'Banco BROU cc', tipo: 'activo', saldo: 384200, movs: 89 },
  { codigo: '1.1.03', nombre: 'Banco Santander', tipo: 'activo', saldo: 142600, movs: 64 },
  { codigo: '1.2.01', nombre: 'Inventario productos', tipo: 'activo', saldo: 890000, movs: 218 },
  { codigo: '1.3.01', nombre: 'Cuentas a cobrar', tipo: 'activo', saldo: 124800, movs: 34 },
  { codigo: '2.1.01', nombre: 'Proveedores', tipo: 'pasivo', saldo: -312400, movs: 48 },
  { codigo: '2.1.02', nombre: 'IVA a pagar', tipo: 'pasivo', saldo: -42000, movs: 12 },
  { codigo: '3.1.01', nombre: 'Capital social', tipo: 'patrimonio', saldo: -500000, movs: 2 },
  { codigo: '4.1.01', nombre: 'Ventas', tipo: 'ingreso', saldo: -1240000, movs: 424 },
  { codigo: '5.1.01', nombre: 'Costo de Ventas', tipo: 'gasto', saldo: 680000, movs: 218 },
  { codigo: '5.2.01', nombre: 'Sueldos y jornales', tipo: 'gasto', saldo: 124800, movs: 12 },
  { codigo: '5.3.01', nombre: 'Publicidad y marketing', tipo: 'gasto', saldo: 48200, movs: 28 },
];

const asientos = [
  { id: 'A-2026-0421', fecha: '2026-02-24', concepto: 'Venta ORD-8841 · Visa Plexo', debe: 18450, haber: 18450, estado: 'confirmado' },
  { id: 'A-2026-0420', fecha: '2026-02-24', concepto: 'Pago sueldos Febrero', debe: 42000, haber: 42000, estado: 'confirmado' },
  { id: 'A-2026-0419', fecha: '2026-02-23', concepto: 'Compra inventario OC-2026-014', debe: 89000, haber: 89000, estado: 'confirmado' },
  { id: 'A-2026-0418', fecha: '2026-02-23', concepto: 'Venta ORD-8840 · MercadoPago', debe: 3240, haber: 3240, estado: 'borrador' },
  { id: 'A-2026-0417', fecha: '2026-02-22', concepto: 'Pago publicidad Google Ads', debe: 7800, haber: 7800, estado: 'confirmado' },
];

const pyLData = [
  { mes: 'Sep', ingresos: 920000, gastos: 680000 }, { mes: 'Oct', ingresos: 1080000, gastos: 740000 },
  { mes: 'Nov', ingresos: 1340000, gastos: 890000 }, { mes: 'Dic', ingresos: 1920000, gastos: 1240000 },
  { mes: 'Ene', ingresos: 1120000, gastos: 780000 }, { mes: 'Feb', ingresos: 1240000, gastos: 852000 },
];

const kpis = [
  { label: 'Ingresos Febrero', value: '$1.24M', color: '#10B981', icon: TrendingUp },
  { label: 'Gastos Febrero', value: '$852K', color: '#EF4444', icon: TrendingDown },
  { label: 'Resultado Neto', value: '$388K', color: ORANGE, icon: BarChart2 },
  { label: 'Saldo Bancos', value: '$527K', color: '#3B82F6', icon: Building2 },
];

const tipoColor: Record<string, string> = {
  activo: '#3B82F6', pasivo: '#EF4444', patrimonio: '#8B5CF6', ingreso: '#10B981', gasto: '#D97706',
};

export function ERPContabilidadView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'cuentas' | 'asientos' | 'pyl'>('cuentas');
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  const cuentasFiltradas = tipoFiltro === 'todos' ? cuentas : cuentas.filter(c => c.tipo === tipoFiltro);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={BarChart2}
        title="Contabilidad"
        subtitle="Plan de cuentas · Asientos · Balance · P&L"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nuevo Asiento', primary: true },
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
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[{ id: 'cuentas' as const, label: '📖 Plan de Cuentas' }, { id: 'asientos' as const, label: '📝 Asientos' }, { id: 'pyl' as const, label: '📊 P&L' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'cuentas' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['todos', 'activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto'].map(t => (
                <button key={t} onClick={() => setTipoFiltro(t)} style={{ padding: '4px 12px', borderRadius: '7px', border: `1px solid ${tipoFiltro === t ? (tipoColor[t] ?? ORANGE) : '#E5E7EB'}`, backgroundColor: tipoFiltro === t ? `${(tipoColor[t] ?? ORANGE)}15` : '#fff', color: tipoFiltro === t ? (tipoColor[t] ?? ORANGE) : '#374151', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    {['Código', 'Cuenta', 'Tipo', 'Saldo', 'Movimientos'].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cuentasFiltradas.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: '0.83rem', color: '#9CA3AF' }}>{c.codigo}</td>
                      <td style={{ padding: '11px 14px', fontWeight: '600', color: '#1A1A2E' }}>{c.nombre}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: `${tipoColor[c.tipo]}15`, color: tipoColor[c.tipo] }}>{c.tipo}</span>
                      </td>
                      <td style={{ padding: '11px 14px', fontWeight: '700', color: c.saldo >= 0 ? '#1A1A2E' : '#DC2626' }}>
                        ${Math.abs(c.saldo).toLocaleString()}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '0.85rem', color: '#9CA3AF' }}>{c.movs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'asientos' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Asiento', 'Fecha', 'Concepto', 'Debe', 'Haber', 'Estado'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {asientos.map((a, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1A1A2E', fontSize: '0.83rem' }}>{a.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{a.fecha}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{a.concepto}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#374151' }}>${a.debe.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#374151' }}>${a.haber.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: a.estado === 'confirmado' ? '#D1FAE5' : '#FEF3C7', color: a.estado === 'confirmado' ? '#059669' : '#D97706' }}>{a.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'pyl' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Ingresos vs Gastos — Últimos 6 meses</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pyLData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="ingresos" fill="#10B981" radius={[4, 4, 0, 0]} name="Ingresos" />
                  <Bar dataKey="gastos" fill="#EF4444" radius={[4, 4, 0, 0]} name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Ingresos Febrero', value: '$1.240.000', color: '#10B981' },
                { label: 'Costo de Ventas', value: '- $680.000', color: '#EF4444' },
                { label: 'Ganancia Bruta', value: '$560.000', color: '#3B82F6' },
                { label: 'Gastos Operativos', value: '- $172.000', color: '#EF4444' },
                { label: 'Resultado Neto', value: '$388.000', color: ORANGE },
              ].map((item, i, arr) => (
                <div key={i} style={{ padding: '14px 16px', backgroundColor: '#fff', borderRadius: '10px', border: `1px solid ${i === arr.length - 1 ? `${ORANGE}40` : '#E5E7EB'}`, borderLeft: i === arr.length - 1 ? `4px solid ${ORANGE}` : undefined }}>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{item.label}</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: item.color, marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
