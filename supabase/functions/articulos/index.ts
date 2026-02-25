import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
  const tipo = url.searchParams.get("tipo") || "market";
  const tabla = tipo === "secondhand" ? "productos_secondhand_75638143" : "productos_market_75638143";
  const segments = url.pathname.replace(/^\/articulos\/?/, "").split("/").filter(Boolean);
  // /articulos/productos → ["productos"]
  // /articulos/productos/123 → ["productos", "123"]
  // /articulos/stock/abc → ["stock", "abc"]
  // /articulos/variantes/abc → ["variantes", "abc"]

  try {
    // PRODUCTOS
    if (segments[0] === "productos" && !segments[1]) {
      if (req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const from = (page - 1) * limit;
        const estado = url.searchParams.get("estado");
        const dep_id = url.searchParams.get("departamento_id");
        let q = supabase.from(tabla).select("*", { count: "exact" }).range(from, from + limit - 1);
        if (estado) q = q.eq("estado", estado);
        if (dep_id) q = q.eq("departamento_id", dep_id);
        const { data, error, count } = await q;
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { items: data, total: count, page, limit } });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from(tabla).insert(body).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data }, 201);
      }
    }

    if (segments[0] === "productos" && segments[1]) {
      const id = segments[1];
      if (req.method === "GET") {
        const { data, error } = await supabase.from(tabla).select("*, producto_variantes(*), producto_stock(*)").eq("id", id).single();
        if (error) return json({ ok: false, error: error.message }, 404);
        return json({ ok: true, data });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from(tabla).update(body).eq("id", id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from(tabla).delete().eq("id", id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { id, deleted: true } });
      }
    }

    // STOCK
    if (segments[0] === "stock" && segments[1]) {
      const variante_id = segments[1];
      if (req.method === "GET") {
        const { data, error } = await supabase.from("producto_stock").select("*").eq("variante_id", variante_id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from("producto_stock").upsert({ variante_id, ...body }, { onConflict: "variante_id" }).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
    }

    // VARIANTES
    if (segments[0] === "variantes" && segments[1] && !segments[2]) {
      const producto_id = segments[1];
      if (req.method === "GET") {
        const { data, error } = await supabase.from("producto_variantes").select("*, producto_stock(*)").eq("producto_id", producto_id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from("producto_variantes").insert({ producto_id, ...body }).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data }, 201);
      }
    }

    if (segments[0] === "variantes" && segments[1] && segments[2]) {
      const [, producto_id, variante_id] = segments;
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from("producto_variantes").update(body).eq("id", variante_id).eq("producto_id", producto_id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from("producto_variantes").delete().eq("id", variante_id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { deleted: true } });
      }
    }

    // CATEGORIAS
    if (segments[0] === "categorias" && !segments[1]) {
      if (req.method === "GET") {
        const { data, error } = await supabase.from("categorias").select("*").order("orden");
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from("categorias").insert(body).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data }, 201);
      }
    }

    if (segments[0] === "categorias" && segments[1]) {
      const id = segments[1];
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from("categorias").update(body).eq("id", id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from("categorias").delete().eq("id", id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { deleted: true } });
      }
    }

    return json({ ok: false, error: "Ruta no encontrada" }, 404);
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
});
