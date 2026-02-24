/**
 * WorkspaceShell — Layout compartido para todas las herramientas del workspace
 * TopBar oscuro + 3 columnas (Left 200px | Canvas flex | Right 260px)
 * Right panel: Props / Assets / Print / Templates — fijo en todas las herramientas
 */
import React, { useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import type { MainSection } from '../../../AdminDashboard';

export const WORKSPACE_TOOLS = [
  { id: 'editor-imagenes'   as MainSection, emoji: '🖼️', label: 'Editor',       color: '#FF6835' },
  { id: 'biblioteca'        as MainSection, emoji: '📁', label: 'Biblioteca',   color: '#3B82F6' },
  { id: 'gen-documentos'    as MainSection, emoji: '📄', label: 'Documentos',   color: '#10B981' },
  { id: 'gen-presupuestos'  as MainSection, emoji: '💰', label: 'Presupuestos', color: '#F59E0B' },
  { id: 'ocr'               as MainSection, emoji: '🔍', label: 'OCR',          color: '#8B5CF6' },
  { id: 'impresion'         as MainSection, emoji: '🖨️', label: 'Impresión',    color: '#EC4899' },
];

type RightTab = 'props' | 'library' | 'print' | 'templates';

interface WorkspaceShellProps {
  toolId: MainSection;
  leftPanel: React.ReactNode;
  canvas: React.ReactNode;
  properties: React.ReactNode;
  actions?: React.ReactNode;
  onNavigate: (s: MainSection) => void;
}

/* ── Shared Quick Panels ─────────────────────────────────────────────────── */

function QuickLibraryPanel({ onNavigate }: { onNavigate: (s: MainSection) => void }) {
  return (
    <div style={{ padding: '14px 12px' }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.5 }}>
        Accedé a todos tus assets guardados desde la herramienta Biblioteca.
      </p>
      <button onClick={() => onNavigate('biblioteca')}
        style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1.5px dashed #BFDBFE', backgroundColor: '#EFF6FF', color: '#2563EB', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>
        📁 Abrir Biblioteca
      </button>
    </div>
  );
}

