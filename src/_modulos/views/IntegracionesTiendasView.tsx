/* =====================================================
   IntegracionesTiendasView — Marketplaces y Plataformas
   ML · TiendaNube · Shopify · WooCommerce · VTEX
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Store, RefreshCw, Package, TrendingUp, CheckCircle, Settings, Zap, ArrowLeftRight } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const plataformas = [
  { nombre: 'Mercado Libre', logo: '💛', conectado: true, productos: 284, ventas: 1240, sincronizado: '2026-02-24 14:00', tipo: 'Marketplace', desc: 'Sincronización bidireccional · Catálogo + pedidos', config: ['API key', 'Seller ID', 'Webhook URL'] },
  { nombre: 'TiendaNube', logo: '☁️', conectado: true, productos: 310, ventas: 890, sincronizado: '2026-02-24 13:45', tipo: 'eCommerce', desc: 'Tienda online principal · Sincronización automática', config: ['API key', 'Store ID'] },
  { nombre: 'Shopify', logo: '🟢', conectado: false, productos: 0, ventas: 0, sincronizado: '—', tipo: 'eCommerce', desc: 'Plataforma global líder en eCommerce', config: ['Shop URL', 'API key', 'API Secret'] },
  { nombre: 'WooCommerce', logo: '🟣', conectado: false, productos: 0, ventas: 0, sincronizado: '—', tipo: 'eCommerce', desc: 'Plugin WordPress · Alta personalización', config: ['Site URL', 'Consumer key', 'Secret'] },
  { nombre: 'VTEX', logo: '🔵', conectado: false, productos: 0, ventas: 0, sincronizado: '—', tipo: 'Enterprise', desc: 'Plataforma enterprise para grandes retailers', config: ['Account name', 'API key', 'API Token'] },
  { nombre: 'Magento', logo: '🟠', conectado: false, productos: 0, ventas: 0, sincronizado: '—', tipo: 'eCommerce', desc: 'Open source · Máxima flexibilidad', config: ['Base URL', 'Access token'] },
];

const syncLogs = [
  { plataforma: 'Mercado Libre', tipo: 'stock_update', detalle: '284 productos → stock actualizado', hora: '14:00:12', ok: true },
  { plataforma: 'TiendaNube', tipo: 'order_sync', detalle: '3 nuevos pedidos sincronizados', hora: '13:55:30', ok: true },
  { plataforma: 'Mercado Libre', tipo: 'price_update', detalle: 'Error: token expirado', hora: '13:45:00', ok: false },
  { plataforma: 'TiendaNube', tipo: 'product_sync', detalle: '12 productos actualizados', hora: '13:30:00', ok: true },
];

export function IntegracionesTiendasView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'plataformas' | 'sync'>('plataformas');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Store}
        title="Integraciones Tiendas"
        subtitle="Marketplaces y plataformas · Sincronización bidireccional"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '🔄 Sync Todo', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Tiendas conectadas', value: plataformas.filter(p => p.conectado).length, color: '#10B981' },
            { label: 'Productos sincronizados', value: plataformas.reduce((a, p) => a + p.productos, 0), color: ORANGE },
            { label: 'Ventas externas (mes)', value: plataformas.reduce((a, p) => a + p.ventas, 0).toLocaleString(), color: '#3B82F6' },
            { label: 'Última sync', value: 'Hace 15 min', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[{ id: 'plataformas' as const, label: '🏪 Plataformas' }, { id: 'sync' as const, label: '🔄 Log de Sync' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'plataformas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {plataformas.map((p, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `1px solid ${p.conectado ? '#E5E7EB' : '#F3F4F6'}`, padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.6rem' }}>{p.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{p.nombre}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.tipo} · {p.desc.substring(0, 40)}...</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: p.conectado ? '#D1FAE5' : '#F3F4F6', color: p.conectado ? '#059669' : '#9CA3AF' }}>
                    {p.conectado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {p.conectado && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>PRODUCTOS</div>
                      <div style={{ fontWeight: '700', color: ORANGE }}>{p.productos}</div>
                    </div>
                    <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>VENTAS/MES</div>
                      <div style={{ fontWeight: '700', color: '#10B981' }}>{p.ventas}</div>
                    </div>
                  </div>
                )}
                {p.conectado && (
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 10 }}>Última sync: {p.sincronizado}</div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {p.conectado ? (
                    <>
                      <button style={{ flex: 1, padding: '7px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <RefreshCw size={12} /> Sync ahora
                      </button>
                      <button style={{ flex: 1, padding: '7px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Settings size={12} /> Config
                      </button>
                    </>
                  ) : (
                    <button style={{ flex: 1, padding: '8px', borderRadius: '7px', border: `1px solid ${ORANGE}`, backgroundColor: `${ORANGE}10`, color: ORANGE, fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      Conectar {p.nombre} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sync' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            {syncLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < syncLogs.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <span style={{ fontSize: '1.1rem' }}>{log.ok ? '✅' : '❌'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>{log.plataforma} — {log.tipo.replace('_', ' ')}</div>
                  <div style={{ fontSize: '0.75rem', color: log.ok ? '#9CA3AF' : '#DC2626' }}>{log.detalle}</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{log.hora}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
