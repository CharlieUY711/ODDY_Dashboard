/* =====================================================
   EnviosView — Seguimiento de Envíos Multi-tramo
   Árbol PedidoMadre → EnvíosHijos · Estados · Timeline
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Truck, Package, CheckCircle, Clock, AlertCircle, MapPin, ChevronDown, ChevronRight, Search, Filter, Eye } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const estadoColor: Record<string, { bg: string; color: string }> = {
  nuevo:     { bg: '#F3F4F6', color: '#6B7280' },
  preparando:{ bg: `${ORANGE}15`, color: ORANGE },
  en_camino: { bg: '#DBEAFE', color: '#1D4ED8' },
  entregado: { bg: '#D1FAE5', color: '#059669' },
  devolucion:{ bg: '#FEE2E2', color: '#DC2626' },
  demorado:  { bg: '#FEF3C7', color: '#D97706' },
};

const envios = [
  {
    id: 'ORD-8841', cliente: 'Ana García', avatar: 'AG', color: ORANGE, fecha: '2026-02-24', total: 18450,
    hijos: [
      { id: 'ENV-8841-A', carrier: 'OCA', tracking: 'OCA9823712', estado: 'en_camino', destino: 'Av. Rivera 1240, Mvd', items: 3, eta: 'Hoy 16:00' },
      { id: 'ENV-8841-B', carrier: 'Correo UY', tracking: '-', estado: 'preparando', destino: 'Ruta 8 km 22, Canelones', items: 2, eta: 'Mañana' },
    ],
  },
  {
    id: 'ORD-8840', cliente: 'Carlos Rodríguez', avatar: 'CR', color: '#3B82F6', fecha: '2026-02-24', total: 3240,
    hijos: [
      { id: 'ENV-8840-A', carrier: 'Brixo', tracking: 'BX445512', estado: 'entregado', destino: 'Paysandú 890, Canelones', items: 2, eta: 'Entregado' },
    ],
  },
  {
    id: 'ORD-8839', cliente: 'María López', avatar: 'ML', color: '#8B5CF6', fecha: '2026-02-23', total: 42100,
    hijos: [
      { id: 'ENV-8839-A', carrier: 'OCA', tracking: 'OCA9820100', estado: 'entregado', destino: 'Colonia 450, Mvd', items: 5, eta: 'Entregado' },
      { id: 'ENV-8839-B', carrier: 'OCA', tracking: 'OCA9820101', estado: 'demorado', destino: 'Colonia 456, Mvd', items: 4, eta: 'Demorado' },
    ],
  },
  {
    id: 'ORD-8837', cliente: 'Laura Martínez', avatar: 'LM', color: '#EC4899', fecha: '2026-02-22', total: 8900,
    hijos: [
      { id: 'ENV-8837-A', carrier: 'Mosca', tracking: 'MOZ98234', estado: 'nuevo', destino: 'Maldonado 1210, Mvd', items: 3, eta: '25 Feb' },
    ],
  },
];

const timelineEstados = [
  { estado: 'Pedido recibido', hora: '09:14', icono: '📦', completado: true },
  { estado: 'En preparación', hora: '10:32', icono: '📋', completado: true },
  { estado: 'Retirado por OCA', hora: '14:20', icono: '🚛', completado: true },
  { estado: 'En centro de distribución', hora: '17:45', icono: '🏭', completado: true },
  { estado: 'En reparto', hora: 'Hoy 08:30', icono: '🚴', completado: true },
  { estado: 'Entregado', hora: 'Pendiente', icono: '✅', completado: false },
];

const kpis = [
  { label: 'En Tránsito', value: '42', color: '#3B82F6', icon: Truck },
  { label: 'Entregados Hoy', value: '18', color: '#10B981', icon: CheckCircle },
  { label: 'Con Demora', value: '5', color: '#D97706', icon: AlertCircle },
  { label: 'Para Preparar', value: '12', color: ORANGE, icon: Package },
];

export function EnviosView({ onNavigate }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['ORD-8841']));
  const [selected, setSelected] = useState<string | null>('ENV-8841-A');
  const [search, setSearch] = useState('');

  const toggle = (id: string) => setExpanded(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Truck}
        title="Seguimiento de Envíos"
        subtitle="Multi-tramo · Tracking en tiempo real · OCA · Brixo · Correo UY"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '+ Nuevo Envío', primary: true },
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
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Lista árbol */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pedido o tracking..." style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', fontSize: '0.8rem', cursor: 'pointer', color: '#374151', whiteSpace: 'nowrap' }}>
                <Filter size={13} /> Filtrar
              </button>
            </div>
            <div>
              {envios.filter(e => e.id.includes(search) || e.cliente.toLowerCase().includes(search.toLowerCase())).map(pedido => (
                <div key={pedido.id}>
                  {/* Fila madre */}
                  <div onClick={() => toggle(pedido.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' }}>
                    <div style={{ color: '#9CA3AF' }}>{expanded.has(pedido.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: pedido.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{pedido.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.85rem' }}>{pedido.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{pedido.cliente} · ${pedido.total.toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{pedido.hijos.length} envíos</div>
                  </div>

                  {/* Hijos */}
                  {expanded.has(pedido.id) && pedido.hijos.map(hijo => {
                    const s = estadoColor[hijo.estado] ?? estadoColor.nuevo;
                    return (
                      <div key={hijo.id} onClick={() => setSelected(hijo.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 10px 44px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB', backgroundColor: selected === hijo.id ? `${ORANGE}06` : 'transparent' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '8px', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Truck size={13} color={s.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.83rem' }}>{hijo.id}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{hijo.carrier} · {hijo.tracking}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: s.bg, color: s.color }}>{hijo.estado.replace('_', ' ')}</span>
                          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 2 }}>{hijo.eta}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline detalle */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', alignSelf: 'flex-start' }}>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 6 }}>ENV-8841-A</div>
            <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: 16 }}>OCA · OCA9823712</div>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#F9FAFB', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <MapPin size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8rem', color: '#374151' }}>Av. Rivera 1240, Montevideo</div>
              </div>
            </div>
            <div style={{ fontWeight: '600', color: '#374151', marginBottom: 12, fontSize: '0.85rem' }}>Timeline</div>
            {timelineEstados.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < timelineEstados.length - 1 ? 4 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: t.completado ? '#D1FAE5' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {t.completado ? <CheckCircle size={13} color="#059669" /> : <span style={{ fontSize: '0.7rem' }}>{t.icono}</span>}
                  </div>
                  {i < timelineEstados.length - 1 && <div style={{ width: 2, height: 20, backgroundColor: t.completado ? '#10B981' : '#E5E7EB', margin: '3px 0' }} />}
                </div>
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.82rem', color: t.completado ? '#1A1A2E' : '#9CA3AF' }}>{t.estado}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{t.hora}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
