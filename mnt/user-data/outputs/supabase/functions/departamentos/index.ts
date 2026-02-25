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
  const path = url.pathname.replace(/^\/departamentos/, "");

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
    // Reordenar departamentos
    if (path === "/orden" || path === "/orden/") {
      if (req.method === "PUT") {
        const items: { id: string; orden: number }[] = await req.json();
        const updates = items.map(({ id, orden }) =>
          supabase.from("departamentos_75638143").update({ orden }).eq("id", id)
        );
        await Promise.all(updates);
        return respond({ reordenado: true });
      }
    }

    // Lista de departamentos
    if (path === "" || path === "/") {
      if (req.method === "GET") {
        const conConteo = url.searchParams.get("con_conteo") === "true";

        const { data, error } = await supabase
          .from("departamentos_75638143")
          .select("*")
          .order("orden");
        if (error) return respondError(error.message);

        if (conConteo) {
          const withCount = await Promise.all(
            (data || []).map(async (dep) => {
              const [mkt, sh] = await Promise.all([
                supabase
                  .from("productos_market_75638143")
                  .select("id", { count: "exact", head: true })
                  .eq("departamento_id", dep.id),
                supabase
                  .from("productos_secondhand_75638143")
                  .select("id", { count: "exact", head: true })
                  .eq("departamento_id", dep.id),
              ]);
              return {
                ...dep,
                conteo_market: mkt.count || 0,
                conteo_secondhand: sh.count || 0,
                conteo_total: (mkt.count || 0) + (sh.count || 0),
              };
            })
          );
          return respond(withCount);
        }

        return respond(data);
      }

      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("departamentos_75638143")
          .insert(body)
          .select()
          .single();
        if (error) return respondError(error.message);
        return respond(data, true, 201);
      }
    }

    // Single departamento
    const match = path.match(/^\/([^/]+)$/);
    if (match) {
      const id = match[1];

      if (req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const from = (page - 1) * limit;
        const tipo = url.searchParams.get("tipo") || "market";
        const tabla =
          tipo === "secondhand"
            ? "productos_secondhand_75638143"
            : "productos_market_75638143";

        const [dep, prods] = await Promise.all([
          supabase
            .from("departamentos_75638143")
            .select("*")
            .eq("id", id)
            .single(),
          supabase
            .from(tabla)
            .select("*", { count: "exact" })
            .eq("departamento_id", id)
            .range(from, from + limit - 1),
        ]);

        if (dep.error) return respondError(dep.error.message, 404);
        return respond({
          departamento: dep.data,
          productos: {
            items: prods.data,
            total: prods.count,
            page,
            limit,
          },
        });
      }

      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("departamentos_75638143")
          .update(body)
          .eq("id", id)
          .select()
          .single();
        if (error) return respondError(error.message);
        return respond(data);
      }

      if (req.method === "DELETE") {
        const { error } = await supabase
          .from("departamentos_75638143")
          .delete()
          .eq("id", id);
        if (error) return respondError(error.message);
        return respond({ id, deleted: true });
      }
    }

    return respondError("Ruta no encontrada", 404);
  } catch (e) {
    return respondError(e.message, 500);
  }
});
