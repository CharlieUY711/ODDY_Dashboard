/**
 * RRSSBanner — Sub-encabezado compartido de Redes Sociales
 * Aparece debajo de OrangeHeader en todas las vistas hijas de RRSS.
 * Charlie Marketplace Builder v1.5
 */
import React from 'react';
import type { MainSection } from '../../AdminDashboard';
import { Facebook, Instagram, MessageCircle, LayoutDashboard, Share2 } from 'lucide-react';

interface Props {
  onNavigate: (s: MainSection) => void;
  /** Resalta el chip de la vista activa */
  active?: 'meta-business' | 'redes-sociales' | 'migracion-rrss';
}

interface Chip {
  icon: React.ElementType;
  label: string;
  sub: string;
  target?: MainSection;
  active?: boolean;
}

export function RRSSBanner({ onNavigate, active }: Props) {
  const chips: Chip[] = [
    { icon: Facebook,        label: 'Facebook',        sub: 'Conectado',      target: 'meta-business',  active: active === 'meta-business'  },
    { icon: Instagram,       label: 'Instagram',       sub: 'Conectado',      target: 'meta-business',  active: active === 'meta-business'  },
    { icon: MessageCircle,   label: 'WhatsApp',        sub: 'Activo',         target: 'redes-sociales', active: active === 'redes-sociales' },
    { icon: LayoutDashboard, label: 'Centro Operativo',sub: 'Ver todo',       target: 'redes-sociales', active: active === 'redes-sociales' },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #5B21B6 0%, #1D4ED8 60%, #1877F2 100%)',
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      {/* Back crumb */}
      <button
        onClick={() => onNavigate('rrss')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff', fontSize: '0.75rem', fontWeight: '700',
          cursor: 'pointer', backdropFilter: 'blur(6px)',
          flexShrink: 0, transition: 'background 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
      >
        <Share2 size={12} />
        ← Redes Sociales
      </button>

      <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

      {/* Platform chips */}
      {chips.map((chip, i) => {
        const Icon = chip.icon;
        const isActive = chip.active;
        return (
          <button
            key={i}
            onClick={() => chip.target && onNavigate(chip.target)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '8px',
              backgroundColor: isActive ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}`,
              cursor: chip.target ? 'pointer' : 'default',
              backdropFilter: 'blur(6px)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => chip.target && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = isActive ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)')}
          >
            <Icon size={13} color='#fff' />
            <div>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1 }}>{chip.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{chip.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
