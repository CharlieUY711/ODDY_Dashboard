/**
 * supabaseApi.ts
 * Servicio para llamar a las Edge Functions de ODDY desde el Dashboard
 * Base URL: https://yomgqobfmgatavnbtvdz.supabase.co/functions/v1
 */

const BASE_URL = "https://yomgqobfmgatavnbtvdz.supabase.co/functions/v1";

const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
});

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Error desconocido");
  return json.data as T;
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type TipoProducto = "market" | "secondhand";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_original?: number;
  departamento_id?: string;
  departamento_nombre?: string;
  imagen_principal?: string;
  imagenes?: string[];
  vendedor_id?: string;
  rating?: number;
  estado?: string;
  [key: string]: unknown;
}

export interface Departamento {
  id: string;
  nombre: string;
  color?: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
  conteo_market?: number;
  conteo_secondhand?: number;
  conteo_total?: number;
}

export interface Pedido {
  id: string;
  tienda_id?: string;
  comprador_id?: string;
  vendedor_id?: string;
  metodo_pago_id?: string;
  estado: string;
  subtotal: number;
  descuento?: number;
  total: number;
  moneda?: string;
  notas?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Variante {
  id: string;
  producto_id: string;
  nombre: string;
  atributos?: Record<string, unknown>;
  precio_extra?: number;
  sku?: string;
  activo?: boolean;
}

export interface Stock {
  variante_id: string;
  cantidad: number;
  reservado: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number | null;
  page: number;
  limit: number;
}

export interface FiltrosPedidos {
  estado?: string;
  comprador_id?: string;
  vendedor_id?: string;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

// ─── ARTÍCULOS ────────────────────────────────────────────────────────────────

export const articulosApi = {
  getProductos: (
    tipo: TipoProducto = "market",
    filtros?: { estado?: string; departamento_id?: string; page?: number; limit?: number }
  ) => {
    const params = new URLSearchParams({ tipo });
    if (filtros?.estado) params.set("estado", filtros.estado);
    if (filtros?.departamento_id) params.set("departamento_id", filtros.departamento_id);
    if (filtros?.page) params.set("page", String(filtros.page));
    if (filtros?.limit) params.set("limit", String(filtros.limit));
    return request<PaginatedResult<Producto>>(`/articulos/productos?${params}`);
  },

  getProducto: (id: string, tipo: TipoProducto = "market") =>
    request<Producto>(`/articulos/productos/${id}?tipo=${tipo}`),

  createProducto: (data: Partial<Producto>, tipo: TipoProducto = "market") =>
    request<Producto>(`/articulos/productos?tipo=${tipo}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProducto: (id: string, data: Partial<Producto>, tipo: TipoProducto = "market") =>
    request<Producto>(`/articulos/productos/${id}?tipo=${tipo}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProducto: (id: string, tipo: TipoProducto = "market") =>
    request<{ id: string; deleted: boolean }>(`/articulos/productos/${id}?tipo=${tipo}`, {
      method: "DELETE",
    }),

  getStock: (variante_id: string) =>
    request<Stock[]>(`/articulos/stock/${variante_id}`),

  updateStock: (variante_id: string, data: { cantidad?: number; reservado?: number }) =>
    request<Stock>(`/articulos/stock/${variante_id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getVariantes: (producto_id: string) =>
    request<Variante[]>(`/articulos/variantes/${producto_id}`),

  createVariante: (producto_id: string, data: Partial<Variante>) =>
    request<Variante>(`/articulos/variantes/${producto_id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVariante: (producto_id: string, variante_id: string, data: Partial<Variante>) =>
    request<Variante>(`/articulos/variantes/${producto_id}/${variante_id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteVariante: (producto_id: string, variante_id: string) =>
    request<{ deleted: boolean }>(`/articulos/variantes/${producto_id}/${variante_id}`, {
      method: "DELETE",
    }),

  getCategorias: () =>
    request<{ id: string; nombre: string; slug: string }[]>(`/articulos/categorias`),

  createCategoria: (data: Record<string, unknown>) =>
    request<unknown>(`/articulos/categorias`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategoria: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/articulos/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategoria: (id: string) =>
    request<{ deleted: boolean }>(`/articulos/categorias/${id}`, {
      method: "DELETE",
    }),
};

// ─── DEPARTAMENTOS ────────────────────────────────────────────────────────────

export const departamentosApi = {
  getDepartamentos: (conConteo = false) =>
    request<Departamento[]>(`/departamentos${conConteo ? "?con_conteo=true" : ""}`),

  getDepartamento: (
    id: string,
    opts?: { tipo?: TipoProducto; page?: number; limit?: number }
  ) => {
    const params = new URLSearchParams();
    if (opts?.tipo) params.set("tipo", opts.tipo);
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.limit) params.set("limit", String(opts.limit));
    return request<{
      departamento: Departamento;
      productos: PaginatedResult<Producto>;
    }>(`/departamentos/${id}?${params}`);
  },

  createDepartamento: (data: Partial<Departamento>) =>
    request<Departamento>("/departamentos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateDepartamento: (id: string, data: Partial<Departamento>) =>
    request<Departamento>(`/departamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteDepartamento: (id: string) =>
    request<{ id: string; deleted: boolean }>(`/departamentos/${id}`, {
      method: "DELETE",
    }),

  reordenarDepartamentos: (items: { id: string; orden: number }[]) =>
    request<{ reordenado: boolean }>("/departamentos/orden", {
      method: "PUT",
      body: JSON.stringify(items),
    }),
};

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

export interface CheckoutItem {
  producto_id: string;
  variante_id: string;
  cantidad: number;
  precio_base: number;
  precio_unitario?: number;
  snapshot?: Record<string, unknown>;
}

export const checkoutApi = {
  getMetodosPago: (tienda_id?: string) =>
    request<{ id: string; nombre: string; tipo: string }[]>(
      `/checkout/metodos-pago${tienda_id ? `?tienda_id=${tienda_id}` : ""}`
    ),

  getMetodosEnvio: (tienda_id?: string) =>
    request<{ id: string; nombre: string; tipo: string; precio: number }[]>(
      `/checkout/metodos-envio${tienda_id ? `?tienda_id=${tienda_id}` : ""}`
    ),

  calcularCheckout: (data: {
    items: CheckoutItem[];
    metodo_envio_id?: string;
    cupon?: string;
  }) =>
    request<{
      items: (CheckoutItem & { subtotal: number; stock_disponible: number })[];
      subtotal: number;
      costo_envio: number;
      descuento: number;
      total: number;
      moneda: string;
    }>("/checkout/calcular", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  confirmarPedido: (data: {
    tienda_id?: string;
    comprador_id: string;
    vendedor_id?: string;
    metodo_pago_id?: string;
    metodo_envio_id?: string;
    items: CheckoutItem[];
    notas?: string;
    metadata?: Record<string, unknown>;
  }) =>
    request<{ pedido_id: string; estado: string; total: number }>("/checkout/confirmar", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

export const pedidosApi = {
  getPedidos: (filtros?: FiltrosPedidos) => {
    const params = new URLSearchParams();
    if (filtros?.estado) params.set("estado", filtros.estado);
    if (filtros?.comprador_id) params.set("comprador_id", filtros.comprador_id);
    if (filtros?.vendedor_id) params.set("vendedor_id", filtros.vendedor_id);
    if (filtros?.desde) params.set("desde", filtros.desde);
    if (filtros?.hasta) params.set("hasta", filtros.hasta);
    if (filtros?.page) params.set("page", String(filtros.page));
    if (filtros?.limit) params.set("limit", String(filtros.limit));
    return request<PaginatedResult<Pedido>>(`/pedidos?${params}`);
  },

  getPedido: (id: string) => request<Pedido>(`/pedidos/${id}`),

  getStatsPedidos: () =>
    request<{
      total: number | null;
      por_estado: Record<string, number | null>;
      revenue_total: number;
    }>("/pedidos/stats"),

  cambiarEstadoPedido: (
    id: string,
    estado:
      | "pendiente"
      | "confirmado"
      | "preparando"
      | "enviado"
      | "entregado"
      | "cancelado"
  ) =>
    request<Pedido>(`/pedidos/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado }),
    }),

  cambiarEstadoPago: (id: string, estado_pago: string) =>
    request<Pedido>(`/pedidos/${id}/pago`, {
      method: "PUT",
      body: JSON.stringify({ estado_pago }),
    }),

  cancelarPedido: (id: string) =>
    request<{ id: string; estado: "cancelado" }>(`/pedidos/${id}`, {
      method: "DELETE",
    }),
};

// ─── EXPORT UNIFICADO ─────────────────────────────────────────────────────────

export const api = {
  articulos: articulosApi,
  departamentos: departamentosApi,
  checkout: checkoutApi,
  pedidos: pedidosApi,
};

export default api;
