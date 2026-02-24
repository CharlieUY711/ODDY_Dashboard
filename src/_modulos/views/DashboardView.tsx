import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { HubCardGrid, HubCardDef } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import { IdeaQuickModal } from '@/app/components/admin/IdeaQuickModal';
import {
  LayoutDashboard, ShoppingCart, Megaphone, Database,
  Truck, Wrench, Settings, Lightbulb, TrendingUp,
  Package, Users, BarChart2, Plug, CheckSquare,
  DollarSign, Activity, Map,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const PIE_COLORS = [ORANGE, '#1F2937', '#6B7280', '#9CA3AF'];

export function DashboardView({ onNavigate }: Props) {
  const [timeRange, setTimeRange] = useState('7d');
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const nav = (s: MainSection) => () => onNavigate(s);

  /* ── KPIs ── */
  const kpis = [
    { label: 'Ventas del Día',     value: '$48,532', change: '+12.5%', up: true,  icon: '💰' },
    { label: 'Pedidos Activos',    value: '127',     change: '+8.2%',  up: true,  icon: '📦' },
    { label: 'Clientes Nuevos',    value: '34',      change: '-3.1%',  up: false, icon: '👥' },
    { label: 'Tasa de Conversión', value: '3.24%',   change: '+0.8%',  up: true,  icon: '🎯' },
  ];

  const salesData = [
    { mes: 'Ene', ventas: 45000, pedidos: 234 },
    { mes: 'Feb', ventas: 52000, pedidos: 267 },
    { mes: 'Mar', ventas: 48000, pedidos: 251 },
    { mes: 'Abr', ventas: 61000, pedidos: 312 },
    { mes: 'May', ventas: 55000, pedidos: 289 },
    { mes: 'Jun', ventas: 67000, pedidos: 334 },
    { mes: 'Jul', ventas: 72000, pedidos: 378 },
  ];

  const topProducts = [
    { name: 'Producto A', sales: 4500, pct: 35 },
    { name: 'Producto B', sales: 3200, pct: 25 },
    { name: 'Producto C', sales: 2800, pct: 22 },
    { name: 'Producto D', sales: 1500, pct: 12 },
    { name: 'Otros',      sales: 800,  pct: 6  },
  ];

  const categoryData = [
    { name: 'Electrónica', value: 4200 },
    { name: 'Ropa',        value: 3100 },
    { name: 'Hogar',       value: 2400 },
    { name: 'Deportes',    value: 1800 },
  ];

  const activity = [
    { icon: '📦', text: 'Nuevo pedido #8834 — Juan Pérez',   time: 'Hace 2 min'  },
    { icon: '💳', text: 'Pago recibido $2,340',              time: 'Hace 5 min'  },
    { icon: '👤', text: 'Nuevo cliente registrado',          time: 'Hace 12 min' },
    { icon: '⚠️', text: 'Alerta: Stock bajo en Producto X', time: 'Hace 18 min' },
    { icon: '🚚', text: 'Pedido #8833 enviado',              time: 'Hace 25 min' },
  ];

  /* ── Cards de módulos principales ── */
  const moduleCards: HubCardDef[] = [
    {
      id: 'ecommerce', icon: ShoppingCart, onClick: nav('ecommerce'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Comercial', label: 'eCommerce',
      description: 'Pedidos, pagos, catálogo, clientes, envíos y storefront multi-país.',
      stats: [{ icon: ShoppingCart, value: '127', label: 'Pedidos activos' }, { icon: DollarSign, value: '$48k', label: 'Ventas hoy' }, { icon: TrendingUp, value: '+12%', label: 'Crecimiento' }],
    },
    {
      id: 'marketing', icon: Megaphone, onClick: nav('marketing'),
      gradient: 'linear-gradient(135deg, #E1306C 0%, #833AB4 100%)', color: '#E1306C',
      badge: 'Marketing', label: 'Marketing',
      description: 'Campañas, email, RRSS, rueda de sorteos y programa de fidelización.',
      stats: [{ icon: Users, value: '—', label: 'Suscriptores' }, { icon: TrendingUp, value: '—', label: 'CTR' }, { icon: Megaphone, value: '—', label: 'Campañas' }],
    },
    {
      id: 'gestion', icon: Database, onClick: nav('gestion'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'ERP · CRM', label: 'Gestión',
      description: 'ERP completo: inventario, facturación, compras, RRHH, CRM y proyectos.',
      stats: [{ icon: Package, value: '—', label: 'Productos' }, { icon: Users, value: '—', label: 'Clientes' }, { icon: BarChart2, value: '—', label: 'Facturas' }],
    },
    {
      id: 'logistica', icon: Truck, onClick: nav('logistica'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Logística', label: 'Logística',
      description: 'Envíos, rutas, transportistas, fulfillment, producción y abastecimiento.',
      stats: [{ icon: Truck, value: '—', label: 'Envíos activos' }, { icon: Map, value: '—', label: 'Rutas' }, { icon: Package, value: '—', label: 'OA pendientes' }],
    },
    {
      id: 'herramientas', icon: Wrench, onClick: nav('herramientas'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Herramientas', label: 'Suite de Herramientas',
      description: '6 workspaces + 3 herramientas rápidas. Editor, OCR, QR, docs y más.',
      stats: [{ icon: Activity, value: '6', label: 'Workspaces' }, { icon: Wrench, value: '3', label: 'Herramientas' }, { icon: CheckSquare, value: '100%', label: 'Browser' }],
    },
    {
      id: 'integraciones', icon: Plug, onClick: nav('integraciones'),
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', color: '#14B8A6',
      badge: 'Integraciones', label: 'Integraciones',
      description: 'Pagos, logística, tiendas, RRSS, servicios y repositorio de APIs.',
      stats: [{ icon: Plug, value: '6', label: 'Módulos' }, { icon: CheckSquare, value: '1', label: 'Conectadas' }, { icon: Settings, value: '65', label: 'Disponibles' }],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>

      {/* ── Header blanco ── */}
      <div style={{ padding: '22px 32px 18px', backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #ff8c42 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LayoutDashboard size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1A1A2E' }}>Dashboard</h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6C757D' }}>
              Charlie Marketplace Builder v1.5 · Sistema de Gestión Enterprise
            </p>
          </div>
          {/* Botón Ideas */}
          <button
            onClick={() => setShowIdeaModal(true)}
            title="Nueva Idea"
            style={{
              width: 38, height: 38, borderRadius: '50%',
              border: `2px solid ${ORANGE}40`,
              backgroundColor: showIdeaModal ? `${ORANGE}15` : `${ORANGE}08`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${ORANGE}20`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = showIdeaModal ? `${ORANGE}15` : `${ORANGE}08`)}
          >
            <Lightbulb size={17} color={ORANGE} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {showIdeaModal && (
        <IdeaQuickModal
          onClose={() => setShowIdeaModal(false)}
          onOpenBoard={() => { setShowIdeaModal(false); onNavigate('ideas-board'); }}
        />
      )}

      {/* ── Contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.75rem' }}>{k.icon}</span>
                <span style={{
                  fontSize: '0.78rem', fontWeight: '700',
                  color: k.up ? '#10B981' : '#EF4444',
                  backgroundColor: k.up ? '#D1FAE5' : '#FEE2E2',
                  padding: '3px 9px', borderRadius: '6px',
                }}>{k.change}</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: '0 0 4px' }}>{k.label}</p>
              <p style={{ color: '#111827', fontSize: '1.75rem', fontWeight: '800', margin: 0, lineHeight: 1 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Line chart */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Ventas Mensuales</h3>
              <select value={timeRange} onChange={e => setTimeRange(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.78rem', outline: 'none' }}>
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.78rem' }} />
                <Line type="monotone" dataKey="ventas" stroke={ORANGE} strokeWidth={3} dot={{ fill: ORANGE, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Pedidos por Mes</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.78rem' }} />
                <Bar dataKey="pedidos" fill={ORANGE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom analytics row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {/* Top products */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Productos Top</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topProducts.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: '600' }}>{p.name}</span>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>${p.sales.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.pct}%`, height: '100%', backgroundColor: ORANGE, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Por Categoría</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {categoryData.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#111827', fontWeight: '700' }}>${c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Actividad Reciente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '0.78rem', color: '#374151' }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: '14px', width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#6B7280', fontSize: '0.78rem', cursor: 'pointer' }}>
              Ver todas las actividades
            </button>
          </div>
        </div>

        {/* ── Módulos principales ── */}
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Acceso rápido a módulos
          </p>
          <div style={{ flex: 1, height: 1, backgroundColor: '#E9ECEF' }} />
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>6 módulos</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6C757D', margin: '6px 0 20px' }}>
          Navegá directamente a cualquier sección del sistema
        </p>
        <HubCardGrid cards={moduleCards} />

      </div>
    </div>
  );
}
