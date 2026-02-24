import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export type CardColor =
  | 'lavender' | 'green' | 'pink' | 'orange'
  | 'blue' | 'yellow' | 'teal' | 'purple' | 'rose';

export const CARD_BG: Record<CardColor, string> = {
  lavender: '#EEF2FF',
  green:    '#F0FDF4',
  pink:     '#FFF0F5',
  orange:   '#FFF4EC',
  blue:     '#EFF6FF',
  yellow:   '#FEFCE8',
  teal:     '#F0FDFA',
  purple:   '#FAF5FF',
  rose:     '#FFF1F2',
};

export interface CardDef {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: CardColor;
  onClick?: () => void;
}

interface Props extends CardDef {}

export function ModuleCard({ icon: Icon, label, description, color, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: CARD_BG[color],
        border: 'none',
        borderRadius: '16px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'all 0.15s ease',
        transform: hovered && onClick ? 'translateY(-3px)' : 'none',
        boxShadow: hovered && onClick
          ? '0 8px 24px rgba(0,0,0,0.10)'
          : '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
      }}
    >
      <Icon size={28} color="#1F2937" strokeWidth={1.5} />
      <div>
        <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>
          {label}
        </p>
        <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: '0.78rem', lineHeight: '1.45' }}>
          {description}
        </p>
      </div>
    </button>
  );
}

interface GridProps {
  cards: CardDef[];
  columns?: number;
}

export function ModuleCardGrid({ cards, columns = 3 }: GridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px',
      }}
    >
      {cards.map((card) => (
        <ModuleCard key={card.id} {...card} />
      ))}
    </div>
  );
}
