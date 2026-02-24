/* =====================================================
   UserDashboardView — Dashboard de Usuario por Rol
   5 roles · KPIs por rol · Módulos accesibles · Simulador
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { UserCircle, ShoppingCart, Package, Truck, Megaphone, BarChart2, DollarSign, Users, Star, Clock } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Rol = 'admin' | 'operador' | 'vendedor' | 'logistico' | 'readonly';

interface RolConfig {
  nombre: string; color: string; emoji: string; descripcion: string;
  kpis: { label: string; value: string; icon: React.ElementType; color: string }[];
  modulos: { nombre: string; section: MainSection; icon: string }[];
  acciones: string[];
}

const roles: Record<Rol, RolConfig> = {
  admin: {
    nombre: 'Administrador', color: ORANGE, emoji: '👑', descripcion: 'Acceso total al sistema. Puede gestionar usuarios, configurar módulos y ver todos los reportes.',
    kpis: [
      { label: 'Usuarios activos', value: '45', icon: Users, color: '#10B981' },
      { label: 'Ventas del mes', value: '$284K', icon: DollarSign, color: ORANGE },
      { label: 'Servicios OK', value: '7/8', icon: BarChart2, color: '#3B82F6' },
      { label: 'Alertas activas', value: '3', icon: Star, color: '#EF4444' },
    ],
    modulos: [
      { nombre: 'Dashboard', section: 'dashboard', icon: '📊' },
      { nombre: 'eCommerce', section: 'ecommerce', icon: '🛍️' },
      { nombre: 'Gestión ERP', section: 'gestion', icon: '📋' },
      { nombre: 'Logística', section: 'logistica', icon: '🚚' },
      { nombre: 'Marketing', section: 'marketing', icon: '📣' },
      { nombre: 'Sistema', section: 'sistema', icon: '⚙️' },
    ],
    acciones: ['Gestionar usuarios', 'Modificar roles', 'Ver todos los logs', 'Acceso a configuración global'],
  },
  operador: {
    nombre: 'Operador', color: '#3B82F6', emoji: '🔧', descripcion: 'Gestiona operaciones diarias: pedidos, clientes, logística y reportes operativos.',
    kpis: [
      { label: 'Pedidos hoy', value: '34', icon: ShoppingCart, color: ORANGE },
      { label: 'Envíos activos', value: '89', icon: Truck, color: '#10B981' },
      { label: 'Incidencias', value: '2', icon: BarChart2, color: '#EF4444' },
      { label: 'SLA cumplido', value: '96%', icon: Star, color: '#059669' },
    ],
    modulos: [
      { nombre: 'Pedidos', section: 'pedidos', icon: '📦' },
      { nombre: 'Clientes', section: 'clientes', icon: '👥' },
      { nombre: 'Envíos', section: 'envios', icon: '🚚' },
      { nombre: 'Rutas', section: 'rutas', icon: '🗺️' },
      { nombre: 'Inventario', section: 'erp-inventario', icon: '📋' },
      { nombre: 'Reportes', section: 'checklist', icon: '📊' },
    ],
    acciones: ['Gestionar pedidos', 'Confirmar envíos', 'Ver inventario', 'Reportes operativos'],
  },
  vendedor: {
    nombre: 'Vendedor', color: '#10B981', emoji: '💼', descripcion: 'Maneja el proceso de ventas: POS, catálogo, clientes y métricas comerciales.',
    kpis: [
      { label: 'Ventas hoy', value: '$8,420', icon: DollarSign, color: ORANGE },
      { label: 'Tickets POS', value: '28', icon: ShoppingCart, color: '#10B981' },
      { label: 'Clientes nuevos', value: '5', icon: Users, color: '#3B82F6' },
      { label: 'Conversión', value: '4.2%', icon: Star, color: '#8B5CF6' },
    ],
    modulos: [
      { nombre: 'POS', section: 'pos', icon: '🖥️' },
      { nombre: 'Pedidos', section: 'pedidos', icon: '📦' },
      { nombre: 'Clientes', section: 'clientes', icon: '👥' },
      { nombre: 'Catálogo ERP', section: 'erp-inventario', icon: '🏪' },
      { nombre: 'Marketing', section: 'marketing', icon: '📣' },
      { nombre: 'Segunda Mano', section: 'secondhand', icon: '♻️' },
    ],
    acciones: ['Crear pedidos', 'Usar POS', 'Ver catálogo', 'Enviar campañas'],
  },
  logistico: {
    nombre: 'Logístico', color: '#8B5CF6', emoji: '🚚', descripcion: 'Responsable de toda la cadena logística: fulfillment, envíos, rutas y transportistas.',
    kpis: [
      { label: 'Envíos en tránsito', value: '124', icon: Truck, color: ORANGE },
      { label: 'Entregas hoy', value: '42', icon: Package, color: '#10B981' },
      { label: 'OA pendientes', value: '7', icon: Clock, color: '#3B82F6' },
      { label: 'KM totales', value: '2,840', icon: BarChart2, color: '#8B5CF6' },
    ],
    modulos: [
      { nombre: 'Envíos', section: 'envios', icon: '📦' },
      { nombre: 'Rutas', section: 'rutas', icon: '🗺️' },
      { nombre: 'Fulfillment', section: 'fulfillment', icon: '🏭' },
      { nombre: 'Transportistas', section: 'transportistas', icon: '🚛' },
      { nombre: 'Producción', section: 'produccion', icon: '⚙️' },
      { nombre: 'Mapa', section: 'mapa-envios', icon: '🌎' },
    ],
    acciones: ['Planificar rutas', 'Wave picking', 'Confirmar entregas', 'Gestionar carriers'],
  },
  readonly: {
    nombre: 'Solo lectura', color: '#6B7280', emoji: '👁️', descripcion: 'Acceso de visualización sin permisos de edición. Ideal para gerentes y auditores externos.',
    kpis: [
      { label: 'Módulos visibles', value: '8', icon: BarChart2, color: '#6B7280' },
      { label: 'Reportes accesibles', value: '12', icon: Star, color: '#9CA3AF' },
      { label: 'Sin edición', value: '100%', icon: Users, color: '#D1D5DB' },
      { label: 'Nivel acceso', value: 'Bajo', icon: DollarSign, color: '#6B7280' },
    ],
    modulos: [
      { nombre: 'Dashboard', section: 'dashboard', icon: '📊' },
      { nombre: 'Pedidos (ver)', section: 'pedidos', icon: '📦' },
      { nombre: 'Clientes (ver)', section: 'clientes', icon: '👥' },
      { nombre: 'Reportes', section: 'checklist', icon: '📋' },
    ],
    acciones: ['Ver dashboard', 'Consultar pedidos', 'Ver clientes', 'Exportar reportes'],
  },
};

const ROLES_ORDER: Rol[] = ['admin', 'operador', 'vendedor', 'logistico', 'readonly'];

export function UserDashboardView({ onNavigate }: Props) {
  const [rolActivo, setRolActivo] = useState<Rol>('vendedor');
  const config = roles[rolActivo];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={UserCircle}
        title="Dashboard de Usuario"
        subtitle="Vista personalizada por rol · 5 roles · KPIs y módulos específicos · Simulador de roles"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* Selector de roles */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 20, marginBottom: 24 }}>
          <p style={{ margin: '0 0 14px', fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>
            🎭 Simulador de roles — Seleccioná cómo se ve el dashboard para cada rol:
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ROLES_ORDER.map(r => {
              const rc = roles[r];
              return (
                <button key={r} onClick={() => setRolActivo(r)}
                  style={{ padding: '10px 20px', borderRadius: 12, border: `2px solid ${rolActivo === r ? rc.color : '#E5E7EB'}`, backgroundColor: rolActivo === r ? `${rc.color}10` : '#F9FAFB', color: rolActivo === r ? rc.color : '#6B7280', fontWeight: rolActivo === r ? '800' : '500', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {rc.emoji} {rc.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header de bienvenida del rol */}
        <div style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)`, borderRadius: 20, padding: 28, marginBottom: 24, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              {config.emoji}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>Buen día, nombre_usuario</h2>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.88rem' }}>Rol: {config.nombre}</p>
            </div>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem', maxWidth: 600 }}>{config.descripcion}</p>
        </div>

        {/* KPIs del rol */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {config.kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 22 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={18} color={k.color} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: k.color }}>{k.value}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Módulos accesibles */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1A1A2E', fontSize: '1rem' }}>Módulos accesibles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {config.modulos.map(m => (
                <button key={m.section} onClick={() => onNavigate(m.section)}
                  style={{ padding: '14px 10px', borderRadius: 12, border: `1px solid ${config.color}20`, backgroundColor: `${config.color}06`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = config.color; e.currentTarget.style.backgroundColor = `${config.color}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${config.color}20`; e.currentTarget.style.backgroundColor = `${config.color}06`; }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.72rem', color: '#374151', fontWeight: '600' }}>{m.nombre}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Acciones disponibles */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1A1A2E', fontSize: '1rem' }}>Acciones disponibles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {config.acciones.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, backgroundColor: `${config.color}06`, border: `1px solid ${config.color}15` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: '600' }}>{a}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: 14, borderRadius: 12, backgroundColor: `${config.color}08`, border: `1px solid ${config.color}20` }}>
              <p style={{ margin: '0 0 6px', fontWeight: '700', color: config.color, fontSize: '0.82rem' }}>
                {config.emoji} Configurar permisos de este rol
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                Podés ajustar los permisos granulares en "Configuración de Vistas por Rol".
              </p>
              <button onClick={() => onNavigate('config-vistas')}
                style={{ marginTop: 10, padding: '8px 14px', borderRadius: 8, border: 'none', backgroundColor: config.color, color: '#fff', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}>
                Ir a configuración →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
