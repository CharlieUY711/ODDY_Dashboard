/* =====================================================
   QrCodeDisplay — Componente reutilizable interno
   Genera QR codes con la librería qrcode (sin APIs externas)
   ===================================================== */
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export interface QrCodeOptions {
  size?:            number;   // px (default 200)
  darkColor?:       string;   // default '#000000'
  lightColor?:      string;   // default '#FFFFFF'
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'; // default 'M'
  margin?:          number;   // quiet zone modules (default 2)
}

interface QrCodeDisplayProps {
  value:        string;
  options?:     QrCodeOptions;
  className?:   string;
  style?:       React.CSSProperties;
  /** callback con el dataURL una vez generado */
  onGenerated?: (dataUrl: string) => void;
}

/**
 * Genera el QR internamente con canvas y devuelve un <img>.
 * Sin dependencias externas, funciona offline.
 */
export function QrCodeDisplay({ value, options = {}, className, style, onGenerated }: QrCodeDisplayProps) {
  const {
    size            = 200,
    darkColor       = '#000000',
    lightColor      = '#FFFFFF',
    errorCorrection = 'M',
    margin          = 2,
  } = options;

  const [dataUrl, setDataUrl] = useState<string>('');
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!value) return;
    setError(false);

    QRCode.toDataURL(value, {
      width:          size,
      margin,
      errorCorrectionLevel: errorCorrection,
      color: { dark: darkColor, light: lightColor },
    })
      .then(url => {
        setDataUrl(url);
        onGenerated?.(url);
      })
      .catch(() => setError(true));
  }, [value, size, darkColor, lightColor, errorCorrection, margin]);

  if (error) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E5E7EB', borderRadius: '8px', color: '#9CA3AF', fontSize: '12px', ...style }}>
        Error
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div style={{ width: size, height: size, backgroundColor: '#F3F4F6', borderRadius: '8px', ...style }} />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR: ${value}`}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', ...style }}
    />
  );
}

/* ── Helper: generar dataURL programáticamente (para descargar) ── */
export async function generateQrDataUrl(value: string, options: QrCodeOptions = {}): Promise<string> {
  const {
    size            = 200,
    darkColor       = '#000000',
    lightColor      = '#FFFFFF',
    errorCorrection = 'M',
    margin          = 2,
  } = options;

  return QRCode.toDataURL(value, {
    width: size,
    margin,
    errorCorrectionLevel: errorCorrection,
    color: { dark: darkColor, light: lightColor },
  });
}

/* ── Helper: generar SVG string ── */
export async function generateQrSvg(value: string, options: QrCodeOptions = {}): Promise<string> {
  const {
    size            = 200,
    darkColor       = '#000000',
    lightColor      = '#FFFFFF',
    errorCorrection = 'M',
    margin          = 2,
  } = options;

  return QRCode.toString(value, {
    type:   'svg',
    width:  size,
    margin,
    errorCorrectionLevel: errorCorrection,
    color: { dark: darkColor, light: lightColor },
  });
}

/* ── Helper: descargar QR como PNG ── */
export async function downloadQrPng(value: string, filename = 'qrcode', options: QrCodeOptions = {}): Promise<void> {
  const dataUrl = await generateQrDataUrl(value, { ...options, size: options.size ?? 600 });
  const a = document.createElement('a');
  a.href     = dataUrl;
  a.download = `${filename}.png`;
  a.click();
}

/* ── Helper: descargar QR como SVG ── */
export async function downloadQrSvg(value: string, filename = 'qrcode', options: QrCodeOptions = {}): Promise<void> {
  const svg = await generateQrSvg(value, options);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
