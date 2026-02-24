/* =====================================================
   GenericView — Vista genérica reutilizable
   Para módulos sin implementación completa aún.
   ===================================================== */
import React from 'react';
import { OrangeHeader } from './OrangeHeader';
import type { MainSection } from '../../AdminDashboard';

const ORANGE = '#FF6835';

interface Props {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  backSection?: MainSection;
  description?: string;
  onNavigate?: (s: MainSection) => void;
  features?: string[];
  status?: 'beta' | 'coming-soon' | 'available';
}

export function GenericView({
  icon,
  title,
  subtitle,
  backSection,
  description,
  onNavigate,
  features = [],
  status = 'available',
}: Props) {
  const statusColors = {
    'beta': { label: 'Beta', color: '#7C3AED', bg: '#F5F3FF' },
    'coming-soon': { label: 'Próximamente', color: '#D97706', bg: '#FEF3C7' },
    'available': { label: 'Disponible', color: '#059669', bg: '#D1FAE5' },
  };
  const sc = statusColors[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        actions={backSection && onNavigate ? [{ label: '← Volver', onClick: () => onNavigate(backSection) }] : undefined}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: sc.color, backgroundColor: sc.bg, padding: '4px 12px', borderRadius: '8px' }}>
              {sc.label}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Charlie Marketplace Builder v1.5
            </span>
          </div>

          {/* Card principal */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E9ECEF', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{
              background: `linear-gradient(135deg, ${ORANGE} 0%, #ff8c42 100%)`,
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {React.createElement(icon as React.ComponentType<{ size: number; color: string; strokeWidth: number }>, { size: 30, color: '#fff', strokeWidth: 2 })}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>{title}</h2>
                {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{subtitle}</p>}
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {description && (
                <p style={{ margin: '0 0 24px', fontSize: '0.95rem', color: '#6B7280', lineHeight: '1.6' }}>
                  {description}
                </p>
              )}

              {features.length > 0 && (
                <div>
                  <p style={{ margin: '0 0 14px', fontSize: '0.72rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Funcionalidades incluidas
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: ORANGE, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: '#374151' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Placeholder content */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '14px',
            border: '1px dashed #D1D5DB',
            padding: '40px',
            textAlign: 'center',
            color: '#9CA3AF',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              backgroundColor: '#F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {React.createElement(icon as React.ComponentType<{ size: number; color: string }>, { size: 24, color: '#D1D5DB' })}
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '700', color: '#6B7280' }}>
              Módulo en desarrollo
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF' }}>
              Este módulo está siendo implementado. Conectá Supabase para activar la funcionalidad completa.
            </p>
            <button
              style={{
                marginTop: '18px',
                padding: '10px 24px',
                backgroundColor: ORANGE,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                opacity: 0.8,
              }}
            >
              Conectar Supabase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
