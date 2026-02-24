/* =====================================================
   OCRWorkspace — Reconocimiento de Texto desde Imagen
   Simulado en browser · Sin APIs externas · Export TXT
   ===================================================== */
import React, { useState, useRef } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ScanLine, Upload, Copy, Download, RefreshCw, CheckCircle, FileText, Globe } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const IDIOMAS = [
  { value: 'spa', label: '🇪🇸 Español' },
  { value: 'eng', label: '🇬🇧 Inglés' },
  { value: 'por', label: '🇧🇷 Portugués' },
];

// Textos demo por tipo de imagen (simulado)
const TEXTOS_DEMO: Record<string, string> = {
  factura: `FACTURA Nº 001-00082341
Fecha: 24/02/2026
ODDY Marketplace SRL
RUT: 21.234.567-0

CLIENTE: Juan Pérez García
DNI: 4.321.890-8
Email: juan.perez@email.com

DETALLE:
Código    Descripción                  Cant.  P.Unit   Total
PRD-001   Auriculares Bluetooth Pro     1     $1,890   $1,890
PRD-002   Funda protectora             2       $380      $760
PRD-006   Envío OCA - Montevideo        1       $280      $280

                              Subtotal:    $2,930
                              IVA 22%:       $645
                              TOTAL:       $3,575

Forma de pago: Tarjeta de crédito VISA
Estado: PAGADO`,

  texto: `CHARLIE MARKETPLACE BUILDER v1.5
Sistema de Gestión Enterprise

MÓDULOS PRINCIPALES:
✓ eCommerce (Pedidos, Pagos, Catálogo)
✓ Logística (Envíos, Rutas, Fulfillment)
✓ Marketing (Email, SEO, RRSS, Ads)
✓ ERP/CRM (Inventario, Facturación, RRHH)
✓ Integraciones (Plexo, ML, Twilio)

Desarrollado por el Equipo ODDY
Versión: 1.5.0 - Febrero 2026`,

  tarjeta: `TARJETA DE PRESENTACIÓN

María López González
Directora de Marketing
ODDY Store UY

📧 maria.lopez@oddy.uy
📱 +598 91 234 567
🌐 www.oddy.uy
📍 Montevideo, Uruguay

"Impulsando el comercio digital"`,
};

export function OCRWorkspace({ onNavigate }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [idioma, setIdioma] = useState('spa');
  const [copiado, setCopiado] = useState(false);
  const [historial, setHistorial] = useState<{ nombre: string; texto: string; fecha: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImgSrc(ev.target?.result as string);
      setTexto('');
    };
    reader.readAsDataURL(file);
  };

  const procesarOCR = () => {
    if (!imgSrc) return;
    setProcesando(true);
    setProgreso(0);
    setTexto('');

    // Simulación de progreso realista
    const steps = [10, 25, 40, 55, 70, 85, 95, 100];
    let i = 0;
    const interval = setInterval(() => {
      setProgreso(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        // Elegir texto demo al azar
        const demos = Object.values(TEXTOS_DEMO);
        const resultado = demos[Math.floor(Math.random() * demos.length)];
        setTexto(resultado);
        setHistorial(prev => [{ nombre: `Documento ${prev.length + 1}`, texto: resultado, fecha: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
        setProcesando(false);
      }
    }, 300);
  };

  const copiar = () => {
    navigator.clipboard.writeText(texto).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); });
  };

  const exportarTXT = () => {
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ocr-resultado.txt';
    a.click();
  };

  const probarDemo = (tipo: keyof typeof TEXTOS_DEMO) => {
    const src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:#f3f4f6"><text x="50" y="80" font-family="Arial" font-size="18" fill="#374151">Demo: ${tipo}</text></svg>`)}`;
    setImgSrc(src);
    setTexto('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ScanLine}
        title="OCR — Texto desde Imagen"
        subtitle="Reconocimiento simulado · 3 idiomas · Sin APIs externas · Export TXT · 100% browser"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: '⬆ Subir imagen', onClick: () => fileRef.current?.click() },
        ]}
      />
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

        {/* Izquierda — Imagen */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E9ECEF', overflow: 'hidden' }}>
          {/* Configuración */}
          <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={14} color={ORANGE} />
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151' }}>Idioma:</label>
              <select value={idioma} onChange={e => setIdioma(e.target.value)}
                style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: '0.82rem', outline: 'none', backgroundColor: '#fff' }}>
                {IDIOMAS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <button onClick={procesarOCR} disabled={!imgSrc || procesando}
              style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 10, border: 'none', backgroundColor: !imgSrc || procesando ? '#E5E7EB' : ORANGE, color: !imgSrc || procesando ? '#9CA3AF' : '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: !imgSrc || procesando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScanLine size={14} /> {procesando ? `Procesando ${progreso}%...` : 'Reconocer texto'}
            </button>
          </div>

          {/* Barra de progreso */}
          {procesando && (
            <div style={{ height: 4, backgroundColor: '#F3F4F6', flexShrink: 0 }}>
              <div style={{ height: '100%', width: `${progreso}%`, backgroundColor: ORANGE, transition: 'width 0.3s' }} />
            </div>
          )}

          <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
            {imgSrc ? (
              <img src={imgSrc} alt="Para OCR" style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: `${ORANGE}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={32} color={ORANGE} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 6 }}>Subí una imagen con texto</p>
                  <p style={{ fontSize: '0.82rem', color: '#9CA3AF', marginBottom: 20 }}>JPG, PNG, WEBP, TIFF — máx. 5 MB</p>
                  <button onClick={() => fileRef.current?.click()}
                    style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', marginBottom: 20 }}>
                    Elegir imagen
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 280 }}>
                  <p style={{ fontSize: '0.78rem', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>O probar con demos:</p>
                  {Object.keys(TEXTOS_DEMO).map(tipo => (
                    <button key={tipo} onClick={() => probarDemo(tipo as keyof typeof TEXTOS_DEMO)}
                      style={{ padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={14} color={ORANGE} /> Demo: {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Derecha — Resultado */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={15} color={ORANGE} /> Texto reconocido
            </span>
            {texto && (
              <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: '#D1FAE5', color: '#059669', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={11} /> {texto.length} caracteres
              </span>
            )}
            {texto && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={copiar} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: copiado ? '#059669' : '#374151', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Copy size={12} /> {copiado ? 'Copiado' : 'Copiar'}
                </button>
                <button onClick={exportarTXT} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', backgroundColor: ORANGE, color: '#fff', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Download size={12} /> Export TXT
                </button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
            {texto ? (
              <textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                style={{ flex: 1, minHeight: 300, padding: 16, borderRadius: 12, border: '1px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none', resize: 'vertical', lineHeight: 1.7, backgroundColor: '#FAFAFA', color: '#1A1A2E' }}
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textAlign: 'center' }}>
                <div>
                  <ScanLine size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p style={{ fontSize: '0.88rem' }}>El texto reconocido aparecerá aquí</p>
                  <p style={{ fontSize: '0.78rem' }}>Podés editar el resultado antes de exportar</p>
                </div>
              </div>
            )}

            {/* Historial */}
            {historial.length > 0 && (
              <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
                <p style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.85rem', margin: '0 0 10px' }}>📋 Historial reciente</p>
                {historial.map((h, i) => (
                  <div key={i} onClick={() => setTexto(h.texto)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < historial.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: '600' }}>{h.nombre}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{h.fecha}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
