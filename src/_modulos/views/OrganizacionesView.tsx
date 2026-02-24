/* =====================================================
   OrganizacionesView — Empresas y Organizaciones
   Jerarquía · Contactos · Historial comercial
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Building2, Search, Plus, Users, DollarSign, Mail, Phone, Globe, MapPin } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const organizaciones = [
  { id: 1, nombre: 'Tech Solutions UY', rut: '21.234.567-0', tipo: 'Cliente B2B', sector: 'Tecnología', contacto: 'Diego Pérez', email: 'diego@techsolutions.uy', tel: '+598 2 345 6789', ciudad: 'Montevideo', empleados: 45, compras: 24, volumen: 189000, activo: true, avatar: 'TS', color: '#3B82F6' },
  { id: 2, nombre: 'Supermercados Rivera', rut: '12.345.678-9', tipo: 'Cliente B2B', sector: 'Retail', contacto: 'Carlos Méndez', email: 'ventas@suprivera.com', tel: '+598 7 234 5678', ciudad: 'Rivera', empleados: 280, compras: 18, volumen: 420000, activo: true, avatar: 'SR', color: '#10B981' },
  { id: 3, nombre: 'Farmacia Central SA', rut: '23.456.789-1', tipo: 'Cliente B2B', sector: 'Salud', contacto: 'Ana Lima', email: 'ana@farmaciacentral.uy', tel: '+598 2 987 6543', ciudad: 'Montevideo', empleados: 32, compras: 12, volumen: 98000, activo: true, avatar: 'FC', color: '#8B5CF6' },
  { id: 4, nombre: 'Importadora Platino', rut: '34.567.890-2', tipo: 'Proveedor', sector: 'Importación', contacto: 'Juan Suárez', email: 'jsuarez@platino.uy', tel: '+598 2 678 9012', ciudad: 'Montevideo', empleados: 18, compras: 8, volumen: 340000, activo: true, avatar: 'IP', color: '#F59E0B' },
  { id: 5, nombre: 'Constructora Norte SRL', rut: '45.678.901-3', tipo: 'Cliente B2B', sector: 'Construcción', contacto: 'Roberto López', email: 'r.lopez@construnorte.com', tel: '+598 4 567 8901', ciudad: 'Salto', empleados: 120, compras: 6, volumen: 156000, activo: false, avatar: 'CN', color: '#EF4444' },
];

const sectores = ['Todos', 'Tecnología', 'Retail', 'Salud', 'Importación', 'Construcción'];
const tipos = ['Todos', 'Cliente B2B', 'Proveedor'];

export function OrganizacionesView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [sectorFiltro, setSectorFiltro] = useState('Todos');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [selected, setSelected] = useState<number | null>(1);

  const org = organizaciones.find(o => o.id === selected);
  const lista = organizaciones.filter(o => {
    const matchSearch = o.nombre.toLowerCase().includes(search.toLowerCase()) || o.rut.includes(search);
    const matchSector = sectorFiltro === 'Todos' || o.sector === sectorFiltro;
    const matchTipo = tipoFiltro === 'Todos' || o.tipo === tipoFiltro;
    return matchSearch && matchSector && matchTipo;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Building2}
        title="Organizaciones"
        subtitle="Empresas y entidades registradas · CRM B2B"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nueva Organización', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18, flexShrink: 0 }}>
          {[
            { label: 'Organizaciones', value: organizaciones.length, color: '#3B82F6', icon: Building2 },
            { label: 'Clientes B2B', value: organizaciones.filter(o => o.tipo === 'Cliente B2B').length, color: ORANGE, icon: Users },
            { label: 'Proveedores', value: organizaciones.filter(o => o.tipo === 'Proveedor').length, color: '#10B981', icon: Building2 },
            { label: 'Volumen Total', value: '$1.2M', color: '#8B5CF6', icon: DollarSign },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexShrink: 0 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o RUT..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none' }} />
          </div>
          {tipos.map(t => (
            <button key={t} onClick={() => setTipoFiltro(t)} style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${tipoFiltro === t ? ORANGE : '#E5E7EB'}`, backgroundColor: tipoFiltro === t ? `${ORANGE}10` : '#fff', color: tipoFiltro === t ? ORANGE : '#374151', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'auto' }}>
            {lista.map(o => (
              <div key={o.id} onClick={() => setSelected(o.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', backgroundColor: selected === o.id ? `${ORANGE}05` : 'transparent', opacity: o.activo ? 1 : 0.6 }}>
                <div style={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{o.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{o.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>RUT {o.rut} · {o.sector} · {o.ciudad}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: ORANGE, fontSize: '0.9rem' }}>${(o.volumen / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{o.compras} compras</div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: o.tipo === 'Proveedor' ? '#D1FAE5' : `${ORANGE}15`, color: o.tipo === 'Proveedor' ? '#059669' : ORANGE, whiteSpace: 'nowrap' }}>
                  {o.tipo}
                </span>
              </div>
            ))}
          </div>

          {org && (
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'auto', padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{ width: 56, height: 56, borderRadius: '14px', backgroundColor: org.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: '0 auto 10px' }}>{org.avatar}</div>
                <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>{org.nombre}</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>RUT {org.rut}</div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: org.tipo === 'Proveedor' ? '#D1FAE5' : `${ORANGE}15`, color: org.tipo === 'Proveedor' ? '#059669' : ORANGE, display: 'inline-block', marginTop: 6 }}>
                  {org.tipo}
                </span>
              </div>
              {[
                { icon: Users, label: `Contacto: ${org.contacto}` },
                { icon: Mail, label: org.email },
                { icon: Phone, label: org.tel },
                { icon: MapPin, label: org.ciudad },
                { icon: Building2, label: `${org.empleados} empleados · ${org.sector}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <item.icon size={14} color="#9CA3AF" />
                  <span style={{ fontSize: '0.82rem', color: '#374151' }}>{item.label}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: ORANGE, fontSize: '1.3rem' }}>{org.compras}</div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Compras</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: '#10B981', fontSize: '1.1rem' }}>${(org.volumen / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Volumen</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
