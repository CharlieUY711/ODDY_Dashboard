/**
 * IdeaQuickModal — Modal compacto de la lamparita 💡
 * Acceso rápido desde Dashboard.
 */
import React, { useState } from 'react';
import { X, Lightbulb, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';

const ORANGE = '#FF6835';

const AREAS = [
  'General', 'Logística', 'Pagos', 'Tiendas', 'Redes Sociales',
  'Servicios', 'eCommerce', 'Marketing', 'ERP', 'Sistema', 'Herramientas',
];

interface Props {
  onClose: () => void;
  onOpenBoard: () => void;
}

export function IdeaQuickModal({ onClose, onOpenBoard }: Props) {
  const [area, setArea] = useState('General');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    toast.success('¡Idea guardada!');
    setTimeout(() => {
      setText('');
      setSaved(false);
      setSaving(false);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '80px 24px 0 0',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'all' }}
        onClick={onClose}
      />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          width: 340,
          overflow: 'hidden',
          pointerEvents: 'all',
          animation: 'slideDown 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: ORANGE,
          padding: '13px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={16} color="#fff" strokeWidth={2.5} />
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.9rem' }}>
              Nueva Idea
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={onOpenBoard}
              title="Abrir Ideas Board completo"
              style={{
                background: 'rgba(255,255,255,0.22)',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 7px',
                gap: 4,
                fontSize: '0.68rem',
                fontWeight: '700',
              }}
            >
              <ExternalLink size={12} /> Board
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.85)',
                display: 'flex',
                padding: 4,
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 16px' }}>
          {/* Área selector */}
          <div style={{ marginBottom: 11 }}>
            <label style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: 5,
            }}>
              Área
            </label>
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                border: '1.5px solid #E5E7EB',
                borderRadius: 8,
                fontSize: '0.82rem',
                outline: 'none',
                color: '#111827',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
              }}
            >
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Texto */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: 5,
            }}>
              Idea
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="¿Qué se te ocurrió?"
              rows={3}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: `1.5px solid ${text ? ORANGE + '99' : '#E5E7EB'}`,
                borderRadius: 8,
                fontSize: '0.82rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#111827',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
                backgroundColor: '#FAFAFA',
              }}
              onFocus={e => (e.target.style.borderColor = ORANGE)}
              onBlur={e => (e.target.style.borderColor = text ? ORANGE + '99' : '#E5E7EB')}
              autoFocus
            />
          </div>

          {/* Botón guardar */}
          <button
            disabled={!text.trim() || saving}
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: saved ? '#10B981' : (text.trim() ? ORANGE : '#E5E7EB'),
              color: text.trim() || saved ? '#fff' : '#9CA3AF',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: text.trim() && !saving ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {saved ? (
              <><Check size={15} strokeWidth={3} /> Guardada ✓</>
            ) : saving ? (
              'Guardando…'
            ) : (
              <><Lightbulb size={14} /> Guardar idea</>
            )}
          </button>
        </div>

        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
