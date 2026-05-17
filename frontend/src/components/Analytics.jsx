import React, { useState } from 'react';
import { Leaf, Award, BarChart3, TrendingUp, Globe2 } from 'lucide-react';

export default function Analytics() {
  const [selectedRange, setSelectedRange] = useState('mes');

  // Datos estadísticos simulados del impacto ambiental en Colombia
  const categorias = [
    { name: 'Panadería y Pastelería', kg: 1420, co2: 2.1, color: 'bg-blue-600' },
    { name: 'Lácteos y Quesos', kg: 980, co2: 3.4, color: 'bg-emerald-600' },
    { name: 'Frutas y Verduras (Fruver)', kg: 2450, co2: 1.2, color: 'bg-orange-500' },
    { name: 'Comidas Preparadas', kg: 670, co2: 1.8, color: 'bg-red-500' }
  ];

  const totalKg = categorias.reduce((acc, cat) => acc + cat.kg, 0);
  const totalCo2 = categorias.reduce((acc, cat) => acc + (cat.kg * cat.co2) / 1000, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-8 transition-premium">
      
      {/* Título e introducción */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Dashboard de Impacto</span>
          <h2 className="text-2xl font-black text-blue-950 flex items-center space-x-2 mt-1">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Métricas de Sostenibilidad y Ahorro</span>
          </h2>
        </div>
        
        {/* Selector de Rango */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['semana', 'mes', 'año'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-premium ${
                selectedRange === range ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Cartas de Métricas Destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Tarjeta de Kg Salvados */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Alimentos Salvados</span>
            <span className="text-2xl font-extrabold text-blue-950">{(totalKg * (selectedRange === 'semana' ? 0.25 : selectedRange === 'año' ? 12 : 1)).toLocaleString('es-CO')} kg</span>
            <span className="text-[10px] text-blue-500 block font-medium mt-0.5">¡Evitado que terminen en la basura!</span>
          </div>
        </div>

        {/* Tarjeta de CO2 Reducido */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Huella de CO₂ Evitada</span>
            <span className="text-2xl font-extrabold text-emerald-950">{(totalCo2 * (selectedRange === 'semana' ? 0.25 : selectedRange === 'año' ? 12 : 1)).toFixed(1)} Toneladas</span>
            <span className="text-[10px] text-emerald-500 block font-medium mt-0.5">Equivalente a plantar 180 árboles.</span>
          </div>
        </div>

        {/* Tarjeta de Sostenibilidad Social */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
            <Globe2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">Comercios Adheridos</span>
            <span className="text-2xl font-extrabold text-orange-950">42 Establecimientos</span>
            <span className="text-[10px] text-orange-500 block font-medium mt-0.5">En Bogotá D.C. y Sabana Norte.</span>
          </div>
        </div>

      </div>

      {/* Gráficos vectoriales SVG interactivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico 1: Kilogramos por Categoría */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span>Alimentos Rescatados por Categoría (kg)</span>
          </h3>

          <div className="space-y-4">
            {categorias.map((cat) => {
              const valorFiltrado = cat.kg * (selectedRange === 'semana' ? 0.25 : selectedRange === 'año' ? 12 : 1);
              const maxValor = 2450 * (selectedRange === 'semana' ? 0.25 : selectedRange === 'año' ? 12 : 1);
              const porcentaje = (valorFiltrado / maxValor) * 100;

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">{cat.name}</span>
                    <span className="text-slate-800 font-bold">{Math.round(valorFiltrado).toLocaleString('es-CO')} kg</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full ${cat.color} transition-all duration-1000`} 
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico 2: Explicación de la Metodología */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
              Nuestra Metodología de Impacto
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Cada kilogramo de comida que evitamos desperdiciar ahorra no solo el recurso alimentario directo, sino todo el costo energético y de agua invertido en su cultivo, transporte y empaque. 
            </p>
            
            <div className="space-y-2 border-t border-slate-200 pt-4 text-slate-700 text-xs">
              <div className="flex justify-between">
                <span>⚡ Energía de cultivo ahorrada:</span>
                <span className="font-bold text-slate-800">4,200 kWh</span>
              </div>
              <div className="flex justify-between">
                <span>💧 Agua potable rescatada:</span>
                <span className="font-bold text-slate-800">12,500 Litros</span>
              </div>
              <div className="flex justify-between">
                <span>🚜 CO₂ de transporte evitado:</span>
                <span className="font-bold text-slate-800">1,820 kg</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-xl p-3.5 mt-4 text-[10px] font-semibold text-center uppercase tracking-wide">
            ¡Cada alimento salvado cuenta para salvar el planeta!
          </div>
        </div>

      </div>

    </div>
  );
}
