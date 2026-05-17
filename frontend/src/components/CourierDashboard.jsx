import React, { useState } from 'react';
import { Truck, MapPin, Navigation, CheckCircle2, ShieldAlert, AlertCircle, Compass, Star } from 'lucide-react';

export default function CourierDashboard({ user }) {
  // Simulador de notificaciones de servicios para Bogotá
  const [servicios, setServicios] = useState([
    {
      id: 1,
      codigo_pedido: '#ALM-7492',
      establecimiento: 'Panadería El Trigal',
      direccion_inicial: 'Calle 140 #11-54, Cedritos',
      direccion_final: 'Carrera 15 #106-22, Chicó Reservado',
      distancia: 2.8,
      estado: 'disponible',
      puntos_fidelidad: 15,
      cliente: 'Mariana Restrepo'
    },
    {
      id: 2,
      codigo_pedido: '#ALM-2831',
      establecimiento: 'Supermercado Carulla',
      direccion_inicial: 'Calle 116 #15-30, Pepe Sierra',
      direccion_final: 'Calle 127 #45-12, Prado Veraniego',
      distancia: 3.4,
      estado: 'disponible',
      puntos_fidelidad: 20,
      cliente: 'Carlos Julio Ortega'
    },
    {
      id: 3,
      codigo_pedido: '#ALM-9910',
      establecimiento: 'Fruver Calle 140',
      direccion_inicial: 'Calle 140 #7-21, Cedritos',
      direccion_final: 'Carrera 9 #147-80, Cedritos',
      distancia: 1.1,
      estado: 'disponible',
      puntos_fidelidad: 10,
      cliente: 'Sofía Castaño'
    }
  ]);

  const [servicioActivo, setServicioActivo] = useState(null);

  const handleAceptarServicio = (id) => {
    setServicios(prev => prev.map(srv => {
      if (srv.id === id) {
        const actualizado = { ...srv, estado: 'en_ruta' };
        setServicioActivo(actualizado);
        return actualizado;
      }
      return srv;
    }));
    alert("¡Servicio aceptado! Dirígete al establecimiento a retirar la comida para evitar su desperdicio.");
  };

  const handleCompletarServicio = (id) => {
    setServicios(prev => prev.filter(srv => srv.id !== id));
    setServicioActivo(null);
    alert("¡Excelente trabajo! Has completado el servicio, ganaste tus puntos y salvaste alimentos de ir al vertedero. 🌍💚");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Panel de Logística</span>
          <h1 className="text-3xl font-black text-blue-950 mt-1">
            Terminal de Reparto: <span className="text-indigo-600 font-extrabold">{user?.nombre_completo || 'Domiciliario'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Conecta establecimientos de comida con compradores locales para salvar alimentos en Bogotá.</p>
        </div>

        {/* Tarjeta de Reparto */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-3xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md">
            <Truck className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest">Nivel de Repartidor</p>
            <p className="text-xl font-black text-slate-800">Oro (4.9 ★)</p>
            <span className="text-[10px] font-semibold text-indigo-600">¡Salvaste 24 entregas este mes!</span>
          </div>
        </div>
      </div>

      {/* Alerta de Servicio Activo */}
      {servicioActivo && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 border border-indigo-950 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
            <Compass className="h-48 w-48 rotate-45 text-white" />
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping"></span>
            <h2 className="text-base font-black uppercase tracking-wider">ENTREGA ACTIVA EN CURSO</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs border-y border-indigo-800 py-6">
            <div>
              <p className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Código del Pedido</p>
              <p className="text-base font-black mt-1 text-white">{servicioActivo.codigo_pedido}</p>
            </div>
            <div>
              <p className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Establecimiento (Origen)</p>
              <p className="text-sm font-bold mt-1 text-white">{servicioActivo.establecimiento}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{servicioActivo.direccion_inicial}</p>
            </div>
            <div>
              <p className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Comprador (Destino)</p>
              <p className="text-sm font-bold mt-1 text-white">{servicioActivo.cliente}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{servicioActivo.direccion_final}</p>
            </div>
            <div>
              <p className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Distancia Total</p>
              <p className="text-base font-black mt-1 text-emerald-400">{servicioActivo.distancia} Km</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleCompletarServicio(servicioActivo.id)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs tracking-wider transition-premium shadow-md flex items-center space-x-2"
            >
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>MARCAR SERVICIO COMO COMPLETADO (ENTREGADO)</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid de Solicitudes Disponibles */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Navigation className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-black text-blue-950">Notificaciones de Servicios Disponibles (Bogotá)</h2>
        </div>

        {servicios.filter(s => s.estado === 'disponible').length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">¡Todo al día!</p>
            <p className="text-xs text-slate-400 mt-1">No hay más pedidos pendientes por repartir en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.filter(s => s.estado === 'disponible').map((srv) => (
              <div 
                key={srv.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 hover:shadow-xl transition-premium flex flex-col justify-between space-y-5"
              >
                {/* Cabecera del servicio */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-black tracking-wider">
                    {srv.codigo_pedido}
                  </span>
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>+{srv.puntos_fidelidad} Pts</span>
                  </span>
                </div>

                {/* Ruta de Origen a Destino */}
                <div className="space-y-4 relative pl-5 text-xs font-semibold text-slate-600">
                  {/* Línea conectora */}
                  <div className="absolute left-1.5 top-2.5 bottom-2.5 w-0.5 border-l border-dashed border-indigo-200"></div>

                  {/* Origen */}
                  <div className="relative">
                    <MapPin className="absolute -left-5 top-0 h-4.5 w-4.5 text-blue-600" />
                    <p className="font-extrabold text-[10px] uppercase text-blue-600 tracking-wider">Punto de Recogida (Origen)</p>
                    <p className="font-black text-slate-800 text-xs mt-0.5">{srv.establecimiento}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{srv.direccion_inicial}</p>
                  </div>

                  {/* Destino */}
                  <div className="relative">
                    <MapPin className="absolute -left-5 top-0 h-4.5 w-4.5 text-orange-500" />
                    <p className="font-extrabold text-[10px] uppercase text-orange-600 tracking-wider">Dirección de Entrega (Destino)</p>
                    <p className="font-black text-slate-800 text-xs mt-0.5">{srv.cliente}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{srv.direccion_final}</p>
                  </div>
                </div>

                {/* Pie de la tarjeta */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Distancia</span>
                    <span className="font-black text-slate-800 text-sm">{srv.distancia} Km</span>
                  </div>
                  
                  <button
                    onClick={() => handleAceptarServicio(srv.id)}
                    disabled={!!servicioActivo}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider transition-premium flex items-center space-x-1.5 ${
                      servicioActivo 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow'
                    }`}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>ACEPTAR SERVICIO</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
