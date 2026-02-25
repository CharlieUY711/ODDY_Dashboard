import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://yomgqobfmgatavnbtvdz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWdxb2JmbWdhdGF2bmJ0dmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQzMDMxOSwiZXhwIjoyMDg2MDA2MzE5fQ.pcooafz3LUPmxKBoBF7rR_ifu2DyGcMGbBWJXhUl6nI";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const url = new URL(req.url);
  console.log("RAW pathname:", url.pathname);
  const segments = url.pathname.replace(/^\/departamentos\/?/, "").split("/").filter(Boolean);
  console.log("segments:", JSON.stringify(segments));

  try {
    if (segments[0] === "orden" && req.method === "PUT") {
      const items = await req.json();
      await Promise.all(items.map(({ id, orden }) =>
        supabase.from("departamentos_75638143").update({ orden }).eq("id", id)
      ));
      return json({ ok: true, data: { reordenado: true } });
    }

    if (segments.length === 0) {
      if (req.method === "GET") {
        const conConteo = url.searchParams.get("con_conteo") === "true";
        const { data, error } = await supabase.from("departamentos_75638143").select("*").order("orden");
        if (error) return json({ ok: false, error: error.message }, 500);
        if (conConteo && data) {
          const withCount = await Promise.all(data.map(async (dep) => {
            const [m, s] = await Promise.all([
              supabase.from("productos_market_75638143").select("id", { count: "exact", head: true }).eq("departamento_id", dep.id),
              supabase.from("productos_secondhand_75638143").select("id", { count: "exact", head: true }).eq("departamento_id", dep.id),
            ]);
            return { ...dep, conteo_market: m.count || 0, conteo_secondhand: s.count || 0, conteo_total: (m.count || 0) + (s.count || 0) };
          }));
          return json({ ok: true, data: withCount });
        }
        return json({ ok: true, data });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase.from("departamentos_75638143").insert(body).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data }, 201);
      }
    }

    if (segments.length === 1) {
      const id = segments[0];
      if (req.method === "GET") {
        const { data, error } = await supabase.from("departamentos_75638143").select("*").eq("id", id).single();
        if (error) return json({ ok: false, error: error.message }, 404);
        return json({ ok: true, data });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { data, error } = await supabase.from("departamentos_75638143").update(body).eq("id", id).select().single();
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data });
      }
      if (req.method === "DELETE") {
        const { error } = await supabase.from("departamentos_75638143").delete().eq("id", id);
        if (error) return json({ ok: false, error: error.message }, 500);
        return json({ ok: true, data: { id, deleted: true } });
      }
    }

    return json({ ok: false, error: "Ruta no encontrada" }, 404);
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
});