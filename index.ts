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
  const path = url.pathname.replace(/^\/articulos/, "");
  const tipo = url.searchParams.get("tipo") || "market";
  const tabla = tipo === "secondhand" ? "productos_secondhand_75638143" : "productos_market_75638143";

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
    // ── PRODUCTOS ──────────────────────────────────────────────────────────────
    if (path === "/productos" || path === "/productos/") {
      if (req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const estado = url.searchParams.get("estado");
        const dep_id = url.searchParams.get("departamento_id");
        const from = (page - 1) * limit;

        let q = supabase.from(tabla).select("*", { count: "exact" }).range(from, from + limit - 1);
        if (estado) q = q.eq("estado", estado);
        if (dep_id) q = q.eq("departamento_id", dep_id);

        const { data, error, count } = await q;
        if (error) return respondError(error.message);
        return respond({ items: data, total: count, page, limit });
      }

      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from(tabla).insert(body).select().single();
        if (error) return respondError(error.message);
        return respond(data, true, 201);
      }
    }

    // Single producto
    const matchProducto = path.match(/^\/productos\/([^/]+)$/);
    if (matchProducto) {
      const id = matchProducto[1];

      if (req.method === "GET") {
        const { data, error } = await supabase.from(tabla).select("*, producto_variantes(*), producto_stock(*)").eq("id", id).single();
        if (error) return respondError(error.message, 404);
        return respond(data);
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from(tabla).update(body).eq("id", id).select().single();
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from(tabla).delete().eq("id", id);
        if (error) return respondError(error.message);
        return respond({ id, deleted: true });
      }
    }

    // ── STOCK ──────────────────────────────────────────────────────────────────
    const matchStock = path.match(/^\/stock\/([^/]+)$/);
    if (matchStock) {
      const variante_id = matchStock[1];
      if (req.method === "GET") {
        const { data, error } = await supabase.from("producto_stock").select("*").eq("variante_id", variante_id);
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("producto_stock")
          .upsert({ variante_id, ...body }, { onConflict: "variante_id" })
          .select()
          .single();
        if (error) return respondError(error.message);
        return respond(data);
      }
    }

    // ── VARIANTES ─────────────────────────────────────────────────────────────
    const matchVariantes = path.match(/^\/variantes\/([^/]+)$/);
    if (matchVariantes) {
      const producto_id = matchVariantes[1];
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("producto_variantes")
          .select("*, producto_stock(*)")
          .eq("producto_id", producto_id);
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("producto_variantes")
          .insert({ producto_id, ...body })
          .select()
          .single();
        if (error) return respondError(error.message);
        return respond(data, true, 201);
      }
    }

    const matchVariante = path.match(/^\/variantes\/([^/]+)\/([^/]+)$/);
    if (matchVariante) {
      const [, producto_id, variante_id] = matchVariante;
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("producto_variantes")
          .update(body)
          .eq("id", variante_id)
          .eq("producto_id", producto_id)
          .select()
          .single();
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "DELETE") {
        const { error } = await supabase
          .from("producto_variantes")
          .delete()
          .eq("id", variante_id);
        if (error) return respondError(error.message);
        return respond({ deleted: true });
      }
    }

    // ── CATEGORIAS ────────────────────────────────────────────────────────────
    if (path === "/categorias" || path === "/categorias/") {
      if (req.method === "GET") {
        const { data, error } = await supabase.from("categorias").select("*").order("orden");
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from("categorias").insert(body).select().single();
        if (error) return respondError(error.message);
        return respond(data, true, 201);
      }
    }

    const matchCategoria = path.match(/^\/categorias\/([^/]+)$/);
    if (matchCategoria) {
      const id = matchCategoria[1];
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from("categorias").update(body).eq("id", id).select().single();
        if (error) return respondError(error.message);
        return respond(data);
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from("categorias").delete().eq("id", id);
        if (error) return respondError(error.message);
        return respond({ deleted: true });
      }
    }

    return respondError("Ruta no encontrada", 404);
  } catch (e) {
    return respondError(e.message, 500);
  }
});
