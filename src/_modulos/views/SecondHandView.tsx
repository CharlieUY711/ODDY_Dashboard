/* =====================================================
   SecondHandView — Marketplace de Segunda Mano
   Moderación · Publicaciones · Mediación
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { RefreshCw, Package, Users, DollarSign, AlertTriangle, Search, CheckCircle, XCircle, Eye, MessageCircle, Star } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const publicaciones = [
  { id: 'PUB-001', titulo: 'iPhone 14 Pro 256GB Gris', vendedor: 'Ana García', precio: 28000, categoria: 'Electrónica', estado: 'pendiente', fecha: '2026-02-24', imgs: 4, condicion: 'Muy bueno' },
  { id: 'PUB-002', titulo: 'Bicicleta MTB Full 29"', vendedor: 'Carlos López', precio: 15000, categoria: 'Deportes', estado: 'aprobada', fecha: '2026-02-23', imgs: 6, condicion: 'Bueno' },
  { id: 'PUB-003', titulo: 'Sofá 3 cuerpos beige', vendedor: 'María Sosa', precio: 12000, categoria: 'Hogar', estado: 'aprobada', fecha: '2026-02-22', imgs: 3, condicion: 'Excelente' },
  { id: 'PUB-004', titulo: 'Zapatillas Nike Air Max 42', vendedor: 'Diego Pérez', precio: 3500, categoria: 'Calzado', estado: 'rechazada', fecha: '2026-02-21', imgs: 2, condicion: 'Regular', razon: 'Fotos insuficientes' },
  { id: 'PUB-005', titulo: 'Notebook HP 15" i5 SSD', vendedor: 'Laura Fernández', precio: 22000, categoria: 'Electrónica', estado: 'pendiente', fecha: '2026-02-24', imgs: 5, condicion: 'Muy bueno' },
];

const mediaciones = [
  { id: 'MED-001', comprador: 'Roberto Fernández', vendedor: 'Ana García', producto: 'iPhone 14 Pro', monto: 28000, motivo: 'Producto diferente a descripción', estado: 'abierta', fecha: '2026-02-23' },
  { id: 'MED-002', comprador: 'Diego Pérez', vendedor: 'Carlos López', producto: 'Bicicleta MTB', monto: 15000, motivo: 'Retraso en envío', estado: 'en_proceso', fecha: '2026-02-20' },
  { id: 'MED-003', comprador: 'Ana García', vendedor: 'Marcos Silva', producto: 'Cámara Sony', monto: 8500, motivo: 'Vendedor no responde', estado: 'resuelta', fecha: '2026-02-15' },
];

const kpis = [
  { label: 'Publicaciones Activas', value: '284', color: '#3B82F6', icon: Package },
  { label: 'Pendientes de Revisión', value: '12', color: ORANGE, icon: AlertTriangle },
  { label: 'Vendedores Activos', value: '89', color: '#10B981', icon: Users },
  { label: 'Volumen del Mes', value: '$840K', color: '#8B5CF6', icon: DollarSign },
];

const estadoColor: Record<string, { bg: string; color: string }> = {
  pendiente:  { bg: '#FEF3C7', color: '#D97706' },
  aprobada:   { bg: '#D1FAE5', color: '#059669' },
  rechazada:  { bg: '#FEE2E2', color: '#DC2626' },
  abierta:    { bg: '#FEE2E2', color: '#DC2626' },
  en_proceso: { bg: '#DBEAFE', color: '#1D4ED8' },
  resuelta:   { bg: '#D1FAE5', color: '#059669' },
};

export function SecondHandView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'moderacion' | 'publicaciones' | 'mediaciones'>('moderacion');
  const [filtro, setFiltro] = useState('todos');

  const pendientes = publicaciones.filter(p => p.estado === 'pendiente');
  const aprobadas = publicaciones.filter(p => p.estado === 'aprobada');
  const rechazadas = publicaciones.filter(p => p.estado === 'rechazada');
  const lista = filtro === 'pendiente' ? pendientes : filtro === 'aprobada' ? aprobadas : filtro === 'rechazada' ? rechazadas : publicaciones;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={RefreshCw}
        title="Segunda Mano"
        subtitle="Marketplace de artículos usados · Moderación · Chat · Mediación"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '⚙️ Configurar', primary: true },
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
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[{ id: 'moderacion' as const, label: '🔍 Moderación' }, { id: 'publicaciones' as const, label: '📦 Publicaciones' }, { id: 'mediaciones' as const, label: '⚖️ Mediaciones' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'moderacion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {pendientes.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #FEF3C7', padding: '18px 20px', display: 'flex', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '2rem' }}>
                  {p.categoria === 'Electrónica' ? '💻' : p.categoria === 'Deportes' ? '🚴' : '🛋️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 3 }}>{p.titulo}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: 6 }}>Por {p.vendedor} · {p.condicion} · {p.imgs} fotos · {p.fecha}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: ORANGE }}>${p.precio.toLocaleString()}</span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', alignSelf: 'center' }}>Pendiente</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignSelf: 'center', flexShrink: 0 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', border: 'none', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#059669', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <CheckCircle size={14} /> Aprobar
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', border: 'none', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <XCircle size={14} /> Rechazar
                  </button>
                  <button style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}>
                    <Eye size={14} color="#6B7280" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'publicaciones' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['todos', 'pendiente', 'aprobada', 'rechazada'].map(f => (
                <button key={f} onClick={() => setFiltro(f)} style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${filtro === f ? ORANGE : '#E5E7EB'}`, backgroundColor: filtro === f ? `${ORANGE}10` : '#fff', color: filtro === f ? ORANGE : '#374151', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'todos' ? `(${publicaciones.length})` : f === 'pendiente' ? `(${pendientes.length})` : f === 'aprobada' ? `(${aprobadas.length})` : `(${rechazadas.length})`}
                </button>
              ))}
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    {['Publicación', 'Vendedor', 'Categoría', 'Precio', 'Estado', 'Fecha'].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.map(p => {
                    const s = estadoColor[p.estado];
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{p.titulo}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{p.vendedor}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '6px' }}>{p.categoria}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: ORANGE }}>${p.precio.toLocaleString()}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>{p.estado}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{p.fecha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'mediaciones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mediaciones.map(m => {
              const s = estadoColor[m.estado];
              return (
                <div key={m.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#1A1A2E' }}>{m.id}</span>
                      <span style={{ fontSize: '0.78rem', color: '#9CA3AF', marginLeft: 8 }}>{m.fecha}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>{m.estado.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E', marginBottom: 6 }}>{m.producto} — ${m.monto.toLocaleString()}</div>
                  <div style={{ fontSize: '0.82rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 10px', borderRadius: '6px', marginBottom: 10 }}>⚠️ {m.motivo}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: '#9CA3AF' }}>
                    <span>🛒 Comprador: {m.comprador}</span>
                    <span>|</span>
                    <span>📦 Vendedor: {m.vendedor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
