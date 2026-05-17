import React, { useState } from 'react';
import { Package, Sparkles, Tag, Plus, PlusCircle, AlertCircle, CheckCircle2, Image as ImageIcon, Layers, HelpCircle } from 'lucide-react';

export default function ProviderDashboard({ user }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_original: '',
    precio_descuento: '',
    stock: '',
    fecha_vencimiento: '',
    imagen_url: '',
    categoria: 'Verduras',
    es_donacion: false
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('alimop_token');

    if (!token) {
      setStatus({ type: 'error', text: 'Error de sesión. Por favor inicia sesión de nuevo.' });
      setLoading(false);
      return;
    }

    // Validar campos obligatorios
    if (!formData.nombre || !formData.stock || !formData.fecha_vencimiento || !formData.categoria) {
      setStatus({ type: 'error', text: 'Por favor, complete todos los campos obligatorios (*).' });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        precio_original: formData.es_donacion ? 0 : parseFloat(formData.precio_original),
        precio_descuento: formData.es_donacion ? 0 : (formData.precio_descuento ? parseFloat(formData.precio_descuento) : null),
        stock: parseInt(formData.stock),
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          text: `¡Producto publicado con éxito en PostgreSQL! ${data.message || 'Ganaste +10 puntos de sostenibilidad.'}` 
        });
        // Resetear formulario
        setFormData({
          nombre: '',
          descripcion: '',
          precio_original: '',
          precio_descuento: '',
          stock: '',
          fecha_vencimiento: '',
          imagen_url: '',
          categoria: 'Verduras',
          es_donacion: false
        });
      } else {
        setStatus({ type: 'error', text: data.mensaje || 'Error al guardar el producto en la base de datos.' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Error al conectar con el servidor Backend. ¿Está encendido?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Panel de Negocios</span>
          <h1 className="text-3xl font-black text-blue-950 mt-1">
            Gestión de Comercio: <span className="text-blue-600 font-extrabold">{user?.nombre_establecimiento || 'Mi Establecimiento'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Registra y administra los excedentes de comida para reducir pérdidas y contaminación.</p>
        </div>
        
        {/* Tarjeta de Sostenibilidad */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">Impacto ALIMOP</p>
            <p className="text-xl font-black text-slate-800">350 Puntos</p>
            <span className="text-[10px] font-semibold text-emerald-600">+10 puntos por cada publicación</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario Principal */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-premium p-8 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <PlusCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-black text-blue-950">Publicar Nuevo Excedente / Oferta</h2>
          </div>

          {status && (
            <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start space-x-2 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4.5 w-4.5 text-red-600 mt-0.5 shrink-0" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
            
            {/* Categoría y Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Categoría del Alimento *:</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  {['Verduras', 'Frutas', 'Granos', 'Carnes', 'Comidas Rápidas', 'Tienda', 'Lácteos', 'Panadería', 'Restaurante'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Layers className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre del Producto *:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej. Caja de Fresas Orgánicas"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <Package className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Descripción del Estado del Alimento:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Indica el estado de madurez, frescura o el motivo del excedente comercial..."
                rows="2"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none font-semibold text-slate-700"
              />
            </div>

            {/* Switch de Donación */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="font-extrabold text-slate-800 text-xs block">¿Es una donación gratuita?</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Si activas esto, el precio será automáticamente $0 COP</span>
              </div>
              <input
                type="checkbox"
                name="es_donacion"
                checked={formData.es_donacion}
                onChange={handleInputChange}
                className="h-5 w-10 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
              />
            </div>

            {/* Precios (Deshabilitados si es donación) */}
            {!formData.es_donacion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Costo Original (COP) *:</label>
                  <input
                    type="number"
                    name="precio_original"
                    value={formData.precio_original}
                    onChange={handleInputChange}
                    placeholder="Ej. 15000"
                    required={!formData.es_donacion}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="absolute left-3 top-7.5 font-extrabold text-slate-400">$</span>
                </div>

                <div className="relative">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Precio Especial con Descuento (COP):</label>
                  <input
                    type="number"
                    name="precio_descuento"
                    value={formData.precio_descuento}
                    onChange={handleInputChange}
                    placeholder="Ej. 6000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="absolute left-3 top-7.5 font-extrabold text-slate-400">$</span>
                </div>
              </div>
            )}

            {/* Stock y Vencimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Cantidad Disponible (Stock) *:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ej. 5"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <span className="absolute left-3 top-7.5 font-extrabold text-slate-400">#</span>
              </div>

              <div className="relative">
                <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Fecha de Vencimiento *:</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* URL de Imagen */}
            <div className="relative">
              <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">URL de Imagen Ilustrativa (Opcional):</label>
              <input
                type="url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                placeholder="Ej. https://images.unsplash.com/... (Si se deja en blanco se usará una por defecto)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <ImageIcon className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl font-black text-white text-xs tracking-wider transition-premium shadow-md flex items-center justify-center space-x-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{loading ? 'PUBLICANDO EN POSTGRESQL...' : 'PUBLICAR EN CATÁLOGO REAL'}</span>
            </button>

          </form>
        </div>

        {/* Panel Lateral Informativo */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-black text-blue-950 text-sm flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span>¿Cómo funciona ALIMOP?</span>
            </h3>
            
            <div className="space-y-3 text-[11px] text-slate-500 font-semibold leading-relaxed">
              <p>
                • <strong>Puntos de Sostenibilidad:</strong> Cada vez que públicas comida que antes se desperdiciaba, ganas 10 puntos en tu perfil corporativo.
              </p>
              <p>
                • <strong>Descuentos Agresivos:</strong> Te sugerimos aplicar un descuento superior al 50% para incentivar a los clientes a comprar tus alimentos rápidamente.
              </p>
              <p>
                • <strong>Cercanía GPS:</strong> La aplicación mostrará automáticamente tus alimentos a los usuarios que estén localizados a pocos kilómetros de tu establecimiento.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl p-6 space-y-4 shadow-lg">
            <h3 className="font-black text-sm">Metas Ambientales del Mes</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-[10px] uppercase text-blue-200">
                  <span>Comida Salvada</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-blue-950 rounded-full h-1.5 mt-1 border border-blue-800">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-[10px] text-blue-100 font-semibold leading-relaxed">
                ¡Tu negocio ha ayudado a evitar el desperdicio de **120 Kg** de alimentos este mes! Sigamos así.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
