/* =====================================================
   Artículos Edge Function — CRUD de Productos, Stock, Variantes
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

    // Parse path: /articulos/productos, /articulos/productos/:id, /articulos/stock/:variante_id, etc.
    const pathParts = pathname.split('/').filter(Boolean);
    
    // GET/POST /articulos/productos
    if (pathParts.length === 2 && pathParts[1] === 'productos') {
      if (req.method === 'GET') {
        const tipo = searchParams.get('tipo') || 'market';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;
        
        const tableName = tipo === 'secondhand' 
          ? 'productos_secondhand_75638143' 
          : 'productos_market_75638143';

        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .range(offset, offset + limit - 1)
          .order('published_date', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data, total: count }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const body = await req.json();
        const tipo = searchParams.get('tipo') || 'market';
        const tableName = tipo === 'secondhand' 
          ? 'productos_secondhand_75638143' 
          : 'productos_market_75638143';

        const { data, error } = await supabase
          .from(tableName)
          .insert(body)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET/PUT/DELETE /articulos/productos/:id
    if (pathParts.length === 3 && pathParts[1] === 'productos') {
      const productoId = pathParts[2];
      const tipo = searchParams.get('tipo') || 'market';
      const tableName = tipo === 'secondhand' 
        ? 'productos_secondhand_75638143' 
        : 'productos_market_75638143';

      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', productoId)
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { data, error } = await supabase
          .from(tableName)
          .update(body)
          .eq('id', productoId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'DELETE') {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', productoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET/PUT /articulos/stock/:variante_id
    if (pathParts.length === 3 && pathParts[1] === 'stock') {
      const varianteId = pathParts[2];

      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('producto_stock')
          .select('*')
          .eq('variante_id', varianteId)
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('producto_stock')
          .upsert({ variante_id: varianteId, ...body })
          .eq('variante_id', varianteId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET/POST/PUT/DELETE /articulos/variantes/:producto_id
    if (pathParts.length === 3 && pathParts[1] === 'variantes') {
      const productoId = pathParts[2];

      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('producto_variantes')
          .select('*')
          .eq('producto_id', productoId)
          .order('id');

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('producto_variantes')
          .insert({ ...body, producto_id: productoId })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { id, ...updateData } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ ok: false, error: 'ID de variante requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('producto_variantes')
          .update(updateData)
          .eq('id', id)
          .eq('producto_id', productoId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'DELETE') {
        const varianteId = searchParams.get('variante_id');
        if (!varianteId) {
          return new Response(
            JSON.stringify({ ok: false, error: 'variante_id requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('producto_variantes')
          .delete()
          .eq('id', varianteId)
          .eq('producto_id', productoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET/POST/PUT /articulos/categorias
    if (pathParts.length === 2 && pathParts[1] === 'categorias') {
      if (req.method === 'GET') {
        const tiendaId = searchParams.get('tienda_id');
        const query = supabase.from('categorias').select('*');
        
        if (tiendaId) {
          query.eq('tienda_id', tiendaId);
        }
        
        query.eq('activo', true).order('orden');

        const { data, error } = await query;

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('categorias')
          .insert(body)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { id, ...updateData } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ ok: false, error: 'ID de categoría requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('categorias')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET/POST/PUT/DELETE /articulos/departamentos
    if (pathParts.length === 2 && pathParts[1] === 'departamentos') {
      if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('departamentos_75638143')
          .select('*')
          .eq('activo', true)
          .order('orden');

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('departamentos_75638143')
          .insert(body)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { id, ...updateData } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ ok: false, error: 'ID de departamento requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('departamentos_75638143')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'DELETE') {
        const id = searchParams.get('id');
        if (!id) {
          return new Response(
            JSON.stringify({ ok: false, error: 'ID de departamento requerido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('departamentos_75638143')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true }),
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
