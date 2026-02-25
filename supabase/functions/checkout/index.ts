/* =====================================================
   Checkout Edge Function — Métodos de Pago, Envío, Cálculo y Confirmación
   ODDY Marketplace Backend
   ===================================================== */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Función auxiliar para calcular totales del checkout
async function calcularTotales(
  supabase: ReturnType<typeof createClient>,
  items: Array<{ variante_id: string; cantidad: number }>,
  metodo_envio_id?: string
) {
  let subtotal = 0;
  const itemsValidados = [];

  // Validar stock y calcular subtotal
  for (const item of items) {
    const { variante_id, cantidad } = item;

    // Obtener variante y precio
    const { data: variante, error: varianteError } = await supabase
      .from('producto_variantes')
      .select('*, producto_id')
      .eq('id', variante_id)
      .eq('activo', true)
      .single();

    if (varianteError || !variante) {
      throw new Error(`Variante ${variante_id} no encontrada`);
    }

    // Obtener precio del producto
    const { data: productoMarket } = await supabase
      .from('productos_market_75638143')
      .select('precio')
      .eq('id', variante.producto_id)
      .single();

    const { data: productoSecondhand } = await supabase
      .from('productos_secondhand_75638143')
      .select('precio')
      .eq('id', variante.producto_id)
      .single();

    const producto = productoMarket || productoSecondhand;
    if (!producto) {
      throw new Error(`Producto ${variante.producto_id} no encontrado`);
    }

    const precioUnitario = (producto.precio || 0) + (variante.precio_extra || 0);

    // Validar stock
    const { data: stock, error: stockError } = await supabase
      .from('producto_stock')
      .select('cantidad, reservado')
      .eq('variante_id', variante_id)
      .single();

    if (stockError || !stock) {
      throw new Error(`Stock no encontrado para variante ${variante_id}`);
    }

    const disponible = (stock.cantidad || 0) - (stock.reservado || 0);
    if (disponible < cantidad) {
      throw new Error(`Stock insuficiente para variante ${variante_id}. Disponible: ${disponible}`);
    }

    const itemSubtotal = precioUnitario * cantidad;
    subtotal += itemSubtotal;

    itemsValidados.push({
      variante_id,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal: itemSubtotal,
      stock_disponible: disponible,
    });
  }

  // Calcular costo de envío
  let costoEnvio = 0;
  if (metodo_envio_id) {
    const { data: metodoEnvio, error: envioError } = await supabase
      .from('metodos_envio')
      .select('precio')
      .eq('id', metodo_envio_id)
      .eq('activo', true)
      .single();

    if (!envioError && metodoEnvio) {
      costoEnvio = metodoEnvio.precio || 0;
    }
  }

  const descuento = 0; // Se puede calcular según reglas de negocio
  const total = subtotal + costoEnvio - descuento;

  return {
    items: itemsValidados,
    subtotal,
    descuento,
    costo_envio: costoEnvio,
    total,
    moneda: 'MXN',
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    const pathParts = pathname.split('/').filter(Boolean);

    // GET /checkout/metodos-pago
    if (pathParts.length === 2 && pathParts[0] === 'checkout' && pathParts[1] === 'metodos-pago') {
      if (req.method === 'GET') {
        const tiendaId = searchParams.get('tienda_id');
        
        let query = supabase
          .from('metodos_pago')
          .select('*')
          .eq('activo', true);

        if (tiendaId) {
          query.eq('tienda_id', tiendaId);
        }

        const { data, error } = await query.order('id');

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET /checkout/metodos-envio
    if (pathParts.length === 2 && pathParts[0] === 'checkout' && pathParts[1] === 'metodos-envio') {
      if (req.method === 'GET') {
        const tiendaId = searchParams.get('tienda_id');
        
        let query = supabase
          .from('metodos_envio')
          .select('*')
          .eq('activo', true);

        if (tiendaId) {
          query.eq('tienda_id', tiendaId);
        }

        const { data, error } = await query.order('id');

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // POST /checkout/calcular
    if (pathParts.length === 2 && pathParts[0] === 'checkout' && pathParts[1] === 'calcular') {
      if (req.method === 'POST') {
        const body = await req.json();
        const { items, metodo_envio_id } = body; // items: [{variante_id, cantidad}]

        if (!Array.isArray(items) || items.length === 0) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Items requeridos' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        try {
          const calculo = await calcularTotales(supabase, items, metodo_envio_id);
          return new Response(
            JSON.stringify({ ok: true, data: calculo }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // POST /checkout/confirmar
    if (pathParts.length === 2 && pathParts[0] === 'checkout' && pathParts[1] === 'confirmar') {
      if (req.method === 'POST') {
        const body = await req.json();
        const {
          tienda_id,
          comprador_id,
          vendedor_id,
          metodo_pago_id,
          metodo_envio_id,
          items,
          notas,
          metadata,
        } = body;

        if (!tienda_id || !comprador_id || !metodo_pago_id || !Array.isArray(items) || items.length === 0) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Datos incompletos' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Calcular totales (reutilizar lógica de calcular)
        let calculo;
        try {
          calculo = await calcularTotales(supabase, items, metodo_envio_id);
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { subtotal, descuento, total, costo_envio } = calculo;

        // Crear pedido
        // Nota: Si la tabla pedidos no tiene campo costo_envio, se puede guardar en metadata
        const metadataCompleto = {
          ...(metadata || {}),
          costo_envio,
          metodo_envio_id,
        };

        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .insert({
            tienda_id,
            comprador_id,
            vendedor_id,
            metodo_pago_id,
            estado: 'pendiente',
            subtotal,
            descuento,
            total,
            moneda: 'MXN',
            notas,
            metadata: metadataCompleto,
          })
          .select()
          .single();

        if (pedidoError) throw pedidoError;

        // Crear items del pedido y reservar stock
        const pedidoItems = [];
        for (const item of calculo.items) {
          // Obtener snapshot del producto/variante
          const { data: variante } = await supabase
            .from('producto_variantes')
            .select('*, producto_id')
            .eq('id', item.variante_id)
            .single();

          const { data: productoMarket } = await supabase
            .from('productos_market_75638143')
            .select('*')
            .eq('id', variante?.producto_id)
            .single();

          const { data: productoSecondhand } = await supabase
            .from('productos_secondhand_75638143')
            .select('*')
            .eq('id', variante?.producto_id)
            .single();

          const producto = productoMarket || productoSecondhand;
          const snapshot = {
            producto: producto ? { ...producto } : null,
            variante: variante ? { ...variante } : null,
          };

          // Crear pedido_item
          const { data: pedidoItem, error: itemError } = await supabase
            .from('pedido_items')
            .insert({
              pedido_id: pedido.id,
              producto_id: variante?.producto_id,
              variante_id: item.variante_id,
              cantidad: item.cantidad,
              cantidad_enviada: 0,
              precio_unitario: item.precio_unitario,
              subtotal: item.subtotal,
              snapshot,
            })
            .select()
            .single();

          if (itemError) throw itemError;
          pedidoItems.push(pedidoItem);

          // Reservar stock
          const { data: stock } = await supabase
            .from('producto_stock')
            .select('reservado')
            .eq('variante_id', item.variante_id)
            .single();

          const nuevoReservado = (stock?.reservado || 0) + item.cantidad;

          await supabase
            .from('producto_stock')
            .update({ reservado: nuevoReservado })
            .eq('variante_id', item.variante_id);
        }

        return new Response(
          JSON.stringify({
            ok: true,
            data: {
              pedido,
              items: pedidoItems,
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Ruta no encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
