/* =====================================================
   RuedaSorteosView — Rueda de Sorteos interactiva
   ===================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { RotateCcw, Plus, Trash2, Trophy, Settings, Play, RefreshCw } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const COLORES = ['#FF6835', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#14B8A6', '#F97316'];

const historial = [
  { premio: '🎁 Descuento 20%', ganador: 'Ana García', fecha: '2026-02-23 14:32', icono: '🎁' },
  { premio: '🛍️ Envío Gratis', ganador: 'Carlos Rodríguez', fecha: '2026-02-22 10:15', icono: '🛍️' },
  { premio: '💎 Premio Mayor $500', ganador: 'María López', fecha: '2026-02-21 16:48', icono: '💎' },
  { premio: '☕ Café gratis', ganador: 'Roberto Fernández', fecha: '2026-02-20 09:22', icono: '☕' },
  { premio: '🎁 Descuento 10%', ganador: 'Laura Martínez', fecha: '2026-02-19 18:05', icono: '🎁' },
];

export function RuedaSorteosView({ onNavigate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [premios, setPremios] = useState([
    { texto: 'Descuento 20%', probabilidad: 30, emoji: '🎁' },
    { texto: 'Envío Gratis', probabilidad: 25, emoji: '🚀' },
    { texto: 'Premio Mayor $500', probabilidad: 5, emoji: '💎' },
    { texto: 'Café gratis', probabilidad: 20, emoji: '☕' },
    { texto: 'Descuento 10%', probabilidad: 15, emoji: '🏷️' },
    { texto: '¡Suerte la próxima!', probabilidad: 5, emoji: '😅' },
  ]);
  const [girando, setGirando] = useState(false);
  const [ganador, setGanador] = useState<string | null>(null);
  const [angulo, setAngulo] = useState(0);
  const [nuevoPremio, setNuevoPremio] = useState('');
  const animRef = useRef<number>(0);

  useEffect(() => {
    dibujarRueda(angulo);
  }, [premios, angulo]);

  function dibujarRueda(rot: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 12;
    const n = premios.length;
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    premios.forEach((p, i) => {
      const start = rot + i * arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORES[i % COLORES.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(p.texto, r - 10, 4);
      ctx.font = '14px sans-serif';
      ctx.fillText(p.emoji, r - 10 - ctx.measureText(p.texto).width - 6, 5);
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Puntero
    ctx.save();
    ctx.translate(cx + r + 10, cy);
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-4, -10);
    ctx.lineTo(-4, 10);
    ctx.closePath();
    ctx.fillStyle = ORANGE;
    ctx.fill();
    ctx.restore();
  }

  function girar() {
    if (girando) return;
    setGirando(true);
    setGanador(null);
    const vueltas = 5 + Math.random() * 5;
    const extra = Math.random() * Math.PI * 2;
    const totalAngulo = vueltas * Math.PI * 2 + extra;
    const duracion = 4000;
    const inicio = performance.now();
    const anguloInicio = angulo;

    function step(now: number) {
      const t = Math.min((now - inicio) / duracion, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      const actual = anguloInicio + totalAngulo * ease;
      setAngulo(actual);
      dibujarRueda(actual);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setGirando(false);
        const n = premios.length;
        const arc = (2 * Math.PI) / n;
        const norm = ((actual % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const idx = Math.floor(((Math.PI * 2 - norm) % (Math.PI * 2)) / arc) % n;
        setGanador(premios[idx].texto);
      }
    }
    animRef.current = requestAnimationFrame(step);
  }

  function agregarPremio() {
    if (!nuevoPremio.trim()) return;
    setPremios(p => [...p, { texto: nuevoPremio.trim(), probabilidad: 10, emoji: '🎁' }]);
    setNuevoPremio('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={RotateCcw}
        title="Rueda de Sorteos"
        subtitle="Gamificación para campañas · Spin & Win"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('marketing') },
          { label: '🔗 Generar Link', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Rueda */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1A2E', alignSelf: 'flex-start' }}>🎡 Rueda Interactiva</div>
            <div style={{ position: 'relative' }}>
              <canvas ref={canvasRef} width={380} height={380} style={{ borderRadius: '50%' }} />
            </div>
            <button
              onClick={girar}
              disabled={girando}
              style={{ padding: '14px 40px', borderRadius: '12px', border: 'none', backgroundColor: girando ? '#9CA3AF' : ORANGE, color: '#fff', fontSize: '1rem', fontWeight: '800', cursor: girando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Play size={18} /> {girando ? 'Girando...' : '¡Girar!'}
            </button>
            {ganador && (
              <div style={{ textAlign: 'center', padding: '16px 28px', borderRadius: '14px', border: `2px solid ${ORANGE}`, backgroundColor: `${ORANGE}10` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🎉</div>
                <div style={{ fontWeight: '800', color: ORANGE, fontSize: '1.1rem' }}>¡Ganaste!</div>
                <div style={{ color: '#1A1A2E', fontWeight: '600', marginTop: 4 }}>{ganador}</div>
              </div>
            )}
          </div>

          {/* Panel derecho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Premios */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} color={ORANGE} /> Configurar Premios
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input
                  value={nuevoPremio}
                  onChange={e => setNuevoPremio(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && agregarPremio()}
                  placeholder="Nombre del premio..."
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.83rem', outline: 'none' }}
                />
                <button onClick={agregarPremio} style={{ padding: '8px 12px', border: 'none', borderRadius: '8px', backgroundColor: ORANGE, color: '#fff', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {premios.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORES[i % COLORES.length], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.83rem', flex: 1 }}>{p.emoji} {p.texto}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.probabilidad}%</span>
                    <button onClick={() => setPremios(pr => pr.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Trash2 size={13} color="#EF4444" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={16} color={ORANGE} /> Historial de Ganadores
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {historial.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.2rem' }}>{h.icono}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: '600', color: '#1A1A2E' }}>{h.ganador}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{h.premio} · {h.fecha}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
