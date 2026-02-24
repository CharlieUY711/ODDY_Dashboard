/* =====================================================
   POSView — Punto de Venta (POS)
   Terminal de caja estilo supermercado
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ScanLine, Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, Smartphone, CheckCircle } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const productos = [
  { sku: 'PRD-0001', nombre: 'Auriculares Bluetooth Pro', precio: 1890, emoji: '🎧', categoria: 'Electrónica' },
  { sku: 'PRD-0002', nombre: 'Zapatillas Running X200', precio: 3450, emoji: '👟', categoria: 'Calzado' },
  { sku: 'PRD-0004', nombre: 'Smartwatch Fitness Band', precio: 2890, emoji: '⌚', categoria: 'Electrónica' },
  { sku: 'PRD-0006', nombre: 'Silla Ergonómica Home Office', precio: 8900, emoji: '🪑', categoria: 'Hogar' },
  { sku: 'PRD-0008', nombre: 'Proteína Whey 1kg', precio: 1800, emoji: '💪', categoria: 'Nutrición' },
  { sku: 'PRD-0010', nombre: 'Agenda Ejecutiva 2026', precio: 480, emoji: '📓', categoria: 'Librería' },
  { sku: 'PRD-0005', nombre: 'Camiseta Algodón Orgánico', precio: 650, emoji: '👕', categoria: 'Ropa' },
  { sku: 'PRD-0009', nombre: 'Lámpara LED Escritorio', precio: 990, emoji: '💡', categoria: 'Hogar' },
];

interface CarritoItem { sku: string; nombre: string; precio: number; emoji: string; cantidad: number; descuento: number; }

const metodosPago = [
  { id: 'efectivo', emoji: '💵', label: 'Efectivo' },
  { id: 'tarjeta', emoji: '💳', label: 'Tarjeta' },
  { id: 'qr', emoji: '📱', label: 'QR/App' },
  { id: 'credito', emoji: '🔄', label: 'Crédito' },
];

export function POSView({ onNavigate }: Props) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [search, setSearch] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [descGlobal, setDescGlobal] = useState(0);
  const [completado, setCompletado] = useState(false);

  const agregar = (p: typeof productos[0]) => {
    setCarrito(prev => {
      const ex = prev.find(c => c.sku === p.sku);
      if (ex) return prev.map(c => c.sku === p.sku ? { ...c, cantidad: c.cantidad + 1 } : c);
      return [...prev, { ...p, cantidad: 1, descuento: 0 }];
    });
  };

  const cambiarCantidad = (sku: string, d: number) => {
    setCarrito(prev => prev.map(c => c.sku === sku ? { ...c, cantidad: Math.max(1, c.cantidad + d) } : c));
  };

  const eliminar = (sku: string) => setCarrito(prev => prev.filter(c => c.sku !== sku));

  const subtotal = carrito.reduce((acc, c) => acc + c.precio * c.cantidad * (1 - c.descuento / 100), 0);
  const descuentoMonto = subtotal * (descGlobal / 100);
  const total = subtotal - descuentoMonto;
  const iva = total * 0.22;

  const lista = productos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  function cobrar() {
    if (carrito.length === 0) return;
    setCompletado(true);
    setTimeout(() => { setCompletado(false); setCarrito([]); setDescGlobal(0); }, 2500);
  }

  if (completado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
        <OrangeHeader icon={ScanLine} title="Punto de Venta" subtitle="" actions={[{ label: '← Volver', onClick: () => onNavigate('gestion') }]} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={40} color="#059669" />
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1A1A2E' }}>¡Venta completada!</div>
          <div style={{ fontWeight: '700', fontSize: '2rem', color: ORANGE }}>${total.toLocaleString('es', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Ticket enviado · Cajón abierto</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ScanLine}
        title="Punto de Venta (POS)"
        subtitle="Terminal de caja · Búsqueda · Múltiples métodos de pago"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '📊 Reportes POS', primary: false },
        ]}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, padding: '20px 24px' }}>
        {/* Catálogo */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: 14, flexShrink: 0 }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <ScanLine size={14} color="#9CA3AF" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, SKU o escanear código de barras..." style={{ width: '100%', paddingLeft: 32, paddingRight: 32, paddingTop: 10, paddingBottom: 10, border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, alignContent: 'flex-start' }}>
            {lista.map(p => (
              <button key={p.sku} onClick={() => agregar(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.1s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${ORANGE}`; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 2px 8px ${ORANGE}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.border = '1px solid #E5E7EB'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{p.emoji}</div>
                <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.3 }}>{p.nombre}</div>
                <div style={{ fontWeight: '800', color: ORANGE, fontSize: '1rem' }}>${p.precio.toLocaleString()}</div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: 3 }}>{p.sku}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={16} color={ORANGE} />
            <span style={{ fontWeight: '700', color: '#1A1A2E' }}>Carrito</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#9CA3AF' }}>{carrito.reduce((a, c) => a + c.cantidad, 0)} ítems</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                <ShoppingCart size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
                <div style={{ fontSize: '0.85rem' }}>Añadí productos al carrito</div>
              </div>
            ) : (
              carrito.map(c => (
                <div key={c.sku} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: ORANGE }}>${(c.precio * c.cantidad).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => cambiarCantidad(c.sku, -1)} style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={10} />
                    </button>
                    <span style={{ fontWeight: '700', color: '#1A1A2E', minWidth: 20, textAlign: 'center', fontSize: '0.85rem' }}>{c.cantidad}</span>
                    <button onClick={() => cambiarCantidad(c.sku, 1)} style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={10} />
                    </button>
                    <button onClick={() => eliminar(c.sku)} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', backgroundColor: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={10} color="#DC2626" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '14px 18px', borderTop: '1px solid #F3F4F6' }}>
            {/* Descuento */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '0.82rem', color: '#374151', flex: 1 }}>Descuento global (%)</span>
              <input type="number" value={descGlobal} onChange={e => setDescGlobal(Math.min(100, Math.max(0, Number(e.target.value))))} style={{ width: 60, padding: '5px 8px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '0.85rem', textAlign: 'center', outline: 'none' }} />
            </div>

            {/* Totales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14, padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px' }}>
              {[
                { label: 'Subtotal', value: `$${subtotal.toLocaleString('es', { maximumFractionDigits: 0 })}` },
                { label: `Descuento (${descGlobal}%)`, value: `-$${descuentoMonto.toLocaleString('es', { maximumFractionDigits: 0 })}`, color: '#DC2626' },
                { label: 'IVA (22%)', value: `$${iva.toLocaleString('es', { maximumFractionDigits: 0 })}` },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{t.label}</span>
                  <span style={{ fontSize: '0.8rem', color: t.color ?? '#374151' }}>{t.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #E5E7EB', marginTop: 4 }}>
                <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '0.95rem' }}>TOTAL</span>
                <span style={{ fontWeight: '900', color: ORANGE, fontSize: '1.1rem' }}>${total.toLocaleString('es', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Métodos de pago */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 12 }}>
              {metodosPago.map(m => (
                <button key={m.id} onClick={() => setMetodoPago(m.id)} style={{ padding: '8px 4px', borderRadius: '8px', border: `2px solid ${metodoPago === m.id ? ORANGE : '#E5E7EB'}`, backgroundColor: metodoPago === m.id ? `${ORANGE}10` : '#F9FAFB', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem' }}>{m.emoji}</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: '600', color: metodoPago === m.id ? ORANGE : '#9CA3AF', marginTop: 2 }}>{m.label}</div>
                </button>
              ))}
            </div>

            <button onClick={cobrar} disabled={carrito.length === 0} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: carrito.length === 0 ? '#E5E7EB' : ORANGE, color: carrito.length === 0 ? '#9CA3AF' : '#fff', fontWeight: '800', fontSize: '1rem', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CreditCard size={18} /> Cobrar ${total.toLocaleString('es', { maximumFractionDigits: 0 })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