function QuickPrintPanel() {
  const [paper, setPaper]         = useState('A4');
  const [copies, setCopies]       = useState(1);
  const [orient, setOrient]       = useState('portrait');
  const [color, setColor]         = useState('color');
  return (
    <div style={{ padding: '12px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontWeight: '700', color: '#374151' }}>Impresión rápida</p>

      {/* Paper */}
      <Label>Papel</Label>
      <select value={paper} onChange={e => setPaper(e.target.value)} style={selectStyle}>
        {['A4', 'A5', 'Letter', 'Legal', 'A3'].map(p => <option key={p}>{p}</option>)}
      </select>

      {/* Orientation */}
      <Label>Orientación</Label>
      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        {(['portrait', 'landscape'] as const).map(o => (
          <button key={o} onClick={() => setOrient(o)}
            style={{ flex: 1, padding: '5px 4px', borderRadius: 6, border: `1.5px solid ${orient === o ? '#FF6835' : '#E5E7EB'}`, backgroundColor: orient === o ? '#FFF4F0' : '#fff', color: orient === o ? '#FF6835' : '#6B7280', cursor: 'pointer', fontSize: '0.66rem', fontWeight: '600' }}>
            {o === 'portrait' ? '↕ Vertical' : '↔ Horizontal'}
          </button>
        ))}
      </div>

      {/* Color */}
      <Label>Modo</Label>
      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        {[{ v: 'color', l: '🎨 Color' }, { v: 'bw', l: '⬛ B&N' }].map(o => (
          <button key={o.v} onClick={() => setColor(o.v)}
            style={{ flex: 1, padding: '5px', borderRadius: 6, border: `1.5px solid ${color === o.v ? '#FF6835' : '#E5E7EB'}`, backgroundColor: color === o.v ? '#FFF4F0' : '#fff', color: color === o.v ? '#FF6835' : '#6B7280', cursor: 'pointer', fontSize: '0.66rem', fontWeight: '600' }}>
            {o.l}
          </button>
        ))}
      </div>

      {/* Copies */}
      <Label>Copias</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setCopies(c => Math.max(1, c - 1))} style={counterBtnStyle}>−</button>
        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#111827', minWidth: 20, textAlign: 'center' }}>{copies}</span>
        <button onClick={() => setCopies(c => c + 1)} style={counterBtnStyle}>+</button>
      </div>

      <button onClick={() => window.print()}
        style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', backgroundColor: '#EC4899', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Printer size={13} /> Imprimir
      </button>
    </div>
  );
}

const TEMPLATES: Record<string, { emoji: string; name: string; desc: string }[]> = {
  'gen-documentos': [
    { emoji: '📋', name: 'Contrato simple',  desc: 'Contrato básico editable' },
    { emoji: '📩', name: 'Carta formal',     desc: 'Carta con membrete empresarial' },
    { emoji: '📑', name: 'Informe A4',       desc: 'Portada + secciones + pie' },
    { emoji: '📜', name: 'Nota de pedido',   desc: 'Orden interna estandarizada' },
  ],
  'gen-presupuestos': [
    { emoji: '🛒', name: 'Productos',        desc: 'Venta de artículos físicos' },
    { emoji: '⚙️', name: 'Servicios',        desc: 'Servicios profesionales' },
    { emoji: '🏗️', name: 'Mixto',            desc: 'Productos + servicios + IVA' },
    { emoji: '🔁', name: 'Recurrente',       desc: 'Con cuotas mensuales' },
  ],
  'editor-imagenes': [
    { emoji: '📱', name: 'Story 9:16',       desc: 'Instagram Stories' },
    { emoji: '🖼️', name: 'Post 1:1',         desc: 'Post cuadrado Instagram' },
    { emoji: '📧', name: 'Header Email',     desc: 'Banner para newsletters' },
    { emoji: '🏷️', name: 'Etiqueta',         desc: 'Etiqueta 10×5 cm' },
  ],
};

function QuickTemplatesPanel({ toolId }: { toolId: MainSection }) {
  const list = TEMPLATES[toolId] ?? [{ emoji: '✨', name: 'Próximamente', desc: 'Templates en preparación para esta herramienta' }];
  return (
    <div style={{ padding: '12px' }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.7rem', fontWeight: '700', color: '#374151' }}>Templates</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {list.map((t, i) => (
          <button key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6835'; e.currentTarget.style.backgroundColor = '#FFF4F0'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#fff'; }}>
            <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', flexShrink: 0 }}>{t.emoji}</span>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#111827' }}>{t.name}</div>
              <div style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>{t.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: '0.62rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>{children}</label>
);
const selectStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '0.78rem', backgroundColor: '#fff', outline: 'none', marginBottom: 10, cursor: 'pointer' };
const counterBtnStyle: React.CSSProperties = { width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.95rem', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' };

/* ── Main Shell ──────────────────────────────────────────────────────────── */

export function WorkspaceShell({ toolId, leftPanel, canvas, properties, actions, onNavigate }: WorkspaceShellProps) {
  const [rightTab, setRightTab] = useState<RightTab>('props');
  const activeTool = WORKSPACE_TOOLS.find(t => t.id === toolId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div style={{ height: 46, backgroundColor: '#18181B', display: 'flex', alignItems: 'center', padding: '0 6px', gap: 1, flexShrink: 0, borderBottom: '1px solid #27272A' }}>

        <button onClick={() => onNavigate('herramientas')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 5, border: 'none', background: 'transparent', color: '#71717A', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '600', flexShrink: 0, whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#27272A'; e.currentTarget.style.color = '#E4E4E7'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717A'; }}>
          <ArrowLeft size={12} /> Hub
        </button>

        <div style={{ width: 1, height: 18, backgroundColor: '#3F3F46', margin: '0 3px', flexShrink: 0 }} />

        {WORKSPACE_TOOLS.map(t => {
          const isActive = t.id === toolId;
          return (
            <button key={t.id} onClick={() => onNavigate(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 5,
                border: 'none', backgroundColor: isActive ? `${t.color}25` : 'transparent',
                color: isActive ? t.color : '#71717A', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: isActive ? '700' : '500',
                outline: isActive ? `1px solid ${t.color}45` : 'none',
                flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#27272A'; e.currentTarget.style.color = '#E4E4E7'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717A'; } }}>
              {t.emoji} {t.label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />
        {actions && <div style={{ display: 'flex', gap: 6, paddingRight: 8 }}>{actions}</div>}
      </div>

      {/* ── 3 COLUMNS ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left Panel */}
        <div style={{ width: 200, flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid #F3F4F6', flexShrink: 0, gap: 6 }}>
            <span style={{ fontSize: '0.9rem' }}>{activeTool?.emoji}</span>
            <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {activeTool?.label ?? 'Herramientas'}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>{leftPanel}</div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F1F3F5', position: 'relative', minWidth: 0 }}>
          {canvas}
        </div>

        {/* Right Panel */}
        <div style={{ width: 260, flexShrink: 0, backgroundColor: '#fff', borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 34, display: 'flex', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
            {([
              { id: 'props'     as RightTab, label: 'Props',  emoji: '⚙️' },
              { id: 'library'   as RightTab, label: 'Assets', emoji: '📁' },
              { id: 'print'     as RightTab, label: 'Print',  emoji: '🖨️' },
              { id: 'templates' as RightTab, label: 'TPL',    emoji: '✨' },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setRightTab(tab.id)}
                style={{
                  flex: 1, border: 'none',
                  borderBottom: rightTab === tab.id ? `2px solid ${activeTool?.color ?? '#FF6835'}` : '2px solid transparent',
                  backgroundColor: rightTab === tab.id ? '#FAFAFA' : '#fff',
                  color: rightTab === tab.id ? '#111827' : '#9CA3AF',
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: rightTab === tab.id ? '700' : '500',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
                  transition: 'all 0.12s',
                }}>
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {rightTab === 'props'     && <div style={{ padding: 12 }}>{properties}</div>}
            {rightTab === 'library'   && <QuickLibraryPanel onNavigate={onNavigate} />}
            {rightTab === 'print'     && <QuickPrintPanel />}
            {rightTab === 'templates' && <QuickTemplatesPanel toolId={toolId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
