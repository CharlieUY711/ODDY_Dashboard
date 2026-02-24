/* =====================================================
   HubView — Componente reutilizable para hubs modales
   Patrón: header blanco + badge naranja + grid de cards
   con gradiente + stats + sección "Próximamente"
   ===================================================== */
import React from 'react';

const ORANGE = '#FF6835';

/* ── Tipos públicos ───────────────────────────────── */

export interface HubCardDef {
  id: string;
  icon: React.ElementType;
  gradient: string;
  color: string;
  badge: string;
  label: string;
  description: string;
  stats: { icon: React.ElementType; value: string; label: string }[];
  onClick: () => void;
}

export interface HubSectionDef {
  /** Etiqueta opcional sobre la grilla (ej: "WORKSPACE SUITE") */
  label?: string;
  /** Conteo al lado de la etiqueta (ej: "6 herramientas") */
  count?: string;
  /** Subtítulo bajo la etiqueta */
  subtitle?: string;
  cards: HubCardDef[];
}

export interface HubQuickLink {
  label: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

export interface HubComingSoonItem {
  icon: React.ElementType;
  label: string;
  /** Tooltip al hacer hover */
  desc?: string;
}

export interface HubViewProps {
  /* ── Header ── */
  hubIcon: React.ElementType;
  title: string;
  subtitle: string;

  /* ── Contenido ── */
  /** Una o más secciones de cards */
  sections: HubSectionDef[];

  /* ── Extras opcionales ── */
  /** Nodo insertado justo debajo del label "Seleccioná un módulo" (ej: banner UY-first) */
  intro?: React.ReactNode;
  /** Nodo insertado entre las cards y la sección "Próximamente" (ej: panel de diagnóstico) */
  afterCards?: React.ReactNode;
  /** Pills de acceso rápido (ej: Métodos de Pago, Envío, SEO) */
  quickLinks?: HubQuickLink[];

  /* ── Próximamente ── */
  comingSoon?: HubComingSoonItem[];
  comingSoonText?: string;
  /** Icono en el banner "Próximamente" (por defecto usa hubIcon) */
  comingSoonIcon?: React.ElementType;

  /* ── Comportamiento ── */
  /** Ocultar el texto "Seleccioná un módulo para comenzar" */
  hideSeleccionar?: boolean;
}

/* ── Card individual ──────────────────────────────── */

function HubCard({ card }: { card: HubCardDef }) {
  return (
    <button
      onClick={card.onClick}
      style={{
        background: '#fff',
        border: '1px solid #E9ECEF',
        borderRadius: '16px',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        el.style.borderColor = card.color;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        el.style.borderColor = '#E9ECEF';
      }}
    >
      {/* Gradient header */}
      <div style={{
        background: card.gradient,
        padding: '22px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <card.icon size={22} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
            {card.badge}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#fff', fontWeight: '800' }}>
            {card.label}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 24px 20px' }}>
        <p style={{ margin: '0 0 18px', fontSize: '0.84rem', color: '#6C757D', lineHeight: '1.5' }}>
          {card.description}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          paddingTop: '14px',
          borderTop: '1px solid #F0F0F0',
        }}>
          {card.stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <stat.icon size={14} color={card.color} style={{ marginBottom: '4px' }} />
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1A1A2E' }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: '#ADB5BD' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: card.color,
        }}>
          Abrir módulo →
        </div>
      </div>
    </button>
  );
}

/* ── Grid de cards exportable ─────────────────────── */

export function HubCardGrid({ cards }: { cards: HubCardDef[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
    }}>
      {cards.map(card => (
        <HubCard key={card.id} card={card} />
      ))}
    </div>
  );
}

/* ── Componente principal HubView ─────────────────── */

export function HubView({
  hubIcon: HubIcon,
  title,
  subtitle,
  sections,
  intro,
  afterCards,
  quickLinks,
  comingSoon,
  comingSoonText,
  comingSoonIcon,
  hideSeleccionar = false,
}: HubViewProps) {
  const ComingSoonIcon = comingSoonIcon ?? HubIcon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>

      {/* ── Header blanco ── */}
      <div style={{
        padding: '28px 32px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E9ECEF',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #ff8c42 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HubIcon size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1A1A2E' }}>
              {title}
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6C757D' }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

        {/* Intro opcional */}
        {intro && <div style={{ marginBottom: '24px' }}>{intro}</div>}

        {/* Secciones de cards */}
        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: si < sections.length - 1 ? '32px' : '0' }}>
            {section.label && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {section.label}
                  </p>
                  {section.count && (
                    <span style={{ fontSize: '0.72rem', color: ORANGE, backgroundColor: `${ORANGE}12`, padding: '2px 8px', borderRadius: '5px', fontWeight: '700' }}>
                      {section.count}
                    </span>
                  )}
                </div>
                {section.subtitle && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF' }}>{section.subtitle}</p>
                )}
              </div>
            )}
            <HubCardGrid cards={section.cards} />
          </div>
        ))}

        {/* Contenido extra entre cards y coming soon */}
        {afterCards && (
          <div style={{ marginTop: '32px' }}>{afterCards}</div>
        )}

        {/* Quick links */}
        {quickLinks && quickLinks.length > 0 && (
          <div style={{
            marginTop: '32px',
            padding: '18px 22px',
            backgroundColor: '#fff',
            borderRadius: '14px',
            border: '1px solid #E9ECEF',
          }}>
            <p style={{ margin: '0 0 14px', fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Accesos rápidos
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {quickLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 14px', borderRadius: '9px',
                    border: `1.5px solid ${link.color}30`,
                    backgroundColor: `${link.color}08`,
                    color: link.color, cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: '700',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${link.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${link.color}08`; }}
                >
                  <link.icon size={13} />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Próximamente */}
        {comingSoon && comingSoon.length > 0 && (
          <div style={{
            marginTop: '32px',
            padding: '16px 20px',
            backgroundColor: 'rgba(255,104,53,0.07)',
            borderRadius: '12px',
            border: '1px solid rgba(255,104,53,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ComingSoonIcon size={15} color={ORANGE} />
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '700', color: ORANGE }}>
                Próximamente
              </p>
            </div>
            {comingSoonText ? (
              <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#6C757D', lineHeight: '1.5' }}>
                {comingSoonText}
              </p>
            ) : null}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {comingSoon.map(item => (
                <div
                  key={item.label}
                  title={item.desc}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px', borderRadius: '9px',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,104,53,0.2)',
                    fontSize: '0.78rem', fontWeight: '600', color: '#6C757D',
                  }}
                >
                  <item.icon size={13} color={ORANGE} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
