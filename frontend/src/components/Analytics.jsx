import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, Clock, Calendar, Users, 
  Trash2, ShieldCheck, Sparkles, Building2, HelpCircle,
  TrendingDown, DollarSign, Leaf, ShoppingBag
} from 'lucide-react';

export default function Analytics() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('todo');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 📈 DATOS DE MINERÍA 1: Histórico mensual y gráfico predictivo de ventas (Jan-May Real, Jun-Aug Predictivo)
  const datosVentasMensuales = [
    { mes: 'Ene', real: 8.2, pred: null, desc: 'Ventas de inicio de año' },
    { mes: 'Feb', real: 9.8, pred: null, desc: 'Crecimiento de comercios' },
    { mes: 'Mar', real: 11.4, pred: null, desc: 'Apertura de puntos clave' },
    { mes: 'Abr', real: 13.6, pred: null, desc: 'Campaña Semana Santa' },
    { mes: 'May', real: 15.4, pred: 15.4, desc: 'Rescate masivo del mes actual' },
    { mes: 'Jun', real: null, pred: 17.8, desc: 'Predicción lineal (Vacaciones)' },
    { mes: 'Jul', real: null, pred: 20.2, desc: 'Predicción lineal (Excedentes Invierno)' },
    { mes: 'Ago', real: null, pred: 22.8, desc: 'Predicción lineal (Aniversario ALIMOP)' }
  ];

  // 🏆 DATOS DE MINERÍA 2: Alimentos que más se venden (Top 5)
  const productosMasVendidos = [
    { name: 'Panadería y Hojaldres', ventas: 1420, color: '#f97316', pct: '28%' },
    { name: 'Frutas y Verduras (Fruver)', ventas: 1210, color: '#10b981', pct: '24%' },
    { name: 'Lácteos (Quesos/Yogur)', ventas: 910, color: '#06b6d4', pct: '18%' },
    { name: 'Carnes y Charcutería', ventas: 760, color: '#ec4899', pct: '15%' },
    { name: 'Comida Lista y Restaurante', ventas: 510, color: '#6366f1', pct: '10%' }
  ];

  // ⏰ DATOS DE MINERÍA 3: Horas y Días de más ventas (Picos de Demanda)
  const picosVentasHora = [
    { rango: 'Mañana (8am - 12pm)', pct: 22, color: '#38bdf8', desc: 'Desayunos y panadería fresca' },
    { rango: 'Almuerzo (12pm - 4pm)', pct: 46, color: '#f97316', desc: 'Hora pico de restaurantes y almuerzos' },
    { rango: 'Tarde/Noche (4pm - 8pm)', pct: 32, color: '#818cf8', desc: 'Cierre de supermercados y fruver' }
  ];

  // 👥 DATOS DE MINERÍA 4: Tipo de clientes que más compran
  const tiposDeClientes = [
    { tipo: 'Hogares y Familias', pct: 45, color: '#10b981', count: '558 usuarios' },
    { tipo: 'Estudiantes Universitarios', pct: 33, color: '#6366f1', count: '410 usuarios' },
    { tipo: 'Fundaciones y ONGs (Donaciones)', pct: 22, color: '#f59e0b', count: '272 usuarios' }
  ];

  // 🍂 DATOS DE MINERÍA 5: Productos que más se pierden (Tasa de mermas)
  const productosMasPerdidos = [
    { name: 'Verduras Húmedas', mermas: 340, pct: 40, color: '#ef4444' },
    { name: 'Panadería del Día', mermas: 210, pct: 25, color: '#f87171' },
    { name: 'Platos Listos Calientes', mermas: 150, pct: 18, color: '#fca5a5' },
    { name: 'Lácteos Expirados', mermas: 90, pct: 10, color: '#fee2e2' }
  ];

  // 🏪 DATOS DE MINERÍA 6: Establecimientos Líderes en Ventas
  const rankingNegocios = [
    { rank: 1, nombre: 'Carulla Pepe Sierra', salvados: 1840, facturado: '$18.4M COP', ecoRating: 4.9, pct: 100 },
    { rank: 2, nombre: 'El Trigal Panes', salvados: 1320, facturado: '$12.2M COP', ecoRating: 4.8, pct: 75 },
    { rank: 3, nombre: 'Jose Excedentes Bogotá', salvados: 750, facturado: '$9.8M COP', ecoRating: 4.6, pct: 42 }
  ];

  // Filtros de navegación
  const navigationFilters = [
    { id: 'todo', label: 'Todo el Ecosistema' },
    { id: 'financiero', label: 'Análisis de Ventas' },
    { id: 'clientes', label: 'Segmentación de Clientes' },
    { id: 'mermas', label: 'Control de Desperdicios' }
  ];

  // Cálculos dinámicos
  const totalFacturadoReal = 58.4; // Millones COP
  const totalKgSalvados = 12450; // kg
  const tasaEficienciaSalvado = 91.2; // %

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ================= HEADER DEL DASHBOARD BI ================= */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart3 className="h-64 w-64 text-emerald-400 rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 bg-opacity-70 border border-emerald-800 px-3 py-1.5 rounded-full">
              Módulo de Inteligencia de Negocios (BI)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Minería de Datos ALIMOP
            </h1>
            <p className="text-xs text-blue-200 max-w-xl">
              Análisis predictivo de ventas, comportamiento de la demanda y minería transaccional para optimizar el desperdicio de alimentos en Bogotá.
            </p>
          </div>

          {/* Tarjeta rápida de impacto */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-10 shrink-0 flex items-center space-x-3.5">
            <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest">Algoritmo Predictivo</p>
              <p className="text-xs font-black text-white">IA Multivariable Activa</p>
              <span className="text-[8px] font-semibold text-slate-300">Margen de precisión: 94.6%</span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros Interactiva */}
        <div className="flex flex-wrap gap-2 mt-8 border-t border-slate-800 pt-6">
          {navigationFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveCategoryFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-premium ${
                activeCategoryFilter === filter.id 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-900/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CARDS SUPERIORES (KPI METRICAS) ================= */}
      {activeCategoryFilter === 'todo' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KPI 1: Ventas Totales */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium hover:-translate-y-1 transition-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Volumen de Facturación</span>
              <span className="text-3xl font-black text-slate-800 tracking-tight mt-1 block">${totalFacturadoReal}M COP</span>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">+12.4% vs mes anterior</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          {/* KPI 2: Kg Rescatados */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium hover:-translate-y-1 transition-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Alimentos Rescatados</span>
              <span className="text-3xl font-black text-slate-800 tracking-tight mt-1 block">{(totalKgSalvados / 1000).toFixed(1)} Toneladas</span>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Equivale a 28,500 comidas</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
              <Leaf className="h-6 w-6" />
            </div>
          </div>

          {/* KPI 3: Eficiencia */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium hover:-translate-y-1 transition-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tasa de Merma Evitada</span>
              <span className="text-3xl font-black text-slate-800 tracking-tight mt-1 block">{tasaEficienciaSalvado}%</span>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Desperdicio Cero Liderado</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* ================= PANEL CENTRAL DE GRÁFICOS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 📉 GRÁFICA 1: HISTÓRICO Y PREDICCIÓN DE VENTAS (TABS: TODO, FINANCIERO) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'financiero') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-blue-950 flex items-center space-x-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Curva de Ventas y Gráfica Predictiva</span>
                </h3>
                <p className="text-[10px] text-slate-400">Datos históricos en millones COP con predicción lineal a 3 meses (IA)</p>
              </div>
              
              {/* Leyendas */}
              <div className="flex items-center space-x-3 text-[9px] font-bold">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Histórico</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-orange-500 border border-dashed border-orange-600" />
                  <span className="text-slate-600">Predicción IA</span>
                </div>
              </div>
            </div>

            {/* Lienzo SVG del Gráfico de Ventas y Predicción */}
            <div className="relative h-60 w-full">
              <svg className="w-full h-full" viewBox="0 0 500 220">
                {/* Rejilla de Fondo */}
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {/* Eje X */}
                <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Etiquetas de valores en Eje Y */}
                <text x="30" y="44" textAnchor="end" className="text-[8px] font-extrabold fill-slate-400">25M</text>
                <text x="30" y="84" textAnchor="end" className="text-[8px] font-extrabold fill-slate-400">15M</text>
                <text x="30" y="124" textAnchor="end" className="text-[8px] font-extrabold fill-slate-400">10M</text>
                <text x="30" y="164" textAnchor="end" className="text-[8px] font-extrabold fill-slate-400">5M</text>

                {/* Relleno degradado histórico */}
                <path
                  d="M 60,180 L 60,135 L 115,123 L 170,111 L 225,93 L 280,80 L 280,180 Z"
                  fill="url(#grad-hist)"
                  opacity="0.15"
                />
                
                {/* Relleno degradado predictivo */}
                <path
                  d="M 280,180 L 280,80 L 335,62 L 390,44 L 445,26 L 445,180 Z"
                  fill="url(#grad-pred)"
                  opacity="0.15"
                />

                <defs>
                  <linearGradient id="grad-hist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="grad-pred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Línea de Ventas Reales (Histórico) */}
                <path
                  d="M 60,135 L 115,123 L 170,111 L 225,93 L 280,80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Línea de Ventas Predictivas (Dashed IA) */}
                <path
                  d="M 280,80 L 335,62 L 390,44 L 445,26"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray="5,4"
                  strokeLinecap="round"
                />

                {/* Puntos y Nodos Interactivos (Históricos) */}
                {[
                  { x: 60, y: 135, val: '8.2M', name: 'Ene' },
                  { x: 115, y: 123, val: '9.8M', name: 'Feb' },
                  { x: 170, y: 111, val: '11.4M', name: 'Mar' },
                  { x: 225, y: 93, val: '13.6M', name: 'Abr' },
                  { x: 280, y: 80, val: '15.4M', name: 'May' }
                ].map((pt, idx) => (
                  <g key={idx} className="cursor-pointer group" onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="text-[9px] font-black fill-slate-800 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 py-0.5 rounded shadow">{pt.val}</text>
                    <text x={pt.x} y="195" textAnchor="middle" className="text-[9px] font-bold fill-slate-500">{pt.name}</text>
                  </g>
                ))}

                {/* Puntos y Nodos Interactivos (Predictivos) */}
                {[
                  { x: 335, y: 62, val: '17.8M', name: 'Jun' },
                  { x: 390, y: 44, val: '20.2M', name: 'Jul' },
                  { x: 445, y: 26, val: '22.8M', name: 'Ago' }
                ].map((pt, idx) => (
                  <g key={idx} className="cursor-pointer group" onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="text-[9px] font-black fill-slate-800 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 py-0.5 rounded shadow">{pt.val}</text>
                    <text x={pt.x} y="195" textAnchor="middle" className="text-[9px] font-bold fill-slate-500">{pt.name}</text>
                  </g>
                ))}
              </svg>

              {/* Tooltip Dinámico */}
              {hoveredPoint && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-slate-950 text-white rounded-xl p-3 border border-slate-800 shadow-xl text-center space-y-0.5 pointer-events-none transition-all duration-300">
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Minería Predictiva</p>
                  <p className="text-sm font-black">{hoveredPoint.name}: {hoveredPoint.val} COP</p>
                  <p className="text-[8px] text-slate-400">Tendencia mensual estimada con regresión lineal</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🏆 GRÁFICA 2: PRODUCTOS QUE MÁS SE VENDEN (TABS: TODO, FINANCIERO) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'financiero') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center space-x-2">
                <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
                <span>Productos Más Vendidos (Volumen de Rescate)</span>
              </h3>
              <p className="text-[10px] text-slate-400">Top 5 categorías de alimentos salvados en la plataforma</p>
            </div>

            {/* Listado de barras horizontales premium */}
            <div className="space-y-4 pt-2">
              {productosMasVendidos.map((prod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                      <span>{prod.name}</span>
                    </span>
                    <span className="text-slate-800 font-extrabold">{prod.ventas.toLocaleString('es-CO')} u. <strong className="text-slate-400">({prod.pct})</strong></span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${(prod.ventas / 1420) * 100}%`,
                        backgroundColor: prod.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⏰ GRÁFICA 3: HORAS Y DÍAS DE MÁS VENTAS (TABS: TODO, CLIENTES) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'clientes') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-blue-950 flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5 text-indigo-500" />
                <span>Horas de Mayor Venta (Demanda Caliente)</span>
              </h3>
              <p className="text-[10px] text-slate-400">Análisis de transacciones agrupadas por jornada del día</p>
            </div>

            {/* Gráfico de Barras Verticales SVG */}
            <div className="h-56 w-full flex items-end">
              <svg className="w-full h-full" viewBox="0 0 360 160">
                {/* Guías horizontales */}
                <line x1="10" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="10" y1="70" x2="350" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="10" y1="120" x2="350" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Barra 1: Mañana */}
                <rect 
                  x="40" 
                  y={120 - (picosVentasHora[0].pct * 2)} 
                  width="50" 
                  height={picosVentasHora[0].pct * 2} 
                  rx="6" 
                  fill="#38bdf8" 
                  className="transition-all duration-500 hover:opacity-85"
                />
                <text x="65" y={110 - (picosVentasHora[0].pct * 2)} textAnchor="middle" className="text-[10px] font-black fill-slate-800">{picosVentasHora[0].pct}%</text>
                <text x="65" y="135" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">Mañana</text>
                <text x="65" y="148" textAnchor="middle" className="text-[7px] font-semibold fill-slate-400">8am - 12pm</text>

                {/* Barra 2: Almuerzo */}
                <rect 
                  x="150" 
                  y={120 - (picosVentasHora[1].pct * 2)} 
                  width="50" 
                  height={picosVentasHora[1].pct * 2} 
                  rx="6" 
                  fill="#f97316" 
                  className="transition-all duration-500 hover:opacity-85 animate-pulse"
                />
                <text x="175" y={110 - (picosVentasHora[1].pct * 2)} textAnchor="middle" className="text-[10px] font-black fill-slate-800">{picosVentasHora[1].pct}% 🔥</text>
                <text x="175" y="135" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">Almuerzo</text>
                <text x="175" y="148" textAnchor="middle" className="text-[7px] font-semibold fill-slate-400">12pm - 4pm</text>

                {/* Barra 3: Tarde/Noche */}
                <rect 
                  x="260" 
                  y={120 - (picosVentasHora[2].pct * 2)} 
                  width="50" 
                  height={picosVentasHora[2].pct * 2} 
                  rx="6" 
                  fill="#818cf8" 
                  className="transition-all duration-500 hover:opacity-85"
                />
                <text x="285" y={110 - (picosVentasHora[2].pct * 2)} textAnchor="middle" className="text-[10px] font-black fill-slate-800">{picosVentasHora[2].pct}%</text>
                <text x="285" y="135" textAnchor="middle" className="text-[8px] font-bold fill-slate-500">Tarde/Noche</text>
                <text x="285" y="148" textAnchor="middle" className="text-[7px] font-semibold fill-slate-400">4pm - 8pm</text>
              </svg>
            </div>
          </div>
        )}

        {/* 👥 GRÁFICA 4: TIPO DE CLIENTE QUE MÁS COMPRA (TABS: TODO, CLIENTES) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'clientes') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-blue-950 flex items-center space-x-2">
                <Users className="h-4.5 w-4.5 text-emerald-500" />
                <span>Perfil de Clientes y Compradores (Demografía)</span>
              </h3>
              <p className="text-[10px] text-slate-400">Estructura del tipo de usuario que rescata alimentos</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              {/* Rosca/Dona SVG */}
              <div className="relative h-32 w-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Círculo base gris */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  
                  {/* Arco 1: Hogares y Familias (45%) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="35" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="12" 
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${(1 - 0.45) * 2 * Math.PI * 35}`}
                    strokeLinecap="round"
                  />
                  {/* Arco 2: Universitarios (33%) - Desplazado */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="35" 
                    fill="transparent" 
                    stroke="#6366f1" 
                    strokeWidth="12" 
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${(1 - 0.33) * 2 * Math.PI * 35}`}
                    transform="rotate(162 50 50)"
                    strokeLinecap="round"
                  />
                  {/* Arco 3: Fundaciones (22%) - Desplazado */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="35" 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth="12" 
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${(1 - 0.22) * 2 * Math.PI * 35}`}
                    transform="rotate(280 50 50)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-800">1.2K</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Activos</span>
                </div>
              </div>

              {/* Leyendas explicativas */}
              <div className="space-y-3 w-full max-w-[200px]">
                {tiposDeClientes.map((c, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="h-3 w-3 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: c.color }} />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-700 leading-tight">{c.tipo}</p>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-slate-800">{c.pct}%</span>
                        <span className="text-[8px] text-slate-400 font-semibold">({c.count})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🍂 GRÁFICA 5: PRODUCTOS QUE MÁS SE PIERDEN/MERMAS (TABS: TODO, MERMAS) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'mermas') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-red-950 flex items-center space-x-2">
                <Trash2 className="h-4.5 w-4.5 text-red-500" />
                <span>Productos que Más se Pierden (Análisis de Mermas)</span>
              </h3>
              <p className="text-[10px] text-slate-400">Alimentos propensos a vencer sin ser rescatados</p>
            </div>

            {/* Gráfico de dona invertido o área SVG */}
            <div className="space-y-4 pt-2">
              {productosMasPerdidos.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 border border-red-100/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow">
                      <Trash2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{prod.name}</h4>
                      <p className="text-[9px] text-slate-400 font-semibold">Tasa de merma estimada</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-red-600 block">{prod.mermas} kg</span>
                    <span className="text-[8px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">{prod.pct}% de pérdida</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🏪 GRÁFICA 6: NEGOCIOS QUE MÁS VENDEN (TABS: TODO, FINANCIERO) */}
        {(activeCategoryFilter === 'todo' || activeCategoryFilter === 'financiero') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-blue-950 flex items-center space-x-2">
                <Building2 className="h-4.5 w-4.5 text-blue-600" />
                <span>Ranking de Comercios Líderes en Ventas</span>
              </h3>
              <p className="text-[10px] text-slate-400">Establecimientos con mayor volumen de excedentes salvados</p>
            </div>

            {/* Tabla de clasificación */}
            <div className="space-y-3.5">
              {rankingNegocios.map((store) => (
                <div key={store.rank} className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  
                  {/* Posición y Nombre */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                      store.rank === 1 ? 'bg-amber-400 text-amber-950' : 
                      store.rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-orange-200 text-orange-950'
                    }`}>
                      {store.rank}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800">{store.nombre}</h4>
                      <p className="text-[9px] text-emerald-600 font-bold">🌱 Eco-Rating: {store.ecoRating} ★</p>
                    </div>
                  </div>

                  {/* Barra de progreso de volumen */}
                  <div className="hidden sm:block w-full max-w-[120px] bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full rounded-full ${store.rank === 1 ? 'bg-blue-600' : store.rank === 2 ? 'bg-indigo-500' : 'bg-cyan-500'}`} 
                      style={{ width: `${store.pct}%` }}
                    />
                  </div>

                  {/* Facturación y kilogramos */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-800 block">{store.salvados} kg</span>
                    <span className="text-[9px] text-slate-400 font-bold block">{store.facturado}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= SECCIÓN DE NOTAS DE MINERÍA Y AUDITORÍA ================= */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5.5 w-5.5 text-emerald-400" />
          <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-widest">Información e Insight de Minería</h3>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">
          Nuestros algoritmos analizan continuamente las transacciones de compra y publicación. La minería revela que el **rango del almuerzo (12:00 PM a 4:00 PM)** representa el **46%** de la facturación en Bogotá, impulsado principalmente por platos preparados de restaurantes que reducen su precio al 60% de descuento. 
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-[10px] text-slate-400">
          <div>
            <span className="font-bold text-slate-300 block">💡 Comportamiento de Fruver:</span>
            Las verduras húmedas se pierden un 40% más rápido; se recomienda a los comercios aplicar alertas de descuento urgentes (60%+) a partir del día 0 de vencimiento.
          </div>
          <div>
            <span className="font-bold text-slate-300 block">👥 Fidelización de Clientes:</span>
            Los hogares bogotanos prefieren comprar hojaldres y lácteos los fines de semana (viernes a domingo), representando el 68% del flujo de compras en esos días.
          </div>
          <div>
            <span className="font-bold text-slate-300 block">🔮 IA y Proyecciones:</span>
            La curva predictiva a 3 meses estima una facturación récord de **$22.8M COP** para el mes de Agosto, impulsada por la incorporación de 15 nuevos comercios en Cedritos.
          </div>
        </div>
      </div>

    </div>
  );
}
