/* =====================================================
   MetodosPagoView — Configuración de Pasarelas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { CreditCard, CheckCircle, AlertCircle, Settings, Eye, EyeOff, Zap } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const gateways = [
  { id: 'plexo', nombre: 'Plexo', logo: '🔷', desc: 'Orquestador Uruguay · OCA, Creditel, Abitab, RedPagos', activo: true, testMode: false, comision: '1.0%', categoria: 'Uruguay', color: '#1D4ED8' },
  { id: 'mercadopago', nombre: 'MercadoPago', logo: '💙', desc: 'Pago popular en Latinoamérica · Cuotas sin interés', activo: true, testMode: true, comision: '3.5%', categoria: 'Latam', color: '#00ADEF' },
  { id: 'paypal', nombre: 'PayPal', logo: '💛', desc: 'Pagos internacionales globales', activo: false, testMode: false, comision: '4.4% + $0.30', categoria: 'Global', color: '#003087' },
  { id: 'stripe', nombre: 'Stripe', logo: '🟣', desc: 'Plataforma de pagos developer-friendly', activo: true, testMode: false, comision: '2.9% + $0.30', categoria: 'Global', color: '#635BFF' },
  { id: 'transfer', nombre: 'Transferencia bancaria', logo: '🏦', desc: 'BROU, Santander, BBVA · Sin comisión', activo: true, testMode: false, comision: '0%', categoria: 'Manual', color: '#374151' },
  { id: 'efectivo', nombre: 'Efectivo / POS', logo: '💵', desc: 'Pago en persona, retiro en tienda o agente', activo: true, testMode: false, comision: '0%', categoria: 'Manual', color: '#059669' },
];

const categorias = ['Todos', 'Uruguay', 'Latam', 'Global', 'Manual'];

export function MetodosPagoView({ onNavigate }: Props) {
  const [filtro, setFiltro] = useState('Todos');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [activos, setActivos] = useState<Record<string, boolean>>(
    Object.fromEntries(gateways.map(g => [g.id, g.activo]))
  );

  const toggleActivo = (id: string) => setActivos(p => ({ ...p, [id]: !p[id] }));
  const toggleKey = (id: string) => setShowKey(p => ({ ...p, [id]: !p[id] }));

  const lista = filtro === 'Todos' ? gateways : gateways.filter(g => g.categoria === filtro);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={CreditCard}
        title="Métodos de Pago"
        subtitle="Configuración de pasarelas · Uruguay first · Latam progresivo"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '+ Agregar método', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Métodos activos', value: Object.values(activos).filter(Boolean).length, color: '#10B981' },
            { label: 'En modo test', value: gateways.filter(g => g.testMode).length, color: '#F59E0B' },
            { label: 'Comisión promedio', value: '1.9%', color: ORANGE },
            { label: 'Cobros Uruguay', value: '68%', color: '#3B82F6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6C757D', marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setFiltro(c)} style={{ padding: '5px 14px', borderRadius: '8px', border: `1px solid ${filtro === c ? ORANGE : '#E5E7EB'}`, backgroundColor: filtro === c ? `${ORANGE}10` : '#fff', color: filtro === c ? ORANGE : '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Lista de gateways */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {lista.map(g => (
            <div key={g.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `1px solid ${activos[g.id] ? '#E5E7EB' : '#F3F4F6'}`, padding: '20px', opacity: activos[g.id] ? 1 : 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: '2rem' }}>{g.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>{g.nombre}</span>
                    {g.testMode && (
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#D97706' }}>MODO TEST</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{g.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: '8px' }}>
                    Comisión: {g.comision}
                  </span>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={activos[g.id]} onChange={() => toggleActivo(g.id)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 12, backgroundColor: activos[g.id] ? '#10B981' : '#D1D5DB', transition: '0.3s' }} />
                    <span style={{ position: 'absolute', height: 18, width: 18, left: activos[g.id] ? 23 : 3, bottom: 3, backgroundColor: '#fff', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </label>
                </div>
              </div>

              {activos[g.id] && g.categoria !== 'Manual' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '10px' }}>
                  {[
                    { label: 'API Key / Client ID', placeholder: `pk_live_${g.id}_xxxxxxxxxxxx`, sensitive: true },
                    { label: 'API Secret / Client Secret', placeholder: 'sk_live_xxxxxxxxxxxx', sensitive: true },
                  ].map((field, i) => (
                    <div key={i}>
                      <label style={{ fontSize: '0.72rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 4 }}>{field.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showKey[`${g.id}-${i}`] ? 'text' : 'password'}
                          defaultValue={field.placeholder}
                          style={{ width: '100%', padding: '7px 32px 7px 10px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                        />
                        <button onClick={() => toggleKey(`${g.id}-${i}`)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          {showKey[`${g.id}-${i}`] ? <EyeOff size={13} color="#9CA3AF" /> : <Eye size={13} color="#9CA3AF" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activos[g.id] && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer' }}>
                    <Zap size={12} /> Test conexión
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer' }}>
                    <Settings size={12} /> Configurar checkout
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
