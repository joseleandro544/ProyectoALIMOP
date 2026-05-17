import React, { useState } from 'react';
import { Search, MapPin, User, ShoppingCart } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  onCartToggle,
  gpsLocation,
  setGpsLocation,
  user
}) {
  const [showGpsMenu, setShowGpsMenu] = useState(false);

  const ubicacionesBogota = [
    { name: 'Bogotá - Pepe Sierra (Cercano)', lat: 4.696500, lng: -74.037800 },
    { name: 'Bogotá - Cedritos (Medio)', lat: 4.721000, lng: -74.041000 },
    { name: 'Bogotá - Centro (Lejano)', lat: 4.598000, lng: -74.075800 }
  ];

  return (
    <header className="bg-azul-cabecera text-white shadow-lg sticky top-0 z-50 transition-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo y Nombre */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <img 
              src="/logo.jpg" 
              alt="Logo ALIMOP" 
              className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm bg-white"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
            <div>
              <span className="text-2xl font-bold tracking-tight block">ALIMOP</span>
              <span className="text-xs text-blue-200 block -mt-1">Prevención de Pérdidas</span>
            </div>
          </div>

          {/* Menú Principal en Español */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'inicio' ? 'bg-blue-800 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('que-es-alimop')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'que-es-alimop' ? 'bg-blue-800 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              ¿Qué es ALIMOP?
            </button>
            <button
              onClick={() => setActiveTab('compras')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compras' ? 'bg-blue-800 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              Compras
            </button>
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'registro' ? 'bg-blue-800 text-white shadow-inner' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              {user ? `Mi Cuenta (${user.rol})` : 'Registro'}
            </button>
          </nav>

          {/* El Buscador e Indicadores */}
          <div className="flex items-center space-x-4">
            
            {/* Buscador de Productos */}
            <div className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'compras') setActiveTab('compras');
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-blue-800 bg-opacity-60 text-white placeholder-blue-200 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white focus:text-slate-800 focus:placeholder-slate-400 text-sm transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-blue-200 pointer-events-none" />
            </div>

            {/* Selector de Geolocalización GPS (Simulación) */}
            <div className="relative">
              <button 
                onClick={() => setShowGpsMenu(!showGpsMenu)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-800 bg-opacity-70 border border-blue-600 hover:bg-blue-700 text-xs font-semibold"
                title="Cambiar mi ubicación GPS de simulación"
              >
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                <span className="max-w-[120px] truncate">{gpsLocation.name.split(' - ')[1]}</span>
              </button>
              {showGpsMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-100 py-1 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 border-b border-slate-100">
                    Simular mi Ubicación GPS:
                  </div>
                  {ubicacionesBogota.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => {
                        setGpsLocation(loc);
                        setShowGpsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-premium flex items-center justify-between ${
                        gpsLocation.name === loc.name ? 'font-bold text-blue-600 bg-blue-50 bg-opacity-50' : ''
                      }`}
                    >
                      <span>{loc.name}</span>
                      <MapPin className={`h-3 w-3 ${gpsLocation.name === loc.name ? 'text-blue-600' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Carrito de Compras */}
            <button 
              onClick={onCartToggle}
              className="relative p-2.5 rounded-full hover:bg-blue-800 transition-premium flex items-center justify-center border border-blue-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-naranja-alerta text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-azul-cabecera animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Perfil de Usuario */}
            <button 
              onClick={() => setActiveTab('registro')}
              className="p-2.5 rounded-full hover:bg-blue-800 transition-premium border border-blue-600 flex items-center justify-center"
            >
              <User className="h-5 w-5" />
            </button>

          </div>

        </div>
        
        {/* Buscador móvil */}
        <div className="pb-4 block lg:hidden relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'compras') setActiveTab('compras');
            }}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-blue-800 bg-opacity-60 text-white placeholder-blue-200 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-blue-200" />
        </div>

      </div>
    </header>
  );
}
