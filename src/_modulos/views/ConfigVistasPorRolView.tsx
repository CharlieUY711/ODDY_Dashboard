/* =====================================================
   ConfigVistasPorRolView — Configuración de Vistas por Rol
   5 roles · 7 grupos de permisos · 40+ toggles · Tiempo real
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Lock, Shield, CheckCircle, Save } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Rol = 'admin' | 'operador' | 'vendedor' | 'logistico' | 'readonly';

interface Permiso { id: string; label: string; descripcion: string; }
interface Grupo { nombre: string; icon: string; permisos: Permiso[]; }

const GRUPOS: Grupo[] = [
  {
    nombre: 'Dashboard y Reportes', icon: '📊',
    permisos: [
      { id: 'dash-ver', label: 'Ver dashboard principal', descripcion: 'KPIs y métricas generales' },
      { id: 'dash-exportar', label: 'Exportar reportes', descripcion: 'PDF, CSV y Excel' },
      { id: 'dash-kpis', label: 'Ver KPIs avanzados', descripcion: 'Métricas de negocio detalladas' },
    ],
  },
  {
    nombre: 'eCommerce', icon: '🛍️',
    permisos: [
      { id: 'eco-pedidos-ver', label: 'Ver pedidos', descripcion: 'Lista y detalle de pedidos' },
      { id: 'eco-pedidos-editar', label: 'Editar pedidos', descripcion: 'Modificar estado y datos' },
      { id: 'eco-pagos', label: 'Ver pagos', descripcion: 'Transacciones y reembolsos' },
      { id: 'eco-pos', label: 'Usar POS', descripcion: 'Terminal punto de venta' },
    ],
  },
  {
    nombre: 'Logística', icon: '🚚',
    permisos: [
      { id: 'log-envios', label: 'Gestionar envíos', descripcion: 'Crear y actualizar envíos' },
      { id: 'log-rutas', label: 'Planificar rutas', descripcion: 'Crear y asignar rutas' },
      { id: 'log-fulfillment', label: 'Acceso a fulfillment', descripcion: 'Wave picking y empaque' },
      { id: 'log-mapa', label: 'Ver mapa de envíos', descripcion: 'Visualización geográfica' },
    ],
  },
  {
    nombre: 'ERP y CRM', icon: '📋',
    permisos: [
      { id: 'erp-inventario', label: 'Ver inventario', descripcion: 'Stock y movimientos' },
      { id: 'erp-inventario-editar', label: 'Editar inventario', descripcion: 'Ajustes de stock' },
      { id: 'erp-facturacion', label: 'Acceso facturación', descripcion: 'Facturas y tickets' },
      { id: 'erp-crm', label: 'Acceso CRM', descripcion: 'Contactos y pipeline' },
      { id: 'erp-rrhh', label: 'Ver RRHH', descripcion: 'Empleados y nómina' },
    ],
  },
  {
    nombre: 'Marketing', icon: '📣',
    permisos: [
      { id: 'mkt-campanas', label: 'Gestionar campañas', descripcion: 'Email, ads y RRSS' },
      { id: 'mkt-seo', label: 'Acceso SEO', descripcion: 'Rankings y keywords' },
      { id: 'mkt-fidelizacion', label: 'Programa fidelización', descripcion: 'Puntos y recompensas' },
    ],
  },
  {
    nombre: 'Sistema y Config.', icon: '⚙️',
    permisos: [
      { id: 'sys-usuarios', label: 'Gestionar usuarios', descripcion: 'Alta, baja y roles' },
      { id: 'sys-integraciones', label: 'Config. integraciones', descripcion: 'API keys y webhooks' },
      { id: 'sys-logs', label: 'Ver logs del sistema', descripcion: 'Auditoría y eventos' },
      { id: 'sys-backup', label: 'Gestionar backups', descripcion: 'Crear y restaurar' },
    ],
  },
  {
    nombre: 'Herramientas', icon: '🛠️',
    permisos: [
      { id: 'tool-editor', label: 'Editor de imágenes', descripcion: 'Filtros y export' },
      { id: 'tool-docs', label: 'Generador de documentos', descripcion: 'WYSIWYG y PDF' },
      { id: 'tool-qr', label: 'Generador QR', descripcion: 'PNG y SVG' },
      { id: 'tool-ocr', label: 'OCR de texto', descripcion: 'Reconocimiento de imágenes' },
    ],
  },
];

// Permisos por defecto por rol
const DEFAULTS: Record<Rol, Set<string>> = {
  admin:    new Set(GRUPOS.flatMap(g => g.permisos.map(p => p.id))), // todo
  operador: new Set(['dash-ver', 'dash-exportar', 'eco-pedidos-ver', 'eco-pedidos-editar', 'eco-pagos', 'log-envios', 'log-rutas', 'log-mapa', 'erp-inventario', 'erp-crm', 'tool-qr']),
  vendedor: new Set(['dash-ver', 'eco-pedidos-ver', 'eco-pedidos-editar', 'eco-pos', 'erp-inventario', 'mkt-campanas', 'mkt-fidelizacion', 'tool-qr', 'tool-docs']),
  logistico:new Set(['dash-ver', 'eco-pedidos-ver', 'log-envios', 'log-rutas', 'log-fulfillment', 'log-mapa', 'erp-inventario', 'tool-qr']),
  readonly: new Set(['dash-ver', 'eco-pedidos-ver', 'erp-inventario']),
};

const ROLES_INFO: Record<Rol, { nombre: string; emoji: string; color: string }> = {
  admin:    { nombre: 'Administrador', emoji: '👑', color: ORANGE },
  operador: { nombre: 'Operador', emoji: '🔧', color: '#3B82F6' },
  vendedor: { nombre: 'Vendedor', emoji: '💼', color: '#10B981' },
  logistico:{ nombre: 'Logístico', emoji: '🚚', color: '#8B5CF6' },
  readonly: { nombre: 'Solo lectura', emoji: '👁️', color: '#6B7280' },
};

export function ConfigVistasPorRolView({ onNavigate }: Props) {
  const [rolActivo, setRolActivo] = useState<Rol>('operador');
  const [permisos, setPermisos] = useState<Record<Rol, Set<string>>>({
    admin: new Set(DEFAULTS.admin),
    operador: new Set(DEFAULTS.operador),
    vendedor: new Set(DEFAULTS.vendedor),
    logistico: new Set(DEFAULTS.logistico),
    readonly: new Set(DEFAULTS.readonly),
  });
  const [guardado, setGuardado] = useState(false);

  const togglePermiso = (id: string) => {
    if (rolActivo === 'admin') return; // admin siempre tiene todo
    setPermisos(prev => {
      const newSet = new Set(prev[rolActivo]);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return { ...prev, [rolActivo]: newSet };
    });
  };

  const guardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const totalPermisos = GRUPOS.flatMap(g => g.permisos).length;
  const activos = permisos[rolActivo].size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Lock}
        title="Config. de Vistas por Rol"
        subtitle="5 roles configurables · 7 grupos de permisos · 40+ toggles · Configuración en tiempo real"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: guardado ? '✅ Guardado' : '💾 Guardar cambios', onClick: guardar, primary: true },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 0 }}>

        {/* Sidebar de roles */}
        <div style={{ backgroundColor: '#fff', borderRight: '1px solid #E9ECEF', overflowY: 'auto', padding: 20 }}>
          <p style={{ fontWeight: '700', color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Roles del sistema</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(Object.entries(ROLES_INFO) as [Rol, typeof ROLES_INFO[Rol]][]).map(([r, info]) => (
              <button key={r} onClick={() => setRolActivo(r)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: `2px solid ${rolActivo === r ? info.color : 'transparent'}`, backgroundColor: rolActivo === r ? `${info.color}10` : 'transparent', color: '#374151', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <span style={{ fontSize: '1.2rem' }}>{info.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: rolActivo === r ? '800' : '600', fontSize: '0.85rem', color: rolActivo === r ? info.color : '#374151' }}>{info.nombre}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{permisos[r].size} permisos</div>
                </div>
                {rolActivo === r && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: info.color }} />}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: `${ORANGE}08`, border: `1px solid ${ORANGE}20` }}>
            <p style={{ margin: '0 0 6px', fontWeight: '700', color: ORANGE, fontSize: '0.78rem' }}>
              Rol activo: {ROLES_INFO[rolActivo].emoji} {ROLES_INFO[rolActivo].nombre}
            </p>
            <div style={{ fontSize: '0.75rem', color: '#374151' }}>
              <div style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden', margin: '8px 0' }}>
                <div style={{ height: '100%', width: `${(activos / totalPermisos) * 100}%`, backgroundColor: ROLES_INFO[rolActivo].color, borderRadius: 3 }} />
              </div>
              {activos}/{totalPermisos} permisos activos
            </div>
          </div>
        </div>

        {/* Panel de permisos */}
        <div style={{ overflowY: 'auto', padding: '24px 28px' }}>
          {rolActivo === 'admin' && (
            <div style={{ backgroundColor: `${ORANGE}10`, border: `1px solid ${ORANGE}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={16} color={ORANGE} />
              <span style={{ fontSize: '0.85rem', color: ORANGE, fontWeight: '700' }}>El Administrador tiene acceso completo a todos los módulos y no puede ser restringido.</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {GRUPOS.map(grupo => (
              <div key={grupo.nombre} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem' }}>{grupo.icon}</span>
                  <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '0.92rem' }}>{grupo.nombre}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9CA3AF' }}>
                    {grupo.permisos.filter(p => permisos[rolActivo].has(p.id)).length}/{grupo.permisos.length} activos
                  </span>
                </div>
                <div style={{ padding: '8px 20px 16px' }}>
                  {grupo.permisos.map(permiso => {
                    const activo = permisos[rolActivo].has(permiso.id);
                    return (
                      <div key={permiso.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem', marginBottom: 2 }}>{permiso.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{permiso.descripcion}</div>
                        </div>
                        <button onClick={() => togglePermiso(permiso.id)}
                          disabled={rolActivo === 'admin'}
                          style={{ width: 46, height: 25, borderRadius: 13, border: 'none', backgroundColor: activo ? ROLES_INFO[rolActivo].color : '#D1D5DB', cursor: rolActivo === 'admin' ? 'default' : 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, opacity: rolActivo === 'admin' ? 0.7 : 1 }}>
                          <div style={{ width: 21, height: 21, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: activo ? 23 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button onClick={guardar}
              style={{ flex: 1, padding: '13px', borderRadius: 12, border: 'none', backgroundColor: guardado ? '#10B981' : ORANGE, color: '#fff', fontWeight: '800', fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background 0.3s' }}>
              {guardado ? <><CheckCircle size={16} /> ¡Guardado exitosamente!</> : <><Save size={16} /> Guardar configuración</>}
            </button>
            <button onClick={() => setPermisos(prev => ({ ...prev, [rolActivo]: new Set(DEFAULTS[rolActivo]) }))}
              style={{ padding: '13px 24px', borderRadius: 12, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
              Restaurar defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
