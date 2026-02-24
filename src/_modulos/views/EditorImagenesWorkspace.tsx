/* =====================================================
   EditorImagenesWorkspace — Editor de Imágenes CSS
   Filtros · Rotación · Flip · 8 Presets · Export PNG/JPG
   ===================================================== */
import React, { useState, useRef } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Image, Upload, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Sliders, RefreshCw } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Filtros {
  brillo: number; contraste: number; saturacion: number; nitidez: number;
  blur: number; sepia: number; grises: number; huerotate: number;
}

const filtrosDefault: Filtros = {
  brillo: 100, contraste: 100, saturacion: 100, nitidez: 0,
  blur: 0, sepia: 0, grises: 0, huerotate: 0,
};

const presets = [
  { nombre: 'Original', filtros: { ...filtrosDefault } },
  { nombre: 'Vivid', filtros: { ...filtrosDefault, brillo: 110, contraste: 120, saturacion: 140 } },
  { nombre: 'Matte', filtros: { ...filtrosDefault, brillo: 105, contraste: 90, saturacion: 80 } },
  { nombre: 'Sepia', filtros: { ...filtrosDefault, sepia: 80, saturacion: 60 } },
  { nombre: 'B&W', filtros: { ...filtrosDefault, grises: 100 } },
  { nombre: 'Cool', filtros: { ...filtrosDefault, huerotate: 180, saturacion: 80, brillo: 105 } },
  { nombre: 'Warm', filtros: { ...filtrosDefault, huerotate: 330, saturacion: 120, brillo: 108 } },
  { nombre: 'Fade', filtros: { ...filtrosDefault, brillo: 115, contraste: 85, saturacion: 70, grises: 15 } },
];

const sliders = [
  { key: 'brillo', label: 'Brillo', min: 0, max: 200, unit: '%' },
  { key: 'contraste', label: 'Contraste', min: 0, max: 200, unit: '%' },
  { key: 'saturacion', label: 'Saturación', min: 0, max: 300, unit: '%' },
  { key: 'huerotate', label: 'Tono', min: 0, max: 360, unit: '°' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
  { key: 'grises', label: 'Grises', min: 0, max: 100, unit: '%' },
  { key: 'blur', label: 'Desenfoque', min: 0, max: 10, unit: 'px' },
];

export function EditorImagenesWorkspace({ onNavigate }: Props) {
  const [filtros, setFiltros] = useState<Filtros>({ ...filtrosDefault });
  const [rotacion, setRotacion] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [formato, setFormato] = useState<'png' | 'jpg'>('png');
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const cssFilter = `brightness(${filtros.brillo}%) contrast(${filtros.contraste}%) saturate(${filtros.saturacion}%) hue-rotate(${filtros.huerotate}deg) sepia(${filtros.sepia}%) grayscale(${filtros.grises}%) blur(${filtros.blur}px)`;
  const cssTransform = `rotate(${rotacion}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const aplicarPreset = (p: typeof presets[0]) => setFiltros({ ...p.filtros });

  const resetear = () => {
    setFiltros({ ...filtrosDefault });
    setRotacion(0); setFlipH(false); setFlipV(false);
  };

  const exportar = () => {
    const canvas = document.createElement('canvas');
    const img = imgRef.current;
    if (!img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.filter = cssFilter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotacion * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
    const a = document.createElement('a');
    a.href = canvas.toDataURL(`image/${formato}`);
    a.download = `imagen-editada.${formato}`;
    a.click();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Image}
        title="Editor de Imágenes"
        subtitle="Filtros CSS · Rotación · Flip · 8 presets · Export PNG/JPG · 100% browser"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: '⬆ Subir imagen', onClick: () => fileRef.current?.click() },
        ]}
      />
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 0 }}>

        {/* Canvas central */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid #E9ECEF' }}>
          {/* Toolbar */}
          <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button onClick={() => setRotacion(r => r - 90)} style={btnStyle}><RotateCcw size={15} /> -90°</button>
            <button onClick={() => setRotacion(r => r + 90)} style={btnStyle}><RotateCw size={15} /> +90°</button>
            <div style={{ width: 1, height: 24, backgroundColor: '#E5E7EB', margin: '0 4px' }} />
            <button onClick={() => setFlipH(!flipH)} style={{ ...btnStyle, ...(flipH ? { backgroundColor: `${ORANGE}15`, color: ORANGE, borderColor: `${ORANGE}40` } : {}) }}>
              <FlipHorizontal size={15} /> H
            </button>
            <button onClick={() => setFlipV(!flipV)} style={{ ...btnStyle, ...(flipV ? { backgroundColor: `${ORANGE}15`, color: ORANGE, borderColor: `${ORANGE}40` } : {}) }}>
              <FlipVertical size={15} /> V
            </button>
            <div style={{ width: 1, height: 24, backgroundColor: '#E5E7EB', margin: '0 4px' }} />
            <button onClick={resetear} style={btnStyle}><RefreshCw size={15} /> Reset</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={formato} onChange={e => setFormato(e.target.value as 'png' | 'jpg')}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: '0.82rem', outline: 'none' }}>
                <option value="png">PNG</option><option value="jpg">JPG</option>
              </select>
              <button onClick={exportar} disabled={!imgSrc}
                style={{ padding: '8px 16px', borderRadius: 9, border: 'none', backgroundColor: imgSrc ? ORANGE : '#E5E7EB', color: imgSrc ? '#fff' : '#9CA3AF', fontWeight: '700', fontSize: '0.82rem', cursor: imgSrc ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} /> Exportar
              </button>
            </div>
          </div>

          {/* Área de imagen */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A2E', padding: 24 }}>
            {imgSrc ? (
              <img ref={imgRef} src={imgSrc} alt="Editando"
                style={{ maxWidth: '100%', maxHeight: '100%', filter: cssFilter, transform: cssTransform, objectFit: 'contain', borderRadius: 8, transition: 'filter 0.1s, transform 0.15s' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#2D2D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Upload size={32} color="#6B7280" />
                </div>
                <p style={{ color: '#9CA3AF', marginBottom: 16, fontSize: '0.88rem' }}>Subí una imagen para comenzar a editar</p>
                <button onClick={() => fileRef.current?.click()}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', marginBottom: 20 }}>
                  Elegir archivo
                </button>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '0.78rem', marginBottom: 10 }}>O probar con imágenes de muestra:</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {sampleImages.map((url, i) => (
                      <img key={i} src={url} alt="muestra" onClick={() => setImgSrc(url)}
                        style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = ORANGE)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ overflowY: 'auto', backgroundColor: '#fff' }}>
          {/* Presets */}
          <div style={{ padding: '16px 16px 0' }}>
            <p style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.85rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={14} color={ORANGE} /> Presets
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              {presets.map(p => (
                <button key={p.nombre} onClick={() => aplicarPreset(p)}
                  style={{ padding: '8px 4px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}>
                  {p.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sliders.map(s => (
              <div key={s.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.78rem', color: '#374151', fontWeight: '600' }}>{s.label}</label>
                  <span style={{ fontSize: '0.78rem', color: ORANGE, fontWeight: '700' }}>{filtros[s.key as keyof Filtros]}{s.unit}</span>
                </div>
                <input type="range" min={s.min} max={s.max} value={filtros[s.key as keyof Filtros]}
                  onChange={e => setFiltros(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: ORANGE }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '7px 12px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB',
  color: '#374151', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 5,
};
