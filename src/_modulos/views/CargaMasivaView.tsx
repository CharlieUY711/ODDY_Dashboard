/* =====================================================
   CargaMasivaView — Upload Masivo de Archivos
   Drag & Drop · Queue con progreso · CSV · Imágenes · Docs
   ===================================================== */
import React, { useState, useRef } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Upload, FileText, Image, File, CheckCircle, XCircle, Clock, Trash2, Play, Pause, Download, AlertTriangle } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type FileStatus = 'pendiente' | 'subiendo' | 'completado' | 'error';
type FileType = 'csv' | 'imagen' | 'pdf' | 'doc' | 'otro';

interface UploadFile {
  id: number; nombre: string; tamaño: string; tipo: FileType;
  estado: FileStatus; progreso: number; error?: string; categoria: string;
}

function getFileType(name: string): FileType {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['csv', 'xlsx', 'xls'].includes(ext)) return 'csv';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'imagen';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'otro';
}

function FileIcon({ tipo }: { tipo: FileType }) {
  const props = { size: 20 };
  switch (tipo) {
    case 'csv':    return <FileText {...props} color="#10B981" />;
    case 'imagen': return <Image {...props} color="#3B82F6" />;
    case 'pdf':    return <FileText {...props} color="#EF4444" />;
    case 'doc':    return <FileText {...props} color="#1D4ED8" />;
    default:       return <File {...props} color="#6B7280" />;
  }
}

const estadoStyle: Record<FileStatus, { bg: string; color: string; label: string }> = {
  pendiente:  { bg: '#F3F4F6', color: '#6B7280', label: 'Pendiente' },
  subiendo:   { bg: `${ORANGE}15`, color: ORANGE, label: 'Subiendo' },
  completado: { bg: '#D1FAE5', color: '#059669', label: 'Completado' },
  error:      { bg: '#FEE2E2', color: '#DC2626', label: 'Error' },
};

const archivosDemo: UploadFile[] = [
  { id: 1, nombre: 'productos_catalogo_feb2026.csv', tamaño: '2.4 MB', tipo: 'csv', estado: 'completado', progreso: 100, categoria: 'Catálogo' },
  { id: 2, nombre: 'imagenes_producto_lote_01.zip', tamaño: '48 MB', tipo: 'imagen', estado: 'completado', progreso: 100, categoria: 'Imágenes' },
  { id: 3, nombre: 'clientes_importar.csv', tamaño: '890 KB', tipo: 'csv', estado: 'subiendo', progreso: 67, categoria: 'Clientes' },
  { id: 4, nombre: 'stock_bodega_central.xlsx', tamaño: '1.1 MB', tipo: 'csv', estado: 'pendiente', progreso: 0, categoria: 'Inventario' },
  { id: 5, nombre: 'precios_actualizados.csv', tamaño: '340 KB', tipo: 'csv', estado: 'error', progreso: 32, error: 'Formato de columna inválido en fila 145', categoria: 'Precios' },
];

const categorias = ['Catálogo', 'Imágenes', 'Clientes', 'Inventario', 'Precios', 'Pedidos', 'Otro'];

