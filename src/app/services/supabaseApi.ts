/* =====================================================
   Supabase API Service — Frontend ↔ Edge Functions
   ODDY Marketplace Backend
   ===================================================== */
const SUPABASE_URL = 'https://yomgqobfmgatavnbtvdz.supabase.co';
const BASE_URL = `${SUPABASE_URL}/functions/v1`;

// Obtener anon key de variables de entorno o usar fallback
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWdxb2JmbWdhdGF2bmJ0dmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MzAzMTksImV4cCI6MjA4NjAwNjMxOX0.yZ9Zb6Jz9BKZTkn7Ld8TzeLyHsb8YhBAoCvFLPBiqZk';

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${anonKey}`,
};

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
    const data = await res.json();
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

async function apiPost<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

async function apiPut<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: HEADERS,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/* ── Artículos API ── */

export interface ProductoFiltros {
  page?: number;
  limit?: number;
  tipo?: 'market' | 'secondhand';
}

export async function getProductos(tipo: 'market' | 'secondhand' = 'market', filtros?: ProductoFiltros) {
  const params = new URLSearchParams();
  params.set('tipo', tipo);
  if (filtros?.page) params.set('page', filtros.page.toString());
  if (filtros?.limit) params.set('limit', filtros.limit.toString());
  
  return apiGet(`/articulos/productos?${params.toString()}`);
}

export async function getProducto(id: string, tipo: 'market' | 'secondhand' = 'market') {
  return apiGet(`/articulos/productos/${id}?tipo=${tipo}`);
}

export async function createProducto(data: unknown, tipo: 'market' | 'secondhand' = 'market') {
  return apiPost(`/articulos/productos?tipo=${tipo}`, data);
}

export async function updateProducto(id: string, data: unknown, tipo: 'market' | 'secondhand' = 'market') {
  return apiPut(`/articulos/productos/${id}?tipo=${tipo}`, data);
}

export async function deleteProducto(id: string, tipo: 'market' | 'secondhand' = 'market') {
  return apiDelete(`/articulos/productos/${id}?tipo=${tipo}`);
}

export async function getStock(variante_id: string) {
  return apiGet(`/articulos/stock/${variante_id}`);
}

export async function updateStock(variante_id: string, data: { cantidad?: number; reservado?: number }) {
  return apiPut(`/articulos/stock/${variante_id}`, data);
}

export async function getVariantes(producto_id: string) {
  return apiGet(`/articulos/variantes/${producto_id}`);
}

export async function createVariante(producto_id: string, data: unknown) {
  return apiPost(`/articulos/variantes/${producto_id}`, data);
}

export async function updateVariante(producto_id: string, variante_id: string, data: unknown) {
  return apiPut(`/articulos/variantes/${producto_id}?variante_id=${variante_id}`, { id: variante_id, ...data });
}

export async function deleteVariante(producto_id: string, variante_id: string) {
  return apiDelete(`/articulos/variantes/${producto_id}?variante_id=${variante_id}`);
}

export async function getCategorias(tienda_id?: string) {
  const params = tienda_id ? `?tienda_id=${tienda_id}` : '';
  return apiGet(`/articulos/categorias${params}`);
}

export async function createCategoria(data: unknown) {
  return apiPost('/articulos/categorias', data);
}

export async function updateCategoria(data: { id: string; [key: string]: unknown }) {
  return apiPut('/articulos/categorias', data);
}

export async function getDepartamentosArticulos() {
  return apiGet('/articulos/departamentos');
}

export async function createDepartamentoArticulo(data: unknown) {
  return apiPost('/articulos/departamentos', data);
}

export async function updateDepartamentoArticulo(data: { id: string; [key: string]: unknown }) {
  return apiPut('/articulos/departamentos', data);
}

export async function deleteDepartamentoArticulo(id: string) {
  return apiDelete(`/articulos/departamentos?id=${id}`);
}

/* ── Departamentos API ── */

export async function getDepartamentos(conConteo?: boolean) {
  const params = conConteo ? '?con_conteo=true' : '';
  return apiGet(`/departamentos${params}`);
}

export async function getDepartamento(id: string, options?: { page?: number; limit?: number; tipo?: 'all' | 'market' | 'secondhand' }) {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.tipo) params.set('tipo', options.tipo);
  
  const queryString = params.toString();
  return apiGet(`/departamentos/${id}${queryString ? `?${queryString}` : ''}`);
}

export async function createDepartamento(data: unknown) {
  return apiPost('/departamentos', data);
}

export async function updateDepartamento(id: string, data: unknown) {
  return apiPut(`/departamentos/${id}`, data);
}

export async function deleteDepartamento(id: string) {
  return apiDelete(`/departamentos/${id}`);
}

export async function reordenarDepartamentos(items: Array<{ id: string; orden: number }>) {
  return apiPut('/departamentos/orden', items);
}

/* ── Checkout API ── */

export async function getMetodosPago(tienda_id?: string) {
  const params = tienda_id ? `?tienda_id=${tienda_id}` : '';
  return apiGet(`/checkout/metodos-pago${params}`);
}

export async function getMetodosEnvio(tienda_id?: string) {
  const params = tienda_id ? `?tienda_id=${tienda_id}` : '';
  return apiGet(`/checkout/metodos-envio${params}`);
}

export async function calcularCheckout(data: {
  items: Array<{ variante_id: string; cantidad: number }>;
  metodo_envio_id?: string;
}) {
  return apiPost('/checkout/calcular', data);
}

export async function confirmarPedido(data: {
  tienda_id: string;
  comprador_id: string;
  vendedor_id?: string;
  metodo_pago_id: string;
  metodo_envio_id?: string;
  items: Array<{ variante_id: string; cantidad: number }>;
  notas?: string;
  metadata?: unknown;
}) {
  return apiPost('/checkout/confirmar', data);
}

/* ── Pedidos API ── */

export interface PedidosFiltros {
  estado?: string;
  comprador_id?: string;
  vendedor_id?: string;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

export async function getPedidos(filtros?: PedidosFiltros) {
  const params = new URLSearchParams();
  if (filtros?.estado) params.set('estado', filtros.estado);
  if (filtros?.comprador_id) params.set('comprador_id', filtros.comprador_id);
  if (filtros?.vendedor_id) params.set('vendedor_id', filtros.vendedor_id);
  if (filtros?.desde) params.set('desde', filtros.desde);
  if (filtros?.hasta) params.set('hasta', filtros.hasta);
  if (filtros?.page) params.set('page', filtros.page.toString());
  if (filtros?.limit) params.set('limit', filtros.limit.toString());
  
  const queryString = params.toString();
  return apiGet(`/pedidos${queryString ? `?${queryString}` : ''}`);
}

export async function getPedido(id: string) {
  return apiGet(`/pedidos/${id}`);
}

export async function getStatsPedidos(tienda_id?: string, desde?: string, hasta?: string) {
  const params = new URLSearchParams();
  if (tienda_id) params.set('tienda_id', tienda_id);
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  
  const queryString = params.toString();
  return apiGet(`/pedidos/stats${queryString ? `?${queryString}` : ''}`);
}

export async function cambiarEstadoPedido(id: string, estado: string) {
  return apiPut(`/pedidos/${id}/estado`, { estado });
}

export async function cambiarEstadoPago(id: string, estado_pago: string) {
  return apiPut(`/pedidos/${id}/pago`, { estado_pago });
}

export async function cancelarPedido(id: string) {
  return apiDelete(`/pedidos/${id}`);
}

/* ── Export API Object ── */

export const api = {
  // Artículos
  articulos: {
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    getStock,
    updateStock,
    getVariantes,
    createVariante,
    updateVariante,
    deleteVariante,
    getCategorias,
    createCategoria,
    updateCategoria,
    getDepartamentos: getDepartamentosArticulos,
    createDepartamento: createDepartamentoArticulo,
    updateDepartamento: updateDepartamentoArticulo,
    deleteDepartamento: deleteDepartamentoArticulo,
  },
  // Departamentos
  departamentos: {
    getDepartamentos,
    getDepartamento,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    reordenarDepartamentos,
  },
  // Checkout
  checkout: {
    getMetodosPago,
    getMetodosEnvio,
    calcularCheckout,
    confirmarPedido,
  },
  // Pedidos
  pedidos: {
    getPedidos,
    getPedido,
    getStatsPedidos,
    cambiarEstadoPedido,
    cambiarEstadoPago,
    cancelarPedido,
  },
};
