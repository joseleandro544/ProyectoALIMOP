import React from 'react';
import { MapPin, ShoppingBag, Clock, Heart } from 'lucide-react';

export default function ProductCard({ product, userLocation, onAddToCart }) {
  // Calcular distancia dinámica aproximada basada en la ubicación simulada
  // El backend calcula esto con la fórmula Haversine, aquí simulamos una variación amigable
  const baseDistance = product.distancia_base || 1.8;
  let simulatedDistance = baseDistance;

  if (userLocation.name.includes('Pepe Sierra')) {
    simulatedDistance = baseDistance;
  } else if (userLocation.name.includes('Cedritos')) {
    simulatedDistance = baseDistance + 2.3;
  } else {
    simulatedDistance = baseDistance + 7.5;
  }

  // Determinar color y urgencia del vencimiento
  const getExpirationStatus = (days) => {
    if (days === 0) return { label: 'Vence Hoy', color: 'bg-red-50 text-red-700 border-red-200' };
    if (days === 1) return { label: 'Vence Mañana', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: `Expira en ${days} días`, color: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  const expStatus = getExpirationStatus(product.dias_vencimiento);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-premium hover:shadow-lg transition-premium overflow-hidden group flex flex-col justify-between h-full">
      
      {/* Imagen del Producto */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={product.imagen_url} 
          alt={product.nombre} 
          className="w-full h-full object-cover group-hover:scale-105 transition-premium"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';
          }}
        />
        {/* Categoría */}
        <span className="absolute top-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-100">
          {product.categoria}
        </span>
        {/* Distancia GPS */}
        <span className="absolute bottom-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
          <MapPin className="h-3 w-3 text-orange-400" />
          <span>{simulatedDistance.toFixed(1)} km</span>
        </span>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Proveedor / Establecimiento */}
          <span className="text-xs font-semibold text-blue-600 block mb-1">
            {product.nombre_establecimiento}
          </span>
          {/* Título de producto */}
          <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-2">
            {product.nombre}
          </h3>
          {/* Explicación de vencimiento */}
          <div className="flex items-center space-x-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${expStatus.color}`}>
              {expStatus.label}
            </span>
          </div>
          {/* Descripción */}
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {product.descripcion}
          </p>
        </div>

        {/* Precios y Botón */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div className="space-x-1.5 flex items-baseline flex-wrap">
              <span className="text-xl font-black text-blue-900">
                ${product.precio_descuento.toLocaleString('es-CO')} <span className="text-xs font-bold text-blue-600">COP</span>
              </span>
              {product.precio_original > 0 && (
                <span className="text-xs font-bold text-slate-400 line-through">
                  ${product.precio_original.toLocaleString('es-CO')} COP
                </span>
              )}
            </div>
            {product.precio_original > 0 && (
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{Math.round((1 - product.precio_descuento / product.precio_original) * 100)}%
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 rounded-xl bg-azul-cabecera hover:bg-blue-700 text-white font-semibold text-xs transition-premium flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Añadir al Carrito</span>
          </button>
        </div>

      </div>

    </div>
  );
}
