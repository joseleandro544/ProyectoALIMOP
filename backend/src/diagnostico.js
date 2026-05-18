import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const { Client } = pkg;

async function runDiagnostic() {
  console.log('==================================================');
  console.log('🔍 INICIANDO DIAGNÓSTICO DE BASE DE DATOS ALIMOP');
  console.log('==================================================\n');

  console.log('1. Intentando conectar al servidor de PostgreSQL...');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Puerto: ${process.env.DB_PORT || 5432}`);
  console.log(`   Usuario: ${process.env.DB_USER || 'postgres'}\n`);

  // Conectar primero a la base de datos por defecto 'postgres' para ver qué bases de datos existen
  const clientDefault = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Leo1406',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: 'postgres', // Usamos la de defecto que siempre existe
  });

  try {
    await clientDefault.connect();
    console.log('✅ ¡Conexión básica establecida con PostgreSQL!');
    
    // Consultar las bases de datos existentes
    const res = await clientDefault.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
    const databases = res.rows.map(row => row.datname);
    
    console.log('\n📊 Bases de datos encontradas en tu PostgreSQL:');
    databases.forEach(db => {
      console.log(`   • ${db}`);
    });
    
    await clientDefault.end();

    console.log('\n2. Evaluando resultados:');
    const hasDbAlimop = databases.includes('db.alimop');
    const hasBdAlimop = databases.includes('bd.alimop');

    let targetDb = '';
    if (hasDbAlimop) {
      console.log('   🟢 Encontrada la base de datos recomendada: "db.alimop"');
      targetDb = 'db.alimop';
    } else if (hasBdAlimop) {
      console.log('   🟡 Encontrada la base de datos con nombre alternativo: "bd.alimop"');
      console.log('      👉 Te recomiendo configurar en tu .env: DB_DATABASE=bd.alimop');
      targetDb = 'bd.alimop';
    } else {
      console.log('   ❌ No se encontró ninguna base de datos para ALIMOP ("db.alimop" o "bd.alimop").');
      console.log('      👉 Esto significa que la base de datos no está creada en este servidor PostgreSQL.');
    }

    if (targetDb) {
      // Probar conexión específica
      console.log(`\n3. Probando conexión directa a la base de datos "${targetDb}"...`);
      
      const clientSpecific = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'Leo1406',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        database: targetDb,
      });

      try {
        await clientSpecific.connect();
        console.log(`   ✅ ¡Conexión exitosa a "${targetDb}"!`);
        
        // Consultar si existen las tablas principales
        const tablesRes = await clientSpecific.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `);
        
        console.log(`\n📋 Tablas encontradas en "${targetDb}":`);
        if (tablesRes.rows.length === 0) {
          console.log('   ⚠️ ¡La base de datos está vacía! No tiene tablas creadas.');
          console.log('      👉 Recuerda inicializar las tablas con tu archivo schema.sql.');
        } else {
          tablesRes.rows.forEach(t => console.log(`   • ${t.table_name}`));
        }
        
        await clientSpecific.end();
      } catch (err) {
        console.log(`   ❌ Error al conectar a "${targetDb}":`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error de conexión al servidor de PostgreSQL:', error.message);
    console.log('\n💡 CONSEJOS PARA SOLUCIONAR ESTO:');
    console.log('   1. ¿Está Docker Desktop abierto y ejecutándose?');
    console.log('   2. Abre CMD y ejecuta: docker ps (para ver si alimop_db está encendido).');
    console.log('   3. Si no está encendido, ejecuta: docker start alimop_db');
    console.log('   4. Si tienes instalado PostgreSQL localmente en Windows, puede que esté usando el puerto 5432.');
    console.log('      Si es así, la base de datos db.alimop debe crearse en tu PostgreSQL local.');
  }
  
  console.log('\n==================================================');
}

runDiagnostic();
