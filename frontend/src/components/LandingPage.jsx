import React from 'react';
import { 
  TrendingUp, Leaf, Users, Sprout, 
  ShoppingCart, ShoppingBag, Carrot, Apple, 
  Wheat, Beef, Pizza, Store, Milk, Croissant, ChefHat 
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function LandingPage({ productos, setActiveTab, setSearchQuery, gpsLocation, onAddToCart }) {
  
  // NIVEL 2: Filtrar promociones urgentes (Vencen hoy con mayor descuento)
  const promocionesUrgentes = productos
    .filter(p => p.dias_vencimiento === 0 || (1 - p.precio_descuento / p.precio_original) >= 0.5)
    .slice(0, 3); // Top 3 promociones

  // NIVEL 3: Configuración de las 9 categorías solicitadas
  const categorias = [
    { name: 'Verduras', icon: Carrot, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Frutas', icon: Apple, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Granos', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Carnes', icon: Beef, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Comidas Rápidas', icon: Pizza, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Tienda', icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Lácteos', icon: Milk, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { name: 'Panadería', icon: Croissant, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Restaurante', icon: ChefHat, color: 'text-slate-700', bg: 'bg-slate-100' }
  ];

  const handleCategoryClick = (categoryName) => {
    setSearchQuery(categoryName);
    setActiveTab('compras');
  };

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      
      {/* =========================================
          NIVEL 1: DATOS ESTADÍSTICOS (IMPACTO)
          ========================================= */}
      <section>
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">
            Impacto en Tiempo Real
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-blue-950 mt-4 tracking-tight">
            Cambiando el mundo, un plato a la vez
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Nuestros esfuerzos conjuntos logran reducir el desperdicio y apoyar la economía de Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card: Ventas */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">$42M</h3>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest mt-1">Ventas Online</span>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Recuperados para el comercio local</p>
          </div>

          {/* Card: Prevención */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">8,450 kg</h3>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-1">Alimentos Rescatados</span>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Prevención directa de merma alimentaria</p>
          </div>

          {/* Card: Familias */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">1,240</h3>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest mt-1">Familias Beneficiadas</span>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Comprando comida deliciosa a menor precio</p>
          </div>

          {/* Card: Cosecha */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <Sprout className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">32</h3>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest mt-1">Productos en Cosecha</span>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Frescura local y excedentes de temporada</p>
          </div>
        </div>
      </section>

      {/* =========================================
          NIVEL 2: PROMOCIONES URGENTES (ALTO DESCUENTO)
          ========================================= */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShoppingCart className="h-48 w-48 text-orange-500" />
        </div>
        
        <div className="relative z-10 mb-8">
          <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center justify-center w-fit space-x-1 mb-3">
            <ShoppingCart className="h-3 w-3" />
            <span>Última Oportunidad</span>
          </span>
          <h2 className="text-2xl font-black text-slate-800">Promociones Urgentes</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg">
            ¡Ayúdanos a rescatar estos alimentos hoy! Disfruta de descuentos excepcionales en productos que están a punto de vencer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {promocionesUrgentes.map(prod => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              userLocation={gpsLocation} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
        
        <div className="mt-8 text-center relative z-10">
          <button 
            onClick={() => {
              setSearchQuery('');
              setActiveTab('compras');
            }}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-premium"
          >
            Ver todas las ofertas
          </button>
        </div>
      </section>

      {/* =========================================
          NIVEL 3: GRID DE CATEGORÍAS
          ========================================= */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-blue-950 flex items-center justify-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span>¿Qué quieres salvar hoy?</span>
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Selecciona una categoría para explorar los productos disponibles y apoyar los comercios locales.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categorias.map((cat, idx) => {
            const IconComponent = cat.icon;
            // Para el grid de 9, ajustamos los col-spans para que encajen perfecto en grandes resoluciones
            const extraClasses = idx === 8 ? "sm:col-span-3 lg:col-span-1" : "";
            
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-premium hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group ${extraClasses}`}
              >
                <div className={`h-14 w-14 rounded-full ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-7 w-7 ${cat.color}`} />
                </div>
                <span className="font-bold text-slate-700 text-sm tracking-tight text-center">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
