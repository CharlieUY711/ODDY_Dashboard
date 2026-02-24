import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Plug, CreditCard, Truck, Store, Smartphone, Settings2, Globe,
  CheckCircle, BarChart2, Zap, TrendingUp, Shield, Package, Users,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function IntegracionesView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const cards: HubCardDef[] = [
    {
      id: 'integraciones-pagos', icon: CreditCard, onClick: nav('integraciones-pagos'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: '🇺🇾 Uruguay · 🌎 Global', label: 'Pasarela de Pagos',
      description: 'Plexo, OCA, Creditel, Abitab, RedPagos, Mercado Pago, PayPal, Stripe. Plexo recomendado para Uruguay.',
      stats: [{ icon: CreditCard, value: '8', label: 'Proveedores' }, { icon: CheckCircle, value: '0', label: 'Conectadas' }, { icon: Shield, value: 'UY', label: 'Foco inicial' }],
    },
    {
      id: 'integraciones-logistica', icon: Truck, onClick: nav('integraciones-logistica'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: '🇺🇾 Uruguay · 🇦🇷 Argentina', label: 'Logística',
      description: 'Correo UY, OCA, Brixo, Mosca, PedidosYa, Fedex, DHL, Andreani y más. Soporte sin API.',
      stats: [{ icon: Truck, value: '13', label: 'Proveedores' }, { icon: CheckCircle, value: '0', label: 'Conectadas' }, { icon: Package, value: 'UY', label: 'Foco inicial' }],
    },
    {
      id: 'integraciones-tiendas', icon: Store, onClick: nav('integraciones-tiendas'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: '🇺🇾 Uruguay · 🌎 Global', label: 'Tiendas',
      description: 'Mercado Libre, TiendaNube, WooCommerce, Shopify, VTEX, Magento. Sincronización bidireccional.',
      stats: [{ icon: Store, value: '7', label: 'Proveedores' }, { icon: CheckCircle, value: '0', label: 'Conectadas' }, { icon: TrendingUp, value: '2w', label: 'Sincronización' }],
    },
    {
      id: 'integraciones-rrss', icon: Smartphone, onClick: nav('integraciones-rrss'),
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', color: '#EC4899',
      badge: '🌎 Global', label: 'Redes Sociales',
      description: 'Meta Business, Instagram Shopping, WhatsApp Business, TikTok Shop, Pinterest. Catálogo en redes.',
      stats: [{ icon: Smartphone, value: '6', label: 'Proveedores' }, { icon: CheckCircle, value: '0', label: 'Conectadas' }, { icon: Users, value: '—', label: 'Audiencia' }],
    },
    {
      id: 'integraciones-servicios', icon: Settings2, onClick: nav('integraciones-servicios'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: '🌎 Global', label: 'Servicios',
      description: 'Twilio, Resend, SendGrid, Google Analytics, Zapier, n8n, Slack. Comunicaciones y automatizaciones.',
      stats: [{ icon: Settings2, value: '8', label: 'Proveedores' }, { icon: CheckCircle, value: '0', label: 'Conectadas' }, { icon: Zap, value: '—', label: 'Automatizadas' }],
    },
    {
      id: 'integraciones-apis', icon: Globe, onClick: nav('integraciones-apis'),
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)', color: '#0EA5E9',
      badge: '🌎 Global · Catálogo centralizado', label: 'Repositorio de APIs',
      description: 'Catálogo centralizado — 23 APIs disponibles con estado, credenciales, documentación y test en vivo.',
      stats: [{ icon: Globe, value: '23', label: 'APIs catalogadas' }, { icon: CheckCircle, value: '1', label: 'Conectadas' }, { icon: BarChart2, value: '—', label: 'Llamadas/día' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: Store,     label: 'App Marketplace',    desc: 'Instalación de apps en un clic'       },
    { icon: Zap,       label: 'Webhooks custom',    desc: 'Webhooks personalizados por evento'   },
    { icon: Shield,    label: 'Sandbox testing',    desc: 'Entorno de pruebas por integración'   },
    { icon: BarChart2, label: 'Health por API',     desc: 'Monitoreo de salud por integración'   },
  ];

  const intro = (
    <div style={{ padding: '12px 18px', backgroundColor: '#FFF4F0', border: '1.5px solid rgba(255,104,53,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '1.2rem' }}>🇺🇾</span>
      <div>
        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#111827' }}>Uruguay First</span>
        <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '8px' }}>
          Empezamos por los proveedores del mercado uruguayo y expandimos progresivamente a Argentina, Brasil y Latam.
        </span>
      </div>
    </div>
  );

  return (
    <HubView
      hubIcon={Plug}
      title="Integraciones"
      subtitle="Conectá tu stack — Uruguay first · Expansión Latam progresiva · 65 proveedores"
      sections={[{ cards }]}
      intro={intro}
      comingSoon={comingSoon}
      comingSoonText="Marketplace de apps con instalación en un clic, webhooks personalizados, sandbox de testing y monitoreo de salud por integración."
    />
  );
}
