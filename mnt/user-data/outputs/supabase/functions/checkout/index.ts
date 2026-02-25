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
  const path = url.pathname.replace(/^\/checkout/, "");

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
    // GET /checkout/metodos-pago
    if ((path === "/metodos-pago" || path === "/metodos-pago/") && req.method === "GET") {
      const tienda_id = url.searchParams.get("tienda_id");
      let q = supabase.from("metodos_pago").select("*").eq("activo", true);
      if (tienda_id) q = q.eq("tienda_id", tienda_id);
      const { data, error } = await q;
      if (error) return respondError(error.message);
      return respond(data);
    }

    // GET /checkout/metodos-envio
    if ((path === "/metodos-envio" || path === "/metodos-envio/") && req.method === "GET") {
      const tienda_id = url.searchParams.get("tienda_id");
      let q = supabase.from("metodos_envio").select("*").eq("activo", true);
      if (tienda_id) q = q.eq("tienda_id", tienda_id);
      const { data, error } = await q;
      if (error) return respondError(error.message);
      return respond(data);
    }

    // POST /checkout/calcular
    if ((path === "/calcular" || path === "/calcular/") && req.method === "POST") {
      const { items, metodo_envio_id, cupon } = await req.json();

      if (!items?.length) return respondError("items requeridos");

      let subtotal = 0;
      const itemsValidados = [];

      for (const item of items) {
        // Verificar stock
        const { data: stock, error: stockErr } = await supabase
          .from("producto_stock")
          .select("cantidad, reservado")
          .eq("variante_id", item.variante_id)
          .single();

        if (stockErr || !stock) return respondError(`Stock no encontrado para variante ${item.variante_id}`);

        const disponible = stock.cantidad - stock.reservado;
        if (disponible < item.cantidad) {
          return respondError(`Stock insuficiente para variante ${item.variante_id}. Disponible: ${disponible}`);
        }

        const { data: variante } = await supabase
          .from("producto_variantes")
          .select("precio_extra, nombre")
          .eq("id", item.variante_id)
          .single();

        const precio_unitario = item.precio_base + (variante?.precio_extra || 0);
        const item_subtotal = precio_unitario * item.cantidad;
        subtotal += item_subtotal;

        itemsValidados.push({
          ...item,
          precio_unitario,
          subtotal: item_subtotal,
          stock_disponible: disponible,
        });
      }

      // Costo de envío
      let costo_envio = 0;
      if (metodo_envio_id) {
        const { data: metodoEnvio } = await supabase
          .from("metodos_envio")
          .select("precio, nombre")
          .eq("id", metodo_envio_id)
          .single();
        costo_envio = metodoEnvio?.precio || 0;
      }

      const descuento = 0; // TODO: lógica de cupones
      const total = subtotal + costo_envio - descuento;

      return respond({
        items: itemsValidados,
        subtotal,
        costo_envio,
        descuento,
        total,
        moneda: "UYU",
      });
    }

    // POST /checkout/confirmar
    if ((path === "/confirmar" || path === "/confirmar/") && req.method === "POST") {
      const {
        tienda_id,
        comprador_id,
        vendedor_id,
        metodo_pago_id,
        metodo_envio_id,
        items,
        notas,
        metadata,
      } = await req.json();

      if (!items?.length) return respondError("items requeridos");
      if (!comprador_id) return respondError("comprador_id requerido");

      // Calcular totales
      let subtotal = 0;
      const itemsConPrecio = [];

      for (const item of items) {
        const { data: stock } = await supabase
          .from("producto_stock")
          .select("cantidad, reservado")
          .eq("variante_id", item.variante_id)
          .single();

        const disponible = (stock?.cantidad || 0) - (stock?.reservado || 0);
        if (disponible < item.cantidad) {
          return respondError(`Stock insuficiente para variante ${item.variante_id}`);
        }

        const precio_unitario = item.precio_unitario;
        const item_subtotal = precio_unitario * item.cantidad;
        subtotal += item_subtotal;
        itemsConPrecio.push({ ...item, precio_unitario, subtotal: item_subtotal });
      }

      let costo_envio = 0;
      if (metodo_envio_id) {
        const { data: metodoEnvio } = await supabase
          .from("metodos_envio")
          .select("precio")
          .eq("id", metodo_envio_id)
          .single();
        costo_envio = metodoEnvio?.precio || 0;
      }

      const total = subtotal + costo_envio;

      // Crear pedido
      const { data: pedido, error: pedidoErr } = await supabase
        .from("pedidos")
        .insert({
          tienda_id,
          comprador_id,
          vendedor_id,
          metodo_pago_id,
          estado: "pendiente",
          subtotal,
          descuento: 0,
          total,
          moneda: "UYU",
          notas,
          metadata: { ...metadata, metodo_envio_id },
        })
        .select()
        .single();

      if (pedidoErr) return respondError(pedidoErr.message);

      // Crear pedido_items
      const pedidoItems = itemsConPrecio.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        variante_id: item.variante_id,
        cantidad: item.cantidad,
        cantidad_enviada: 0,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
        snapshot: item.snapshot || {},
      }));

      const { error: itemsErr } = await supabase.from("pedido_items").insert(pedidoItems);
      if (itemsErr) return respondError(itemsErr.message);

      // Reservar stock
      for (const item of itemsConPrecio) {
        await supabase.rpc("incrementar_reservado", {
          p_variante_id: item.variante_id,
          p_cantidad: item.cantidad,
        }).catch(() =>
          supabase
            .from("producto_stock")
            .select("reservado")
            .eq("variante_id", item.variante_id)
            .single()
            .then(({ data }) =>
              supabase
                .from("producto_stock")
                .update({ reservado: (data?.reservado || 0) + item.cantidad })
                .eq("variante_id", item.variante_id)
            )
        );
      }

      return respond({ pedido_id: pedido.id, estado: "pendiente", total }, true, 201);
    }

    return respondError("Ruta no encontrada", 404);
  } catch (e) {
    return respondError(e.message, 500);
  }
});
