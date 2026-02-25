import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://yomgqobfmgatavnbtvdz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWdxb2JmbWdhdGF2bmJ0dmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQzMDMxOSwiZXhwIjoyMDg2MDA2MzE5fQ.pcooafz3LUPmxKBoBF7rR_ifu2DyGcMGbBWJXhUl6nI";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const url = new URL(req.url);
  const segments = url.pathname.replace(/^\/pedidos\/?/, "").split("/").filter(Boolean);
  // /pedidos → []
  // /pedidos/stats → ["stats"]
  // /pedidos/123 → ["123"]
  // /pedidos/123/estado → ["123", "estado"]

  try {
    // GET /pedidos/stats
    if (segments[0] === "stats" && req.method === "GET") {
      const [total, pendientes, confirmados, enviados, entregados, cancelados, revenue] = await Promise.all([
        supabase.from("pedidos").select("id", { count: "exact", head: true }),
        supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
        supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "confirmado"),
        supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "enviado"),
        supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "entregado"),
        supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "cancelado"),
        supabase.from("pedidos").select("total").neq("estado", "cancelado"),
      ]);
      const revenueTotal = (revenue.data || []).reduce((sum, p) => sum + (p.total || 0), 0);
      return json({ ok: true, data: { total: total.count, por_estado: { pendiente: pendientes.count, confirmado: confirmados.count, enviado: enviados.count, entregado: entregados.count, cancelado: cancelados.count }, revenue_total: revenueTotal } });
    }

    // PUT /pedidos/:id/estado o /pedidos/:id/pago
    if (segments.length === 2 && req.method === "PUT") {
      const [id, accion] = segments;
      const body = await req.json();
      if (accion === "estado") {
        const { data, error } = await supabase.from("pedidos").update({ estado: body.estado }).eq("id", id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (accion === "pago") {
        const { data: current } = await supabase.from("pedidos").select("metadata").eq("id", id).single();
        const { data, error } = await supabase.from("pedidos").update({ metadata: { ...(current?.metadata || {}), estado_pago: body.estado_pago } }).eq("id", id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
    }

    // GET/DELETE /pedidos/:id
    if (segments.length === 1 && segments[0] !== "stats") {
      const id = segments[0];
      if (req.method === "GET") {
        const { data, error } = await supabase.from("pedidos").select("*, comprador:personas!comprador_id(id, nombre, apellido, email, telefono), metodo_pago:metodos_pago(id, nombre, tipo), pedido_items(*)").eq("id", id).single();
        if (error) return json({ ok: false, error: error.message }, 404);
        return json({ ok: true, data });
      }
      if (req.method === "DELETE") {
        const { data: pedido } = await supabase.from("pedidos").select("estado, pedido_items(variante_id, cantidad)").eq("id", id).single();
        if (pedido?.estado === "entregado") return json({ ok: false, error: "No se puede cancelar un pedido entregado" }, 400);
        if (pedido?.pedido_items) {
          for (const item of pedido.pedido_items) {
            const { data: stock } = await supabase.from("producto_stock").select("reservado").eq("variante_id", item.variante_id).single();
            if (stock) await supabase.from("producto_stock").update({ reservado: Math.max(0, stock.reservado - item.cantidad) }).eq("variante_id", item.variante_id);
          }
        }
        const { error } = await supabase.from("pedidos").update({ estado: "cancelado" }).eq("id", id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { id, estado: "cancelado" } });
      }
    }

    // GET /pedidos
    if (segments.length === 0 && req.method === "GET") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const from = (page - 1) * limit;
      let q = supabase.from("pedidos").select("*, comprador:personas!comprador_id(id, nombre, apellido, email), metodo_pago:metodos_pago(id, nombre, tipo)", { count: "exact" }).order("created_at", { ascending: false }).range(from, from + limit - 1);
      const estado = url.searchParams.get("estado");
      const comprador_id = url.searchParams.get("comprador_id");
      const vendedor_id = url.searchParams.get("vendedor_id");
      if (estado) q = q.eq("estado", estado);
      if (comprador_id) q = q.eq("comprador_id", comprador_id);
      if (vendedor_id) q = q.eq("vendedor_id", vendedor_id);
      const { data, error, count } = await q;
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true, data: { items: data, total: count, page, limit } });
    }

    return json({ ok: false, error: "Ruta no encontrada" }, 404);
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
});
