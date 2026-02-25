/**
 * Script de prueba para las Edge Functions de Supabase
 * Ejecutar con: node test-functions.js
 */

const SUPABASE_URL = 'https://yomgqobfmgatavnbtvdz.supabase.co';
const BASE_URL = `${SUPABASE_URL}/functions/v1`;
// Usar service role key para pruebas (las funciones ahora usan DB_SERVICE_KEY internamente)
// Nota: En producción, las funciones usan variables de entorno, pero para pruebas desde fuera necesitamos una key válida
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWdxb2JmbWdhdGF2bmJ0dmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQzMDMxOSwiZXhwIjoyMDg2MDA2MzE5fQ.pcooafz3LUPmxKBoBF7rR_ifu2DyGcMGbBWJXhUl6nI';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || SERVICE_KEY;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ANON_KEY}`,
};

async function testFunction(functionName, endpoint = '', method = 'GET', body = null) {
  const url = `${BASE_URL}/${functionName}${endpoint}`;
  console.log(`\n🔍 Probando: ${method} ${url}`);
  
  try {
    const options = {
      method,
      headers,
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok && data.ok) {
      console.log(`✅ Éxito:`, JSON.stringify(data, null, 2).substring(0, 500));
      return { success: true, data };
    } else {
      console.log(`❌ Error:`, JSON.stringify(data, null, 2));
      return { success: false, data };
    }
  } catch (error) {
    console.log(`❌ Excepción:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de Edge Functions...\n');
  console.log('='.repeat(60));
  
  // 1. Test departamentos - GET lista
  console.log('\n📦 FUNCIÓN: departamentos');
  console.log('-'.repeat(60));
  await testFunction('departamentos', '', 'GET');
  
  // 2. Test articulos - GET productos (la ruta dentro de la función es /productos)
  console.log('\n📦 FUNCIÓN: articulos');
  console.log('-'.repeat(60));
  await testFunction('articulos', '/productos?tipo=market&page=1&limit=5', 'GET');
  
  // 3. Test checkout - GET métodos de pago (la ruta dentro de la función es /metodos-pago)
  console.log('\n📦 FUNCIÓN: checkout');
  console.log('-'.repeat(60));
  await testFunction('checkout', '/metodos-pago', 'GET');
  await testFunction('checkout', '/metodos-envio', 'GET');
  
  // 4. Test pedidos - GET lista (la ruta dentro de la función es / o /stats)
  console.log('\n📦 FUNCIÓN: pedidos');
  console.log('-'.repeat(60));
  await testFunction('pedidos', '?page=1&limit=5', 'GET');
  await testFunction('pedidos', '/stats', 'GET');
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Pruebas completadas');
}

// Ejecutar pruebas
runTests().catch(console.error);
