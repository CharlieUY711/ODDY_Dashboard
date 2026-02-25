/* =====================================================
   Pedidos Edge Function — Gestión de Pedidos y Estadísticas
   ODDY Marketplace Backend
   ===================================================== */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // GET /pedidos
    if (pathParts.length === 1 && pathParts[0] === 'pedidos') {
      if (req.method === 'GET') {
        const estado = searchParams.get('estado');
        const compradorId = searchParams.get('comprador_id');
        const vendedorId = searchParams.get('vendedor_id');
        const desde = searchParams.get('desde');
        const hasta = searchParams.get('hasta');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
          .from('pedidos')
          .select('*', { count: 'exact' });

        if (estado) query = query.eq('estado', estado);
        if (compradorId) query = query.eq('comprador_id', compradorId);
        if (vendedorId) query = query.eq('vendedor_id', vendedorId);
        if (desde) query = query.gte('created_at', desde);
        if (hasta) query = query.lte('created_at', hasta);

        query = query.order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return new Response(
          JSON.stringify({
            ok: true,
            data,
            paginacion: {
              page,
              limit,
              total: count || 0,
              total_pages: Math.ceil((count || 0) / limit),
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET /pedidos/stats
    if (pathParts.length === 2 && pathParts[0] === 'pedidos' && pathParts[1] === 'stats') {
      if (req.method === 'GET') {
        const tiendaId = searchParams.get('tienda_id');
        const desde = searchParams.get('desde');
        const hasta = searchParams.get('hasta');

        let query = supabase.from('pedidos').select('estado, total, created_at');

        if (tiendaId) query = query.eq('tienda_id', tiendaId);
        if (desde) query = query.gte('created_at', desde);
        if (hasta) query = query.lte('created_at', hasta);

        const { data: pedidos, error } = await query;

        if (error) throw error;

        // Calcular estadísticas
        const stats = {
          total_pedidos: pedidos?.length || 0,
          por_estado: {} as Record<string, number>,
          total_ventas: 0,
          promedio_pedido: 0,
        };

        pedidos?.forEach((pedido) => {
          // Contar por estado
          stats.por_estado[pedido.estado] = (stats.por_estado[pedido.estado] || 0) + 1;
          
          // Sumar totales (solo pedidos confirmados/completados)
          if (['confirmado', 'completado', 'enviado'].includes(pedido.estado)) {
            stats.total_ventas += pedido.total || 0;
          }
        });

        if (stats.total_pedidos > 0) {
          stats.promedio_pedido = stats.total_ventas / stats.total_pedidos;
        }

        return new Response(
          JSON.stringify({ ok: true, data: stats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // PUT /pedidos/:id/estado
    if (pathParts.length === 3 && pathParts[0] === 'pedidos' && pathParts[2] === 'estado') {
      if (req.method === 'PUT') {
        const pedidoId = pathParts[1];
        const body = await req.json();
        const { estado } = body;

        if (!estado) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Estado requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('pedidos')
          .update({ estado })
          .eq('id', pedidoId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // PUT /pedidos/:id/pago
    if (pathParts.length === 3 && pathParts[0] === 'pedidos' && pathParts[2] === 'pago') {
      if (req.method === 'PUT') {
        const pedidoId = pathParts[1];
        const body = await req.json();
        const { estado_pago } = body;

        if (!estado_pago) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Estado de pago requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('pedidos')
          .update({ estado_pago })
          .eq('id', pedidoId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET /pedidos/:id o DELETE /pedidos/:id
    if (pathParts.length === 2 && pathParts[0] === 'pedidos') {
      const pedidoId = pathParts[1];

      if (req.method === 'GET') {
        // Obtener pedido
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', pedidoId)
          .single();

        if (pedidoError) throw pedidoError;

        // Obtener items del pedido
        const { data: items, error: itemsError } = await supabase
          .from('pedido_items')
          .select('*')
          .eq('pedido_id', pedidoId);

        if (itemsError) throw itemsError;

        // Obtener personas relacionadas
        const personasIds = [
          pedido.comprador_id,
          pedido.vendedor_id,
        ].filter(Boolean);

        let personas = [];
        if (personasIds.length > 0) {
          const { data: personasData, error: personasError } = await supabase
            .from('personas')
            .select('*')
            .in('id', personasIds);

          if (!personasError && personasData) {
            personas = personasData;
          }
        }

        // Obtener método de pago
        let metodoPago = null;
        if (pedido.metodo_pago_id) {
          const { data: metodoPagoData } = await supabase
            .from('metodos_pago')
            .select('*')
            .eq('id', pedido.metodo_pago_id)
            .single();

          metodoPago = metodoPagoData;
        }

        return new Response(
          JSON.stringify({
            ok: true,
            data: {
              pedido,
              items,
              personas,
              metodo_pago: metodoPago,
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // DELETE /pedidos/:id (cancelar)
      if (req.method === 'DELETE') {
        // Obtener items del pedido para liberar stock
        const { data: items, error: itemsError } = await supabase
          .from('pedido_items')
          .select('variante_id, cantidad')
          .eq('pedido_id', pedidoId);

        if (itemsError) throw itemsError;

        // Liberar stock reservado
        if (items && items.length > 0) {
          for (const item of items) {
            if (item.variante_id) {
              const { data: stock } = await supabase
                .from('producto_stock')
                .select('reservado')
                .eq('variante_id', item.variante_id)
                .single();

              const nuevoReservado = Math.max(0, (stock?.reservado || 0) - (item.cantidad || 0));

              await supabase
                .from('producto_stock')
                .update({ reservado: nuevoReservado })
                .eq('variante_id', item.variante_id);
            }
          }
        }

        // Actualizar estado del pedido a cancelado
        const { data, error } = await supabase
          .from('pedidos')
          .update({ estado: 'cancelado' })
          .eq('id', pedidoId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
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
