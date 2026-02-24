/* =====================================================
   PersonasView — Base de Personas Naturales
   Perfiles unificados · Roles · Historial
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { User, Search, Plus, Edit2, Eye, Phone, Mail, MapPin, Tag, Filter } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const personas = [
  { id: 1, nombre: 'Ana García', dni: '4.321.890', email: 'ana.garcia@email.com', tel: '+598 91 234 567', ciudad: 'Montevideo', roles: ['Cliente', 'VIP'], avatar: 'AG', color: ORANGE, interacciones: 28, ultimaCompra: '2026-02-24', gasto: 42100 },
  { id: 2, nombre: 'Carlos Rodríguez', dni: '3.456.789', email: 'carlos.r@email.com', tel: '+598 98 765 432', ciudad: 'Canelones', roles: ['Cliente'], avatar: 'CR', color: '#3B82F6', interacciones: 12, ultimaCompra: '2026-02-22', gasto: 18200 },
  { id: 3, nombre: 'María López', dni: '2.890.123', email: 'maria.l@empresa.uy', tel: '+598 94 321 098', ciudad: 'Montevideo', roles: ['Cliente', 'Proveedor'], avatar: 'ML', color: '#8B5CF6', interacciones: 42, ultimaCompra: '2026-02-20', gasto: 98400 },
  { id: 4, nombre: 'Roberto Fernández', dni: '5.234.567', email: 'r.fernandez@corp.com', tel: '+598 92 456 789', ciudad: 'Salto', roles: ['Empleado', 'Cliente'], avatar: 'RF', color: '#10B981', interacciones: 8, ultimaCompra: '2026-02-10', gasto: 8900 },
  { id: 5, nombre: 'Laura Martínez', dni: '4.123.456', email: 'laura.m@gmail.com', tel: '+598 99 876 543', ciudad: 'Maldonado', roles: ['Cliente', 'VIP'], avatar: 'LM', color: '#EC4899', interacciones: 34, ultimaCompra: '2026-02-18', gasto: 56200 },
  { id: 6, nombre: 'Diego Pérez', dni: '3.789.012', email: 'd.perez@outlook.com', tel: '+598 91 234 876', ciudad: 'Montevideo', roles: ['Proveedor'], avatar: 'DP', color: '#6B7280', interacciones: 6, ultimaCompra: '—', gasto: 0 },
];

const roleColors: Record<string, { bg: string; color: string }> = {
  Cliente:   { bg: `${ORANGE}15`, color: ORANGE },
  VIP:       { bg: '#FEF3C7', color: '#D97706' },
  Empleado:  { bg: '#DBEAFE', color: '#1D4ED8' },
  Proveedor: { bg: '#D1FAE5', color: '#059669' },
};

export function PersonasView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState('Todos');
  const [selected, setSelected] = useState<number | null>(1);
  const [view, setView] = useState<'grid' | 'table'>('table');

  const roles = ['Todos', 'Cliente', 'VIP', 'Empleado', 'Proveedor'];
  const lista = personas.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchRol = rolFiltro === 'Todos' || p.roles.includes(rolFiltro);
    return matchSearch && matchRol;
  });

  const persona = personas.find(p => p.id === selected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={User}
        title="Personas"
        subtitle="Base de personas naturales · Roles · Historial de interacciones"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nueva Persona', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18, flexShrink: 0 }}>
          {[
            { label: 'Total personas', value: personas.length, color: '#3B82F6' },
            { label: 'Clientes activos', value: personas.filter(p => p.roles.includes('Cliente')).length, color: ORANGE },
            { label: 'VIP', value: personas.filter(p => p.roles.includes('VIP')).length, color: '#F59E0B' },
            { label: 'Con compras', value: personas.filter(p => p.gasto > 0).length, color: '#10B981' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '14px 18px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexShrink: 0 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o DNI..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {roles.map(r => (
              <button key={r} onClick={() => setRolFiltro(r)} style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${rolFiltro === r ? ORANGE : '#E5E7EB'}`, backgroundColor: rolFiltro === r ? `${ORANGE}10` : '#fff', color: rolFiltro === r ? ORANGE : '#374151', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Lista */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Persona', 'Roles', 'Ciudad', 'Interacciones', 'Última compra', 'Gasto total', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lista.map(p => (
                  <tr key={p.id} onClick={() => setSelected(p.id)} style={{ borderTop: '1px solid #F3F4F6', cursor: 'pointer', backgroundColor: selected === p.id ? `${ORANGE}06` : 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{p.avatar}</div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{p.nombre}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.roles.map(r => {
                          const rc = roleColors[r] ?? { bg: '#F3F4F6', color: '#374151' };
                          return <span key={r} style={{ fontSize: '0.65rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', backgroundColor: rc.bg, color: rc.color }}>{r}</span>;
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.83rem', color: '#374151' }}>{p.ciudad}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151', textAlign: 'center' }}>{p.interacciones}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{p.ultimaCompra}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: p.gasto > 0 ? ORANGE : '#9CA3AF' }}>{p.gasto > 0 ? `$${p.gasto.toLocaleString()}` : '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.75rem', color: '#6B7280' }}>
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detalle persona */}
          {persona && (
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'auto', padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: persona.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: '0 auto 10px' }}>{persona.avatar}</div>
                <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1.05rem' }}>{persona.nombre}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>DNI: {persona.dni}</div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                  {persona.roles.map(r => {
                    const rc = roleColors[r] ?? { bg: '#F3F4F6', color: '#374151' };
                    return <span key={r} style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: rc.bg, color: rc.color }}>{r}</span>;
                  })}
                </div>
              </div>
              {[
                { icon: Mail, label: persona.email },
                { icon: Phone, label: persona.tel },
                { icon: MapPin, label: persona.ciudad },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <item.icon size={14} color="#9CA3AF" />
                  <span style={{ fontSize: '0.83rem', color: '#374151' }}>{item.label}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: ORANGE, fontSize: '1.3rem' }}>{persona.interacciones}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Interacciones</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: '#10B981', fontSize: '1.1rem' }}>${persona.gasto.toLocaleString()}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Total gastado</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
