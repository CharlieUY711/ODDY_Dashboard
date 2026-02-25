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
  const segments = url.pathname.replace(/^\/checkout\/?/, "").split("/").filter(Boolean);

  try {
    if (segments[0] === "metodos-pago" && req.method === "GET") {
      const tienda_id = url.searchParams.get("tienda_id");
      let q = supabase.from("metodos_pago").select("*").eq("activo", true);
      if (tienda_id) q = q.eq("tienda_id", tienda_id);
      const { data, error } = await q;
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true, data });
    }

    if (segments[0] === "metodos-envio" && req.method === "GET") {
      const tienda_id = url.searchParams.get("tienda_id");
      let q = supabase.from("metodos_envio").select("*").eq("activo", true);
      if (tienda_id) q = q.eq("tienda_id", tienda_id);
      const { data, error } = await q;
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true, data });
    }

    if (segments[0] === "calcular" && req.method === "POST") {
      const { items, metodo_envio_id } = await req.json();
      if (!items?.length) return json({ ok: false, error: "items requeridos" }, 400);

      let subtotal = 0;
      const itemsValidados = [];

      for (const item of items) {
        const { data: stock } = await supabase.from("producto_stock").select("cantidad, reservado").eq("variante_id", item.variante_id).single();
        const disponible = (stock?.cantidad || 0) - (stock?.reservado || 0);
        if (disponible < item.cantidad) return json({ ok: false, error: `Stock insuficiente para variante ${item.variante_id}` }, 400);

        const { data: variante } = await supabase.from("producto_variantes").select("precio_extra").eq("id", item.variante_id).single();
        const precio_unitario = item.precio_base + (variante?.precio_extra || 0);
        const item_subtotal = precio_unitario * item.cantidad;
        subtotal += item_subtotal;
        itemsValidados.push({ ...item, precio_unitario, subtotal: item_subtotal, stock_disponible: disponible });
      }

      let costo_envio = 0;
      if (metodo_envio_id) {
        const { data: me } = await supabase.from("metodos_envio").select("precio").eq("id", metodo_envio_id).single();
        costo_envio = me?.precio || 0;
      }

      return json({ ok: true, data: { items: itemsValidados, subtotal, costo_envio, descuento: 0, total: subtotal + costo_envio, moneda: "UYU" } });
    }

    if (segments[0] === "confirmar" && req.method === "POST") {
      const { tienda_id, comprador_id, vendedor_id, metodo_pago_id, metodo_envio_id, items, notas, metadata } = await req.json();
      if (!items?.length) return json({ ok: false, error: "items requeridos" }, 400);
      if (!comprador_id) return json({ ok: false, error: "comprador_id requerido" }, 400);

      let subtotal = 0;
      for (const item of items) {
        const { data: stock } = await supabase.from("producto_stock").select("cantidad, reservado").eq("variante_id", item.variante_id).single();
        const disponible = (stock?.cantidad || 0) - (stock?.reservado || 0);
        if (disponible < item.cantidad) return json({ ok: false, error: `Stock insuficiente para variante ${item.variante_id}` }, 400);
        subtotal += item.precio_unitario * item.cantidad;
      }

      let costo_envio = 0;
      if (metodo_envio_id) {
        const { data: me } = await supabase.from("metodos_envio").select("precio").eq("id", metodo_envio_id).single();
        costo_envio = me?.precio || 0;
      }

      const { data: pedido, error: pedidoErr } = await supabase.from("pedidos")
        .insert({ tienda_id, comprador_id, vendedor_id, metodo_pago_id, estado: "pendiente", subtotal, descuento: 0, total: subtotal + costo_envio, moneda: "UYU", notas, metadata: { ...metadata, metodo_envio_id } })
        .select().single();
      if (pedidoErr) return json({ ok: false, error: pedidoErr.message }, 500);

      const pedidoItems = items.map((item) => ({
        pedido_id: pedido.id, producto_id: item.producto_id, variante_id: item.variante_id,
        cantidad: item.cantidad, cantidad_enviada: 0, precio_unitario: item.precio_unitario,
        subtotal: item.precio_unitario * item.cantidad, snapshot: item.snapshot || {},
      }));
      const { error: itemsErr } = await supabase.from("pedido_items").insert(pedidoItems);
      if (itemsErr) return json({ ok: false, error: itemsErr.message }, 500);

      for (const item of items) {
        const { data: stock } = await supabase.from("producto_stock").select("reservado").eq("variante_id", item.variante_id).single();
        await supabase.from("producto_stock").update({ reservado: (stock?.reservado || 0) + item.cantidad }).eq("variante_id", item.variante_id);
      }

      return json({ ok: true, data: { pedido_id: pedido.id, estado: "pendiente", total: subtotal + costo_envio } }, 201);
    }

    return json({ ok: false, error: "Ruta no encontrada" }, 404);
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
});
