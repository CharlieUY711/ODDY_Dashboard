/* =====================================================
   ClientesView — Gestión de Clientes / Compradores
   ===================================================== */
import React, { useState, useMemo } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  ShoppingBag, Users, TrendingUp, Star, Search, Filter,
  ChevronDown, MoreHorizontal, Mail, Phone, MapPin, Eye,
  ShoppingCart, DollarSign, Tag, Download, UserPlus,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const clientes = [
  { id: 1, nombre: 'Ana García', email: 'ana.garcia@email.com', telefono: '+598 91 234 567', ciudad: 'Montevideo', segmento: 'VIP', estado: 'activo', pedidos: 47, ltv: 18450, ultimoPedido: '2026-02-20', avatar: 'AG', tags: ['VIP', 'Mayorista'] },
  { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.r@email.com', telefono: '+598 92 345 678', ciudad: 'Canelones', segmento: 'Regular', estado: 'activo', pedidos: 12, ltv: 3240, ultimoPedido: '2026-02-18', avatar: 'CR', tags: ['Regular'] },
  { id: 3, nombre: 'María López', email: 'maria.l@empresa.uy', telefono: '+598 94 567 890', ciudad: 'Montevideo', segmento: 'VIP', estado: 'activo', pedidos: 89, ltv: 42100, ultimoPedido: '2026-02-22', avatar: 'ML', tags: ['VIP', 'Corporativo'] },
  { id: 4, nombre: 'Juan Pérez', email: 'jperez@gmail.com', telefono: '+598 99 678 901', ciudad: 'Maldonado', segmento: 'Nuevo', estado: 'activo', pedidos: 2, ltv: 580, ultimoPedido: '2026-02-15', avatar: 'JP', tags: ['Nuevo'] },
  { id: 5, nombre: 'Sofía Martínez', email: 'sofia.m@email.com', telefono: '+598 98 789 012', ciudad: 'Salto', segmento: 'Regular', estado: 'inactivo', pedidos: 8, ltv: 2100, ultimoPedido: '2025-11-10', avatar: 'SM', tags: ['Regular', 'Inactivo'] },
  { id: 6, nombre: 'Roberto Fernández', email: 'r.fernandez@corp.com', telefono: '+598 93 890 123', ciudad: 'Montevideo', segmento: 'VIP', estado: 'activo', pedidos: 63, ltv: 28900, ultimoPedido: '2026-02-21', avatar: 'RF', tags: ['VIP', 'Mayorista'] },
  { id: 7, nombre: 'Laura Díaz', email: 'laura.diaz@email.com', telefono: '+598 97 901 234', ciudad: 'Paysandú', segmento: 'Regular', estado: 'activo', pedidos: 19, ltv: 5670, ultimoPedido: '2026-02-10', avatar: 'LD', tags: ['Regular'] },
  { id: 8, nombre: 'Diego Sánchez', email: 'diegosanchez@mail.com', telefono: '+598 96 012 345', ciudad: 'Rivera', segmento: 'Nuevo', estado: 'activo', pedidos: 1, ltv: 320, ultimoPedido: '2026-02-24', avatar: 'DS', tags: ['Nuevo'] },
  { id: 9, nombre: 'Valentina Torres', email: 'v.torres@empresa.com', telefono: '+598 95 123 456', ciudad: 'Montevideo', segmento: 'VIP', estado: 'activo', pedidos: 34, ltv: 15800, ultimoPedido: '2026-02-19', avatar: 'VT', tags: ['VIP'] },
  { id: 10, nombre: 'Andrés Vargas', email: 'andres.v@gmail.com', telefono: '+598 91 234 999', ciudad: 'Colonia', segmento: 'Regular', estado: 'inactivo', pedidos: 5, ltv: 1290, ultimoPedido: '2025-09-05', avatar: 'AV', tags: ['Regular'] },
];

const segmentColors: Record<string, { bg: string; color: string }> = {
  VIP: { bg: '#FEF3C7', color: '#D97706' },
  Regular: { bg: '#EFF6FF', color: '#3B82F6' },
  Nuevo: { bg: '#F0FDF4', color: '#16A34A' },
  Corporativo: { bg: '#F5F3FF', color: '#7C3AED' },
};

const estadoColors: Record<string, { bg: string; color: string }> = {
  activo: { bg: '#D1FAE5', color: '#059669' },
  inactivo: { bg: '#F3F4F6', color: '#9CA3AF' },
};

export function ClientesView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [segFilter, setSegFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const kpis = [
    { label: 'Total Clientes', value: '1,248', change: '+34', up: true, icon: Users, color: '#3B82F6' },
    { label: 'Clientes VIP', value: '89', change: '+5', up: true, icon: Star, color: '#D97706' },
    { label: 'Nuevos (mes)', value: '34', change: '+12%', up: true, icon: UserPlus, color: '#10B981' },
    { label: 'LTV Promedio', value: '$11,834', change: '+8.3%', up: true, icon: DollarSign, color: ORANGE },
  ];

  const filtered = useMemo(() => {
    return clientes.filter(c => {
      const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase())
        || c.email.toLowerCase().includes(search.toLowerCase())
        || c.ciudad.toLowerCase().includes(search.toLowerCase());
      const matchSeg = segFilter === 'Todos' || c.segmento === segFilter;
      const matchEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
      return matchSearch && matchSeg && matchEstado;
    });
  }, [search, segFilter, estadoFilter]);

  const pill = (label: string, color: string, bg: string) => (
    <span style={{ fontSize: '0.7rem', fontWeight: '700', color, backgroundColor: bg, padding: '2px 8px', borderRadius: '6px' }}>
      {label}
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ShoppingBag}
        title="Clientes"
        subtitle="Compradores y segmentación de clientes · eCommerce"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '+ Nuevo Cliente', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.icon size={18} color={k.color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: k.up ? '#059669' : '#EF4444', backgroundColor: k.up ? '#D1FAE5' : '#FEE2E2', padding: '2px 7px', borderRadius: '5px' }}>
                  {k.change}
                </span>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#6B7280' }}>{k.label}</p>
              <p style={{ margin: 0, fontSize: '1.55rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Barra de búsqueda + filtros */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F9FAFB', borderRadius: '9px', border: '1px solid #E5E7EB', padding: '8px 14px' }}>
            <Search size={15} color="#9CA3AF" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o ciudad..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.83rem', color: '#374151', width: '100%' }}
            />
          </div>
          <select
            value={segFilter}
            onChange={e => setSegFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '9px', border: '1px solid #E5E7EB', fontSize: '0.82rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
          >
            {['Todos', 'VIP', 'Regular', 'Nuevo'].map(v => <option key={v}>{v}</option>)}
          </select>
          <select
            value={estadoFilter}
            onChange={e => setEstadoFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '9px', border: '1px solid #E5E7EB', fontSize: '0.82rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
          >
            {['Todos', 'activo', 'inactivo'].map(v => <option key={v}>{v}</option>)}
          </select>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: '9px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.82rem', cursor: 'pointer' }}>
            <Download size={14} /> Exportar
          </button>
        </div>

        {/* Tabla */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>
              Mostrando <strong style={{ color: '#374151' }}>{filtered.length}</strong> de {clientes.length} clientes
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Cliente', 'Contacto', 'Ciudad', 'Segmento', 'Estado', 'Pedidos', 'LTV', 'Último Pedido', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const seg = segmentColors[c.segmento] || { bg: '#F3F4F6', color: '#6B7280' };
                const est = estadoColors[c.estado] || { bg: '#F3F4F6', color: '#9CA3AF' };
                return (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${ORANGE} 0%, #ff8c42 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff' }}>{c.avatar}</span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{c.nombre}</p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9CA3AF' }}>ID #{c.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '0.78rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={11} color="#9CA3AF" /> {c.email}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.73rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={11} color="#9CA3AF" /> {c.telefono}
                      </p>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} color="#9CA3AF" /> {c.ciudad}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {pill(c.segmento, seg.color, seg.bg)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {pill(c.estado === 'activo' ? 'Activo' : 'Inactivo', est.color, est.bg)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ShoppingCart size={13} color={ORANGE} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{c.pedidos}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>
                        ${c.ltv.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{c.ultimoPedido}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Eye size={12} /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Segmentación */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '20px' }}>
          {[
            { label: 'VIP', count: 89, pct: 7, color: '#D97706', bg: '#FEF3C7', desc: 'LTV promedio $23,400' },
            { label: 'Regular', count: 743, pct: 60, color: '#3B82F6', bg: '#EFF6FF', desc: 'LTV promedio $4,200' },
            { label: 'Nuevo', count: 416, pct: 33, color: '#10B981', bg: '#F0FDF4', desc: '1–3 pedidos realizados' },
          ].map((seg, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: seg.color, backgroundColor: seg.bg, padding: '3px 10px', borderRadius: '6px' }}>{seg.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827' }}>{seg.count}</span>
              </div>
              <div style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${seg.pct}%`, height: '100%', backgroundColor: seg.color, borderRadius: '3px' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.73rem', color: '#9CA3AF' }}>{seg.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
