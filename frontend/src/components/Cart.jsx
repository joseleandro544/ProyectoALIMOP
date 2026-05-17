import React, { useState } from 'react';
import { X, Trash2, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckoutSuccess }) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [checkedOut, setCheckedOut] = useState(false);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.precio_descuento * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckedOut(true);
    setTimeout(() => {
      onCheckoutSuccess();
      setCheckedOut(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay translúcido */}
      <div 
        className="absolute inset-0 bg-slate-900 bg-opacity-50 transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Cabecera del Carrito (Azul) */}
          <div className="bg-azul-cabecera text-white px-6 py-5 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5.5 w-5.5 text-orange-400" />
              <h2 className="text-lg font-bold">Mi Carrito de Compras</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-blue-800 transition-premium">
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Cuerpo - Listado de productos */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {checkedOut ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-800">¡Pedido Reservado!</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Tu orden ha sido procesada de forma transaccional. Hemos debitado de nuestro inventario y notificado a la tienda comercializadora.
                </p>
                <div className="w-16 h-1 bg-emerald-500 rounded-full animate-bounce mt-4"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 space-y-2">
                <ShoppingBag className="h-12 w-12 text-slate-300" />
                <p className="text-sm font-semibold">El carrito está vacío</p>
                <p className="text-xs text-center px-6">Ve a la pestaña de compras para salvar excedentes de comida deliciosa.</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pt-4 first:pt-0">
                    <img 
                      src={item.imagen_url} 
                      alt={item.nombre} 
                      className="h-16 w-16 object-cover rounded-lg border border-slate-200" 
                    />
                    <div className="flex-1 ml-4 pr-2">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.nombre}</h4>
                      <p className="text-[10px] text-blue-600 font-semibold">{item.nombre_establecimiento}</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        ${item.precio_descuento.toLocaleString('es-CO')} <span className="text-[10px] text-blue-600">COP</span>
                      </p>
                    </div>
                    {/* Controles de Cantidad */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-premium"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer del Carrito (Resumen de Cobro - Azul oscuro) */}
          {!checkedOut && cartItems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-medium">Método de Pago:</span>
                <select 
                  value={metodoPago} 
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                >
                  <option value="efectivo">Efectivo al recibir</option>
                  <option value="tarjeta">Tarjeta Crédito/Débito</option>
                  <option value="puntos">Puntos Fidelidad</option>
                </select>
              </div>

              <div className="flex items-baseline justify-between border-t border-slate-200 pt-3 text-slate-800">
                <span className="text-sm font-bold">Total Compra:</span>
                <span className="text-2xl font-black text-blue-900">
                  ${total.toLocaleString('es-CO')} <span className="text-sm font-bold text-blue-600">COP</span>
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-azul-cabecera hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-premium shadow-md flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4.5 w-4.5" />
                <span>Confirmar y Salvar Alimentos</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