export function CargaMasivaView({ onNavigate }: Props) {
  const [archivos, setArchivos] = useState<UploadFile[]>(archivosDemo);
  const [isDragging, setIsDragging] = useState(false);
  const [categoria, setCategoria] = useState('Catálogo');
  const [pausado, setPausado] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const completados = archivos.filter(a => a.estado === 'completado').length;
  const errores = archivos.filter(a => a.estado === 'error').length;
  const subiendo = archivos.filter(a => a.estado === 'subiendo').length;
  const pendientes = archivos.filter(a => a.estado === 'pendiente').length;

  const agregarArchivo = (nombre: string, tamaño: number) => {
    const tipo = getFileType(nombre);
    const tamStr = tamaño > 1024 * 1024 ? `${(tamaño / 1024 / 1024).toFixed(1)} MB` : `${Math.round(tamaño / 1024)} KB`;
    const f: UploadFile = { id: Date.now(), nombre, tamaño: tamStr, tipo, estado: 'pendiente', progreso: 0, categoria };
    setArchivos(prev => [...prev, f]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(f => agregarArchivo(f.name, f.size));
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(f => agregarArchivo(f.name, f.size));
  };

  const eliminar = (id: number) => setArchivos(prev => prev.filter(a => a.id !== id));
  const reintentar = (id: number) => setArchivos(prev => prev.map(a => a.id === id ? { ...a, estado: 'pendiente', progreso: 0, error: undefined } : a));

  const totalBytes = 52.7; // MB simulado

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Upload}
        title="Carga Masiva de Archivos"
        subtitle="Drag & Drop · Queue con progreso · CSV, imágenes, docs · Categorías · Signed URLs"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Completados', value: completados, icon: '✅', color: '#10B981' },
            { label: 'Subiendo', value: subiendo, icon: '📤', color: ORANGE },
            { label: 'Pendientes', value: pendientes, icon: '⏳', color: '#3B82F6' },
            { label: 'Errores', value: errores, icon: '❌', color: '#EF4444' },
            { label: 'Total subido', value: `${totalBytes} MB`, icon: '💾', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{k.icon}</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{k.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Zona Drag & Drop */}
        <div
          ref={dropRef}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{ border: `2px dashed ${isDragging ? ORANGE : '#D1D5DB'}`, borderRadius: 16, padding: '40px 24px', textAlign: 'center', backgroundColor: isDragging ? `${ORANGE}08` : '#fff', transition: 'all 0.2s', marginBottom: 24, cursor: 'pointer' }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: `${ORANGE}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Upload size={28} color={ORANGE} />
          </div>
          <p style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 8, fontSize: '1rem' }}>
            {isDragging ? '¡Suelta los archivos aquí!' : 'Arrastrá archivos aquí'}
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 20 }}>
            CSV, XLSX, imágenes (JPG/PNG/WEBP), PDF, DOC · Hasta 500 MB por archivo
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <select value={categoria} onChange={e => setCategoria(e.target.value)}
                style={{ padding: '9px 14px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.85rem', outline: 'none', backgroundColor: '#fff' }}>
                {categorias.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <label style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={15} /> Elegir archivos
              <input type="file" multiple onChange={onInputChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Controles de cola */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>
            Cola de archivos — {archivos.length} archivos
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPausado(!pausado)}
              style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {pausado ? <Play size={13} /> : <Pause size={13} />}
              {pausado ? 'Reanudar' : 'Pausar todo'}
            </button>
            <button onClick={() => setArchivos(archivosDemo.filter(a => a.estado === 'completado'))}
              style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Trash2 size={13} /> Limpiar completados
            </button>
          </div>
        </div>

        {/* Lista de archivos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {archivos.map(archivo => {
            const st = estadoStyle[archivo.estado];
            return (
              <div key={archivo.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
                {archivo.estado === 'subiendo' && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: `${archivo.progreso}%`, backgroundColor: ORANGE, transition: 'width 0.5s' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileIcon tipo={archivo.tipo} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.88rem' }}>{archivo.nombre}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.68rem', fontWeight: '600' }}>{archivo.categoria}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: st.bg, color: st.color, fontSize: '0.68rem', fontWeight: '700' }}>{st.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{archivo.tamaño}</span>
                      {archivo.estado === 'subiendo' && (
                        <>
                          <div style={{ flex: 1, maxWidth: 200, height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${archivo.progreso}%`, backgroundColor: ORANGE, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: ORANGE, fontWeight: '700' }}>{archivo.progreso}%</span>
                        </>
                      )}
                      {archivo.error && (
                        <span style={{ fontSize: '0.72rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertTriangle size={11} /> {archivo.error}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {archivo.estado === 'completado' && (
                      <button style={{ padding: '6px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer' }}>
                        <Download size={14} color="#6B7280" />
                      </button>
                    )}
                    {archivo.estado === 'error' && (
                      <button onClick={() => reintentar(archivo.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', backgroundColor: `${ORANGE}10`, color: ORANGE, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                        Reintentar
                      </button>
                    )}
                    <button onClick={() => eliminar(archivo.id)} style={{ padding: '6px', borderRadius: 8, border: 'none', backgroundColor: '#FEE2E2', cursor: 'pointer' }}>
                      <Trash2 size={14} color="#DC2626" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
