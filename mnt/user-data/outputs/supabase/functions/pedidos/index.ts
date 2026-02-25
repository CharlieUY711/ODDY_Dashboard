import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/pedidos/, "");

  const respond = (data: unknown, ok = true, status = 200) =>
    new Response(JSON.stringify({ ok, data }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const respondError = (error: string, status = 400) =>
    new Response(JSON.stringify({ ok: false, error }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // GET /pedidos/stats
    if ((path === "/stats" || path === "/stats/") && req.method === "GET") {
      const [total, pendientes, confirmados, enviados, entregados, cancelados, revenue] =
        await Promise.all([
          supabase.from("pedidos").select("id", { count: "exact", head: true }),
          supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
          supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "confirmado"),
          supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "enviado"),
          supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "entregado"),
          supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "cancelado"),
          supabase.from("pedidos").select("total").neq("estado", "cancelado"),
        ]);

      const revenueTotal = (revenue.data || []).reduce((sum, p) => sum + (p.total || 0), 0);

      return respond({
        total: total.count,
        por_estado: {
          pendiente: pendientes.count,
          confirmado: confirmados.count,
          enviado: enviados.count,
          entregado: entregados.count,
          cancelado: cancelados.count,
        },
        revenue_total: revenueTotal,
      });
    }

    // GET /pedidos (lista)
    if ((path === "" || path === "/") && req.method === "GET") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const from = (page - 1) * limit;
      const estado = url.searchParams.get("estado");
      const comprador_id = url.searchParams.get("comprador_id");
      const vendedor_id = url.searchParams.get("vendedor_id");
      const desde = url.searchParams.get("desde");
      const hasta = url.searchParams.get("hasta");

      let q = supabase
        .from("pedidos")
        .select(
          `*, 
          comprador:personas!comprador_id(id, nombre, apellido, email),
          metodo_pago:metodos_pago(id, nombre, tipo)`,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, from + limit - 1);

      if (estado) q = q.eq("estado", estado);
      if (comprador_id) q = q.eq("comprador_id", comprador_id);
      if (vendedor_id) q = q.eq("vendedor_id", vendedor_id);
      if (desde) q = q.gte("created_at", desde);
      if (hasta) q = q.lte("created_at", hasta);

      const { data, error, count } = await q;
      if (error) return respondError(error.message);
      return respond({ items: data, total: count, page, limit });
    }

    // Single pedido routes: /pedidos/:id or /pedidos/:id/estado or /pedidos/:id/pago
    const matchAccion = path.match(/^\/([^/]+)\/(estado|pago)$/);
    if (matchAccion) {
      const [, id, accion] = matchAccion;

      if (req.method === "PUT") {
        const body = await req.json();

        if (accion === "estado") {
          const { estado } = body;
          const estadosValidos = ["pendiente", "confirmado", "preparando", "enviado", "entregado", "cancelado"];
          if (!estadosValidos.includes(estado)) return respondError("Estado inválido");

          const { data, error } = await supabase
            .from("pedidos")
            .update({ estado })
            .eq("id", id)
            .select()
            .single();
          if (error) return respondError(error.message);
          return respond(data);
        }

        if (accion === "pago") {
          const { estado_pago } = body;
          const { data, error } = await supabase
            .from("pedidos")
            .update({ metadata: { estado_pago } })
            .eq("id", id)
            .select()
            .single();
          if (error) return respondError(error.message);
          return respond(data);
        }
      }
    }

    // Single pedido: GET /pedidos/:id or DELETE /pedidos/:id
    const matchId = path.match(/^\/([^/]+)$/);
    if (matchId) {
      const id = matchId[1];

      if (req.method === "GET") {
        const { data: pedido, error } = await supabase
          .from("pedidos")
          .select(
            `*,
            comprador:personas!comprador_id(id, nombre, apellido, email, telefono, direccion),
            metodo_pago:metodos_pago(id, nombre, tipo, config),
            pedido_items(*, producto_variantes(*))`
          )
          .eq("id", id)
          .single();

        if (error) return respondError(error.message, 404);
        return respond(pedido);
      }

      if (req.method === "DELETE") {
        // Cancelar pedido + liberar stock
        const { data: pedido } = await supabase
          .from("pedidos")
          .select("estado, pedido_items(*)")
          .eq("id", id)
          .single();

        if (pedido?.estado === "entregado") {
          return respondError("No se puede cancelar un pedido entregado");
        }

        // Liberar stock reservado
        if (pedido?.pedido_items) {
          for (const item of pedido.pedido_items as { variante_id: string; cantidad: number }[]) {
            const { data: stock } = await supabase
              .from("producto_stock")
              .select("reservado")
              .eq("variante_id", item.variante_id)
              .single();

            if (stock) {
              await supabase
                .from("producto_stock")
                .update({ reservado: Math.max(0, stock.reservado - item.cantidad) })
                .eq("variante_id", item.variante_id);
            }
          }
        }

        const { error } = await supabase
          .from("pedidos")
          .update({ estado: "cancelado" })
          .eq("id", id);

        if (error) return respondError(error.message);
        return respond({ id, estado: "cancelado" });
      }
    }

    return respondError("Ruta no encontrada", 404);
  } catch (e) {
    return respondError(e.message, 500);
  }
});
