import React from 'react';
import { Leaf, Info, MessageSquare, ShieldAlert } from 'lucide-react';
import logo from '../../logo.jpg';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-azul-pie text-white transition-premium border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo y lema */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Logo ALIMOP" 
                className="h-10 w-10 rounded-full border border-white object-cover bg-white"
              />
              <span className="text-xl font-bold tracking-wider">ALIMOP</span>
            </div>
            <p className="text-sm text-blue-200 max-w-sm">
              Plataforma tecnológica diseñada para reducir el desperdicio de alimentos en Colombia, conectando comercios con clientes y domiciliarios bajo un ecosistema de sostenibilidad ambiental.
            </p>
          </div>

          {/* Menú Rápido */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <button onClick={() => setActiveTab('inicio')} className="hover:text-white hover:underline transition-premium">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('que-es-alimop')} className="hover:text-white hover:underline transition-premium">
                  ¿Qué es ALIMOP?
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compras')} className="hover:text-white hover:underline transition-premium">
                  Compras y Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('registro')} className="hover:text-white hover:underline transition-premium">
                  Crear Cuenta / Login
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto y Objetivos */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Ejes del Negocio</h3>
            <ul className="space-y-3 text-xs text-blue-200">
              <li className="flex items-start space-x-2">
                <Leaf className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Prevención de pérdidas en grandes comercios.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>Ventas dinámicas con precios reducidos.</span>
              </li>
              <li className="flex items-start space-x-2">
                <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Reducción de la huella de carbono en Colombia.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea divisoria e inferior */}
        <div className="mt-8 pt-8 border-t border-blue-900 text-center">
          <p className="text-xs text-blue-300">
            &copy; {new Date().getFullYear()} ALIMOP. Todos los derechos reservados. Proyecto desarrollado para joseleandro544 - Carpeta ProyectoALIMOP.
          </p>
          <p className="text-[10px] text-blue-400 mt-1">
            Bogotá D.C., Colombia • Sistema de Prevención de Pérdida de Alimentos
          </p>
        </div>
      </div>
    </footer>
  );
}
