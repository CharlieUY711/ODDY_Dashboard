/* =====================================================
   Departamentos Edge Function — Gestión de Departamentos
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

    // GET /departamentos
    if (pathParts.length === 1 && pathParts[0] === 'departamentos') {
      if (req.method === 'GET') {
        const conConteo = searchParams.get('con_conteo') === 'true';
        
        let query = supabase
          .from('departamentos_75638143')
          .select('*')
          .eq('activo', true)
          .order('orden');

        const { data: departamentos, error } = await query;

        if (error) throw error;

        // Si se solicita conteo de productos
        if (conConteo && departamentos) {
          const departamentosConConteo = await Promise.all(
            departamentos.map(async (dept) => {
              // Contar productos market
              const { count: countMarket } = await supabase
                .from('productos_market_75638143')
                .select('*', { count: 'exact', head: true })
                .eq('departamento_id', dept.id)
                .eq('estado', 'activo');

              // Contar productos secondhand
              const { count: countSecondhand } = await supabase
                .from('productos_secondhand_75638143')
                .select('*', { count: 'exact', head: true })
                .eq('departamento_id', dept.id)
                .eq('estado', 'activo');

              return {
                ...dept,
                conteo_productos: (countMarket || 0) + (countSecondhand || 0),
              };
            })
          );

          return new Response(
            JSON.stringify({ ok: true, data: departamentosConConteo }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ ok: true, data: departamentos }),
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
    }

    // GET /departamentos/:id
    if (pathParts.length === 2 && pathParts[0] === 'departamentos') {
      const departamentoId = pathParts[1];

      if (req.method === 'GET') {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;
        const tipo = searchParams.get('tipo') || 'all'; // all, market, secondhand

        // Obtener departamento
        const { data: departamento, error: deptError } = await supabase
          .from('departamentos_75638143')
          .select('*')
          .eq('id', departamentoId)
          .single();

        if (deptError) throw deptError;

        // Obtener productos del departamento
        const productos = [];
        
        if (tipo === 'all' || tipo === 'market') {
          const { data: marketProducts, error: marketError } = await supabase
            .from('productos_market_75638143')
            .select('*')
            .eq('departamento_id', departamentoId)
            .eq('estado', 'activo')
            .range(offset, offset + limit - 1)
            .order('published_date', { ascending: false });

          if (marketError) throw marketError;
          if (marketProducts) productos.push(...marketProducts.map(p => ({ ...p, tipo: 'market' })));
        }

        if (tipo === 'all' || tipo === 'secondhand') {
          const { data: secondhandProducts, error: secondhandError } = await supabase
            .from('productos_secondhand_75638143')
            .select('*')
            .eq('departamento_id', departamentoId)
            .eq('estado', 'activo')
            .range(offset, offset + limit - 1)
            .order('published_date', { ascending: false });

          if (secondhandError) throw secondhandError;
          if (secondhandProducts) productos.push(...secondhandProducts.map(p => ({ ...p, tipo: 'secondhand' })));
        }

        return new Response(
          JSON.stringify({ 
            ok: true, 
            data: {
              departamento,
              productos,
              paginacion: {
                page,
                limit,
                total: productos.length,
              }
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (req.method === 'PUT') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('departamentos_75638143')
          .update(body)
          .eq('id', departamentoId)
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
          .from('departamentos_75638143')
          .delete()
          .eq('id', departamentoId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // PUT /departamentos/orden
    if (pathParts.length === 2 && pathParts[0] === 'departamentos' && pathParts[1] === 'orden') {
      if (req.method === 'PUT') {
        const body = await req.json();
        
        if (!Array.isArray(body)) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Body debe ser un array de {id, orden}' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Actualizar orden de cada departamento
        const updates = body.map(({ id, orden }) =>
          supabase
            .from('departamentos_75638143')
            .update({ orden })
            .eq('id', id)
        );

        const results = await Promise.all(updates);
        
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          throw new Error(`Error al actualizar orden: ${errors[0].error?.message}`);
        }

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
