/* =====================================================
   AdminSidebar — navegación plana, sin sub-menús, sin scroll
   ===================================================== */
import React, { useMemo } from 'react';
import {
  LayoutDashboard, ShoppingCart, Megaphone, Wrench, Database,
  Monitor, Sparkles, Package, Truck, Rss, ExternalLink, Plug,
  Search, Blocks, Server,
} from 'lucide-react';
import type { MainSection } from '../../AdminDashboard';
import { useOrquestador } from '../../context/OrquestadorContext';

const ORANGE_DEFAULT = '#FF6835';
const ACTIVE_BG = 'rgba(255,255,255,0.22)';
const HOVER_BG  = 'rgba(255,255,255,0.12)';

interface NavItem {
  id: MainSection;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard'           },
  { id: 'ecommerce',     icon: ShoppingCart,    label: 'eCommerce'           },
  { id: 'logistica',     icon: Truck,           label: 'Logística'           },
  { id: 'marketing',     icon: Megaphone,       label: 'Marketing'           },
  { id: 'rrss',          icon: Rss,             label: 'RRSS'                },
  { id: 'herramientas',  icon: Wrench,          label: 'Herramientas'        },
  { id: 'gestion',       icon: Database,        label: 'Gestión'             },
  { id: 'sistema',       icon: Monitor,         label: 'Sistema'             },
  { id: 'integraciones', icon: Plug,            label: 'Integraciones'       },
  { id: 'auditoria',     icon: Search,          label: 'Auditoría'           },
  { id: 'orquestador', icon: Server, label: 'Orquestador' },
];

interface Props {
  activeSection: MainSection;
  onNavigate: (section: MainSection) => void;
}

export function AdminSidebar({ activeSection, onNavigate }: Props) {
  const { config } = useOrquestador();
  
  // Color primario del theme o fallback a ORANGE
  const primaryColor = config?.theme?.primary || ORANGE_DEFAULT;
  
  // Filtrar NAV_ITEMS según los módulos habilitados
  const enabledModules = useMemo(() => {
    if (!config || !config.modulos || config.modulos.length === 0) {
      // Si no hay config o no hay módulos, mostrar todos (fallback)
      return NAV_ITEMS;
    }
    // Filtrar solo los items cuyo id está en la lista de módulos habilitados
    return NAV_ITEMS.filter(item => config.modulos.includes(item.id));
  }, [config]);

  /* resolve which top-level hub "owns" the current section */
  const activeHub = (enabledModules.find(n => n.id === activeSection)?.id ?? activeSection) as MainSection;

  return (
    <aside
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: primaryColor,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflow: 'hidden',          /* sin scroll */
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
          <span style={{
            color: '#000',
            fontWeight: '600',
            fontSize: '1.7rem',
            lineHeight: 1,
            textAlign: 'justify',
            textAlignLast: 'justify',
          }}>
            Charlie
          </span>
          <p style={{
            color: '#000',
            fontSize: '0.64rem',
            margin: '0',
            letterSpacing: '0.08em',
            textTransform: 'none',
            fontWeight: '500',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            Marketplace Builder
          </p>
        </div>
      </div>

      {/* ── User ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '800', fontSize: '0.78rem',
            flexShrink: 0, border: '2px solid rgba(255,255,255,0.4)',
          }}>
            CV
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.82rem', margin: 0, whiteSpace: 'nowrap' }}>Carlos Varalla</p>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', margin: 0 }}>Administrador</p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {enabledModules.map(item => {
          const isActive = activeSection === item.id || activeHub === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? ACTIVE_BG : 'transparent',
                color: '#fff',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                transition: 'all 0.14s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: '0.84rem',
                fontWeight: isActive ? '700' : '500',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* ── Divisor Constructor ── */}
        <div style={{
          margin: '8px 14px',
          borderTop: '1px solid rgba(255,255,255,0.25)',
        }} />

        {/* ── Constructor ── */}
        {(() => {
          const isActive = activeSection === 'constructor';
          return (
            <button
              onClick={() => onNavigate('constructor')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(0,0,0,0.18)' : 'transparent',
                color: '#000',
                borderLeft: isActive ? '3px solid #000' : '3px solid transparent',
                transition: 'all 0.14s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.10)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <Blocks size={16} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: '0.84rem',
                fontWeight: isActive ? '700' : '600',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                color: '#000',
              }}>
                Constructor
              </span>
            </button>
          );
        })()}
      </nav>

      {/* ── Tip ── */}
      <div style={{
        margin: '0 10px 10px',
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
          <Sparkles size={12} color="#fff" />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.72rem' }}>Tip del día</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.67rem', margin: 0, lineHeight: '1.4' }}>
          Usá la IA para optimizar descripciones de productos automáticamente
        </p>
      </div>

      {/* ── Ver Tienda ── */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          margin: '0 10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          padding: '9px 0',
          backgroundColor: '#fff',
          color: primaryColor,
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: '700',
          flexShrink: 0,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      >
        <ExternalLink size={13} />
        Ver tienda
      </a>
    </aside>
  );
}
