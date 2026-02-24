/* =====================================================
   GenDocumentosWorkspace — Generador de Documentos WYSIWYG
   8 tipos de bloque · A4 · Export PDF
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { FileText, Plus, Trash2, Download, Eye, Type, List, Image, Minus, AlignLeft, Hash, Quote, Code } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'list' | 'divider' | 'quote' | 'code';

interface Block {
  id: number; type: BlockType; content: string;
}

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  h1: Hash, h2: Hash, h3: Hash, p: AlignLeft, list: List, divider: Minus, quote: Quote, code: Code,
};

const BLOCK_LABELS: Record<BlockType, string> = {
  h1: 'Título H1', h2: 'Subtítulo H2', h3: 'H3', p: 'Párrafo', list: 'Lista', divider: 'Separador', quote: 'Cita', code: 'Código',
};

const tiposDocumento = ['Contrato', 'Carta Comercial', 'Propuesta', 'Informe', 'Nota', 'Circular'];

const bloquesPorDefecto: Block[] = [
  { id: 1, type: 'h1', content: 'Título del Documento' },
  { id: 2, type: 'p', content: 'Fecha: 24 de Febrero de 2026\nOrganización: ODDY Marketplace SRL' },
  { id: 3, type: 'divider', content: '' },
  { id: 4, type: 'h2', content: '1. Introducción' },
  { id: 5, type: 'p', content: 'El presente documento tiene por objeto establecer los términos y condiciones generales aplicables a las partes intervinientes en el presente acuerdo comercial.' },
  { id: 6, type: 'h2', content: '2. Cláusulas' },
  { id: 7, type: 'list', content: '• Primera cláusula del acuerdo\n• Segunda cláusula relevante\n• Tercera cláusula complementaria' },
  { id: 8, type: 'quote', content: '"Las partes acuerdan resolver cualquier controversia mediante arbitraje."' },
  { id: 9, type: 'p', content: 'Sin otro particular, firmamos el presente documento en señal de conformidad.' },
  { id: 10, type: 'divider', content: '' },
];

function renderBlock(block: Block) {
  const baseStyle: React.CSSProperties = { fontFamily: 'Georgia, serif', color: '#1A1A2E' };
  switch (block.type) {
    case 'h1': return <h1 style={{ ...baseStyle, fontSize: '2rem', fontWeight: '800', borderBottom: `3px solid ${ORANGE}`, paddingBottom: 8, marginBottom: 16 }}>{block.content}</h1>;
    case 'h2': return <h2 style={{ ...baseStyle, fontSize: '1.3rem', fontWeight: '700', marginTop: 24, marginBottom: 12 }}>{block.content}</h2>;
    case 'h3': return <h3 style={{ ...baseStyle, fontSize: '1.1rem', fontWeight: '700', marginBottom: 10 }}>{block.content}</h3>;
    case 'p':  return <p style={{ ...baseStyle, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 12, whiteSpace: 'pre-wrap' }}>{block.content}</p>;
    case 'list': return <div style={{ ...baseStyle, fontSize: '0.9rem', lineHeight: 2, marginBottom: 12, paddingLeft: 16, whiteSpace: 'pre-wrap' }}>{block.content}</div>;
    case 'divider': return <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />;
    case 'quote': return <blockquote style={{ ...baseStyle, borderLeft: `4px solid ${ORANGE}`, paddingLeft: 16, fontStyle: 'italic', color: '#374151', margin: '12px 0', fontSize: '0.95rem' }}>{block.content}</blockquote>;
    case 'code': return <pre style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: '0.82rem', fontFamily: 'monospace', overflow: 'auto', marginBottom: 12 }}>{block.content}</pre>;
    default: return null;
  }
}

export function GenDocumentosWorkspace({ onNavigate }: Props) {
  const [bloques, setBloques] = useState<Block[]>(bloquesPorDefecto);
  const [editando, setEditando] = useState<number | null>(null);
  const [tipoDoc, setTipoDoc] = useState('Contrato');
  const [preview, setPreview] = useState(false);

  const agregar = (tipo: BlockType) => {
    const defaults: Record<BlockType, string> = {
      h1: 'Nuevo Título', h2: 'Nueva Sección', h3: 'Subtítulo', p: 'Escribí tu texto aquí...',
      list: '• Elemento 1\n• Elemento 2', divider: '', quote: '"Tu cita aquí"', code: 'código aquí',
    };
    setBloques(prev => [...prev, { id: Date.now(), type: tipo, content: defaults[tipo] }]);
  };

  const actualizar = (id: number, content: string) => {
    setBloques(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const eliminar = (id: number) => {
    setBloques(prev => prev.filter(b => b.id !== id));
    setEditando(null);
  };

  const exportarPDF = () => window.print();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={FileText}
        title="Generador de Documentos"
        subtitle="Editor WYSIWYG con bloques · Plantilla A4 · 8 tipos de bloque · Export PDF"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: preview ? '✎ Editar' : '👁 Preview', onClick: () => setPreview(!preview) },
          { label: '⬇ Export PDF', onClick: exportarPDF, primary: true },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: preview ? '1fr' : '260px 1fr', gap: 0 }}>

        {/* Panel izquierdo — Herramientas */}
        {!preview && (
          <div style={{ backgroundColor: '#fff', borderRight: '1px solid #E9ECEF', overflowY: 'auto', padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 6 }}>Tipo de documento</label>
              <select value={tipoDoc} onChange={e => setTipoDoc(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.85rem', outline: 'none', backgroundColor: '#fff' }}>
                {tiposDocumento.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <p style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.85rem', margin: '0 0 12px' }}>Insertar bloque</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(Object.entries(BLOCK_LABELS) as [BlockType, string][]).map(([type, label]) => {
                const Icon = BLOCK_ICONS[type];
                return (
                  <button key={type} onClick={() => agregar(type)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                    <Icon size={14} color={ORANGE} /> {label}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 20, padding: 14, borderRadius: 12, backgroundColor: `${ORANGE}08`, border: `1px solid ${ORANGE}20` }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.78rem', fontWeight: '700', color: ORANGE }}>Atajos de teclado</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.6 }}>
                Click en un bloque para editar<br />
                ESC para deseleccionar<br />
                Preview para ver el A4 final
              </p>
            </div>
          </div>
        )}

        {/* Área A4 */}
        <div style={{ overflowY: 'auto', backgroundColor: '#4B5563', padding: 32, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 794, minHeight: 1123, backgroundColor: '#fff', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', padding: '80px 72px', boxSizing: 'border-box' }}>
            {/* Header del doc */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.3rem', color: ORANGE }}>ODDY</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Marketplace Builder v1.5</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600' }}>{tipoDoc}</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Nº {Math.floor(Math.random() * 9000) + 1000} · 2026</div>
              </div>
            </div>

            {bloques.map((bloque) => (
              <div key={bloque.id} style={{ position: 'relative' }}
                onClick={() => !preview && setEditando(bloque.id === editando ? null : bloque.id)}>
                {!preview && editando === bloque.id ? (
                  <div style={{ border: `2px solid ${ORANGE}`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                    {bloque.type === 'divider' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Minus size={16} color={ORANGE} />
                        <span style={{ fontSize: '0.78rem', color: ORANGE }}>Línea separadora</span>
                      </div>
                    ) : (
                      <textarea
                        value={bloque.content}
                        onChange={e => actualizar(bloque.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        autoFocus
                        rows={bloque.type === 'p' || bloque.type === 'list' ? 4 : 2}
                        style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', resize: 'vertical', backgroundColor: 'transparent', boxSizing: 'border-box' }}
                      />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                      <button onClick={e => { e.stopPropagation(); eliminar(bloque.id); }}
                        style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 size={11} /> Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ cursor: preview ? 'default' : 'pointer', borderRadius: 6, padding: 2, transition: 'background 0.1s' }}
                    onMouseEnter={e => { if (!preview) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    {renderBlock(bloque)}
                  </div>
                )}
              </div>
            ))}

            {/* Firma */}
            <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
              {['Parte A', 'Parte B'].map(p => (
                <div key={p} style={{ borderTop: '1px solid #1A1A2E', paddingTop: 10 }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280' }}>{p} · Firma y aclaración</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
