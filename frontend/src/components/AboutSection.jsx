import React from 'react';
import { Target, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 transition-premium">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            Nuestra Misión
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mt-4 tracking-tight">
            ¿Qué es ALIMOP?
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-slate-600 mt-3 italic max-w-2xl mx-auto">
            Sistema de Prevención de Pérdida de Alimentos
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Resumen explicativo de la plataforma */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm mb-12">
          <p className="text-slate-700 leading-relaxed text-lg">
            ALIMOP es un ecosistema tecnológico diseñado en Colombia para resolver uno de los desafíos más críticos de nuestra sociedad: el desperdicio innecesario de comida en supermercados, restaurantes y comercios. Actúa como un puente inteligente y geolocalizado en tiempo real, permitiendo a las comercializadoras vender sus productos con fecha próxima de caducidad y canalizar donaciones de forma eficiente.
          </p>
        </div>

        {/* Sección de Objetivos */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-blue-950 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Objetivos Estratégicos</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Objetivo 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium hover:shadow-lg transition-premium flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                Tecnología Comercial
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Consolidar una herramienta tecnológica (aplicación) que permita minimizar la pérdida de los alimentos, diseñada para empresas comercializadoras.
              </p>
            </div>

            {/* Objetivo 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium hover:shadow-lg transition-premium flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                Ventas Inteligentes
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Incrementar las ventas online de productos alimenticios, próximos a vencerse o desperdiciarse.
              </p>
            </div>

            {/* Objetivo 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium hover:shadow-lg transition-premium flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                <ShieldAlert className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                Impacto Ambiental
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Reducir la contaminación ambiental, especialmente con los desperdicios de los alimentos.
              </p>
            </div>

          </div>
        </div>

        {/* Sección del Impacto */}
        <div className="mt-16 text-center bg-blue-900 text-white rounded-2xl p-8 shadow-md">
          <h3 className="text-lg font-bold">¿Quieres unirte al cambio?</h3>
          <p className="text-xs text-blue-200 mt-2 max-w-lg mx-auto leading-relaxed">
            Tanto si eres un comercio que busca reducir mermas como si eres un cliente que desea ahorrar dinero salvando comida deliciosa, ALIMOP tiene un lugar para ti.
          </p>
        </div>

      </div>
    </section>
  );
}
