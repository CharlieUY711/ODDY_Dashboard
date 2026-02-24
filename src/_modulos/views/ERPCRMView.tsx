/* =====================================================
   ERPCRMView — CRM con Pipeline Kanban
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Users, TrendingUp, DollarSign, CheckCircle, Phone, Mail,
  Plus, BarChart2, Target, Clock, ChevronRight,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Deal {
  id: number;
  empresa: string;
  contacto: string;
  valor: number;
  probabilidad: number;
  dias: number;
  avatar: string;
  color: string;
  tag: string;
}

const stages: { id: string; label: string; color: string; deals: Deal[] }[] = [
  {
    id: 'prospecto', label: 'Prospecto', color: '#6B7280',
    deals: [
      { id: 1, empresa: 'Supermercados Rivera', contacto: 'Carlos Méndez', valor: 45000, probabilidad: 20, dias: 2, avatar: 'SR', color: '#6366F1', tag: 'Retail' },
      { id: 2, empresa: 'Agro Productos UY', contacto: 'María Torres', valor: 28000, probabilidad: 15, dias: 5, avatar: 'AP', color: '#8B5CF6', tag: 'Agro' },
    ],
  },
  {
    id: 'contactado', label: 'Contactado', color: '#3B82F6',
    deals: [
      { id: 3, empresa: 'Farmacia Central', contacto: 'Ana Lima', valor: 12000, probabilidad: 40, dias: 8, avatar: 'FC', color: '#0EA5E9', tag: 'Salud' },
      { id: 4, empresa: 'Tech Solutions UY', contacto: 'Diego Pérez', valor: 89000, probabilidad: 35, dias: 3, avatar: 'TS', color: '#06B6D4', tag: 'Tech' },
    ],
  },
  {
    id: 'propuesta', label: 'Propuesta', color: '#F59E0B',
    deals: [
      { id: 5, empresa: 'Construcciones Norte', contacto: 'Roberto López', valor: 156000, probabilidad: 60, dias: 14, avatar: 'CN', color: '#F59E0B', tag: 'Construcción' },
      { id: 6, empresa: 'Moda & Style SA', contacto: 'Valentina Cruz', valor: 34000, probabilidad: 55, dias: 7, avatar: 'MS', color: '#EC4899', tag: 'Moda' },
    ],
  },
  {
    id: 'negociacion', label: 'Negociación', color: '#8B5CF6',
    deals: [
      { id: 7, empresa: 'Importadora Platino', contacto: 'Juan Suárez', valor: 220000, probabilidad: 75, dias: 21, avatar: 'IP', color: '#7C3AED', tag: 'Importación' },
    ],
  },
  {
    id: 'ganado', label: '✅ Ganado', color: '#10B981',
    deals: [
      { id: 8, empresa: 'Distribuidora Omega', contacto: 'Laura Gómez', valor: 78000, probabilidad: 100, dias: 45, avatar: 'DO', color: '#10B981', tag: 'Distribución' },
      { id: 9, empresa: 'Hotel Boutique MD', contacto: 'Sofía Ramos', valor: 42000, probabilidad: 100, dias: 30, avatar: 'HB', color: '#059669', tag: 'Hotelería' },
    ],
  },
];

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E9ECEF',
      padding: '14px', cursor: 'pointer', marginBottom: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: deal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#fff' }}>{deal.avatar}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '700', color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.empresa}</p>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>{deal.contacto}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>${deal.valor.toLocaleString()}</span>
        <span style={{ fontSize: '0.7rem', color: deal.color, backgroundColor: `${deal.color}14`, padding: '2px 7px', borderRadius: '5px', fontWeight: '700' }}>{deal.tag}</span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Probabilidad</span>
          <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#374151' }}>{deal.probabilidad}%</span>
        </div>
        <div style={{ height: 4, backgroundColor: '#F3F4F6', borderRadius: '2px' }}>
          <div style={{ width: `${deal.probabilidad}%`, height: '100%', borderRadius: '2px', backgroundColor: deal.probabilidad >= 70 ? '#10B981' : deal.probabilidad >= 40 ? '#F59E0B' : '#6B7280' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Clock size={11} color="#9CA3AF" />
        <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{deal.dias} días en etapa</span>
      </div>
    </div>
  );
}

export function ERPCRMView({ onNavigate }: Props) {
  const totalPipeline = stages.flatMap(s => s.deals).reduce((a, d) => a + d.valor, 0);
  const totalDeals = stages.flatMap(s => s.deals).length;
  const ganados = stages.find(s => s.id === 'ganado')?.deals || [];
  const winRate = Math.round((ganados.length / totalDeals) * 100);

  const kpis = [
    { label: 'Pipeline Total', value: `$${(totalPipeline / 1000).toFixed(0)}k`, icon: DollarSign, color: ORANGE },
    { label: 'Deals Activos', value: `${totalDeals}`, icon: Target, color: '#3B82F6' },
    { label: 'Tasa de Cierre', value: `${winRate}%`, icon: CheckCircle, color: '#10B981' },
    { label: 'Ticket Promedio', value: `$${Math.round(totalPipeline / totalDeals / 1000)}k`, icon: BarChart2, color: '#8B5CF6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Users}
        title="CRM"
        subtitle="Pipeline de ventas Kanban · Contactos y seguimiento"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nuevo Deal', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={19} color={k.color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280' }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: '1.45rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Pipeline */}
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
          {stages.map(stage => (
            <div key={stage.id} style={{ minWidth: 230, flex: '0 0 230px' }}>
              {/* Stage header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: stage.color }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#374151' }}>{stage.label}</span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {stage.deals.length}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: '600' }}>
                  ${stage.deals.reduce((a, d) => a + d.valor, 0).toLocaleString()}
                </span>
              </div>

              {/* Column */}
              <div style={{ backgroundColor: '#EDEFF2', borderRadius: '12px', padding: '12px', minHeight: 200 }}>
                {stage.deals.map(deal => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                <button style={{
                  width: '100%', padding: '8px', borderRadius: '8px',
                  border: '1.5px dashed #D1D5DB', backgroundColor: 'transparent',
                  color: '#9CA3AF', fontSize: '0.78rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  <Plus size={13} /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actividad reciente */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: '700', color: '#111827' }}>Actividad Reciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '📞', text: 'Llamada con Importadora Platino — Juan Suárez', time: 'Hace 1 hora', user: 'Por vos' },
              { icon: '📧', text: 'Propuesta enviada a Construcciones Norte', time: 'Hace 3 horas', user: 'Por vos' },
              { icon: '✅', text: 'Deal cerrado: Distribuidora Omega $78,000', time: 'Ayer', user: 'Por Laura G.' },
              { icon: '🤝', text: 'Reunión agendada con Tech Solutions UY', time: 'Ayer', user: 'Por vos' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: i < 3 ? '10px' : 0, borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151' }}>{a.text}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>{a.time} · {a.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
