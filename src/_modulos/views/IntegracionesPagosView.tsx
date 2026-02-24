/* =====================================================
   IntegracionesPagosView — Pasarelas de Cobro
   Uruguay (Plexo, OCA, Creditel, Abitab, RedPagos) + Global
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { CreditCard, CheckCircle, XCircle, Zap, Eye, EyeOff, Settings } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const grupos = [
  {
    titulo: '🇺🇾 Uruguay — Plexo',
    descripcion: 'Orquestador de pagos uruguayo · Integra OCA, Creditel, Abitab y más',
    pasarelas: [
      { nombre: 'Plexo', desc: 'Orquestador principal · Tarjetas UY', conectado: true, comision: '1.0%', color: '#1D4ED8', logo: '🔷' },
      { nombre: 'OCA', desc: 'Tarjeta de crédito · Cuotas sin interés', conectado: true, comision: '2.1%', color: '#1D4ED8', logo: '💳' },
      { nombre: 'Creditel', desc: 'Financiera uruguaya · Alta tasa de aprobación', conectado: true, comision: '2.4%', color: '#059669', logo: '🟢' },
      { nombre: 'Abitab', desc: 'Pagos en efectivo · Red de cobro', conectado: false, comision: '1.5%', color: '#6B7280', logo: '🏪' },
      { nombre: 'RedPagos', desc: 'Red nacional de cobro en efectivo', conectado: false, comision: '1.8%', color: '#EF4444', logo: '🔴' },
    ],
  },
  {
    titulo: '🌎 Latam',
    descripcion: 'Plataformas populares en América Latina',
    pasarelas: [
      { nombre: 'MercadoPago', desc: 'Pago en cuotas · App · QR', conectado: true, comision: '3.5%', color: '#00ADEF', logo: '💙' },
      { nombre: 'PayPal', desc: 'Internacional · Cuentas globales', conectado: false, comision: '4.4%+$0.30', color: '#003087', logo: '💛' },
    ],
  },
  {
    titulo: '🌍 Global',
    descripcion: 'Plataformas de pagos internacionales',
    pasarelas: [
      { nombre: 'Stripe', desc: 'Developer-friendly · API moderna', conectado: true, comision: '2.9%+$0.30', color: '#635BFF', logo: '🟣' },
    ],
  },
];

export function IntegracionesPagosView({ onNavigate }: Props) {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={CreditCard}
        title="Integraciones de Pagos"
        subtitle="Pasarelas Uruguay · Latam · Global · Plexo · MercadoPago · Stripe"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '⚙️ Config. Checkout', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Pasarelas activas', value: grupos.flatMap(g => g.pasarelas).filter(p => p.conectado).length, color: '#10B981' },
            { label: 'Disponibles', value: grupos.flatMap(g => g.pasarelas).length, color: '#3B82F6' },
            { label: 'Cobros hoy', value: '$74.2K', color: ORANGE },
            { label: 'Tasa aprobación', value: '97.4%', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {grupos.map((grupo, gi) => (
          <div key={gi} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '1rem' }}>{grupo.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{grupo.descripcion}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
              {grupo.pasarelas.map((p, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `1px solid ${p.conectado ? '#E5E7EB' : '#F3F4F6'}`, padding: '18px', opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '1.6rem' }}>{p.logo}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{p.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{p.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: p.conectado ? '#D1FAE5' : '#F3F4F6', color: p.conectado ? '#059669' : '#9CA3AF' }}>
                      {p.conectado ? '✅ Activo' : '⭕ Inactivo'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: p.conectado ? 12 : 0 }}>
                    <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Comisión: <strong style={{ color: ORANGE }}>{p.comision}</strong></span>
                  </div>
                  {p.conectado && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Zap size={12} /> Test
                      </button>
                      <button style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Settings size={12} /> Config
                      </button>
                    </div>
                  )}
                  {!p.conectado && (
                    <button style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${p.color}`, backgroundColor: `${p.color}10`, color: p.color, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                      Conectar →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
