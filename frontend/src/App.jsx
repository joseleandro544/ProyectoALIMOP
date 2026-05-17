import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AuthForm from './components/AuthForm';
import Analytics from './components/Analytics';
import { Leaf, ShoppingBag, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [gpsLocation, setGpsLocation] = useState({
    name: 'Bogotá - Pepe Sierra (Cercano)',
    lat: 4.696500,
    lng: -74.037800
  });

  // Catálogo de productos semilla (simulación en español)
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: "Bolsa de Pan Artesanal Integral",
      nombre_establecimiento: "Panadería El Trigal - Cedritos",
      descripcion: "Pan horneado esta mañana con masa madre y semillas de linaza. Excelente estado y frescura.",
      precio_original: 8500,
      precio_descuento: 3400,
      stock: 4,
      dias_vencimiento: 1, // Vence Mañana
      categoria: "Panadería",
      imagen_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
      distancia_base: 1.2
    },
    {
      id: 2,
      nombre: "Yogurt Griego de Arándanos x4",
      nombre_establecimiento: "Supermercado Carulla - Pepe Sierra",
      descripcion: "Pack de yogurt griego descremado. Lote con vencimiento al final del día de hoy.",
      precio_original: 16500,
      precio_descuento: 6600,
      stock: 3,
      dias_vencimiento: 0, // Vence Hoy
      categoria: "Lácteos",
      imagen_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
      distancia_base: 0.8
    },
    {
      id: 3,
      nombre: "Ensalada César con Pollo y Crutones",
      nombre_establecimiento: "Restaurante Wok Calle 116",
      descripcion: "Ensalada fresca preparada en el turno de la mañana. Excedente del almuerzo de hoy.",
      precio_original: 24000,
      precio_descuento: 12000,
      stock: 2,
      dias_vencimiento: 1, // Vence Mañana
      categoria: "Comidas Preparadas",
      imagen_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400",
      distancia_base: 1.5
    },
    {
      id: 4,
      nombre: "Caja de Donas Surtidas x6 unidades",
      nombre_establecimiento: "Panadería La Colmena",
      descripcion: "Donas glaseadas variadas y decoradas. Horneadas al iniciar el día laboral.",
      precio_original: 18000,
      precio_descuento: 5400,
      stock: 5,
      dias_vencimiento: 0, // Vence Hoy
      categoria: "Pastelería",
      imagen_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400",
      distancia_base: 2.2
    },
    {
      id: 5,
      nombre: "Manzanas Rojas Orgánicas x6",
      nombre_establecimiento: "Fruver Calle 140",
      descripcion: "Bolsa de manzanas rojas frescas listas para consumo, mermas por excedentes de inventario.",
      precio_original: 14500,
      precio_descuento: 7250,
      stock: 6,
      dias_vencimiento: 3, // Vence en 3 días
      categoria: "Frutas",
      imagen_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400",
      distancia_base: 1.6
    },
    {
      id: 6,
      nombre: "Sándwich de Jamón de Pavo y Queso",
      nombre_establecimiento: "Restaurante El Cafeto",
      descripcion: "Sándwich en pan ciabatta con aderezos caseros. Empacado al vacío para mantener frescura.",
      precio_original: 13000,
      precio_descuento: 6500,
      stock: 2,
      dias_vencimiento: 1, // Vence Mañana
      categoria: "Comidas Preparadas",
      imagen_url: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=400",
      distancia_base: 0.9
    }
  ]);

  // Carrito Lógica
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    alert("¡Pedido realizado con éxito! Gracias por contribuir a reducir la huella de carbono y el desperdicio de comida en Colombia.");
  };

  // Filtrado de productos por el buscador y por coordenadas de simulación
  const filteredProducts = productos.filter((prod) => {
    const matchSearch = prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        prod.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.nombre_establecimiento.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between transition-premium">
      
      {/* Cabecera Azul */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        gpsLocation={gpsLocation}
        setGpsLocation={setGpsLocation}
        user={user}
      />

      {/* Contenido Principal (Fondo Blanco) */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VISTA: INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-12">
            
            {/* Banner Principal / Hero */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-950">
              <div className="space-y-6 max-w-xl text-center md:text-left">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center justify-center w-fit mx-auto md:mx-0 space-x-1">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  <span>ALIMOP Colombia</span>
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                  ¡Salva comida deliciosa, ahorra dinero y protege el ambiente!
                </h1>
                <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                  Conectamos supermercados, restaurantes y panaderías locales en Bogotá para vender sus excedentes de comida de excelente calidad con hasta el 70% de descuento. ¡Sé parte del cambio!
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
                  <button 
                    onClick={() => setActiveTab('compras')}
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-premium shadow-md"
                  >
                    Salvar Comida Ahora
                  </button>
                  <button 
                    onClick={() => setActiveTab('que-es-alimop')}
                    className="px-6 py-3 rounded-xl bg-blue-800 bg-opacity-80 hover:bg-blue-800 border border-blue-600 text-white font-bold text-xs transition-premium"
                  >
                    Saber Más
                  </button>
                </div>
              </div>

              {/* Imagen Ilustrativa */}
              <div className="relative w-full max-w-xs md:max-w-md">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" 
                  alt="Mercado Sostenible"
                  className="rounded-2xl shadow-lg object-cover w-full h-64 border-4 border-white border-opacity-20"
                />
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-2 text-xs font-bold">
                  <Leaf className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="block text-slate-800 text-[10px] uppercase font-bold text-slate-400">Huella Ahorrada</span>
                    <span className="block text-slate-900 font-extrabold -mt-1">1.2 Toneladas CO₂</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ejes y estadísticas del impacto ambiental */}
            <Analytics />

            {/* Llamados a la acción para Registro / Comercios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-950 mb-2">¿Eres comerciante o supermercado?</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    Reduce tus mermas, recupera el costo de producción y obtén puntos de sostenibilidad publicando tus excedentes de alimentos con fecha próxima de caducidad. ¡Es rápido y automatizado!
                  </p>
                </div>
                <button 
                  onClick={() => { setActiveTab('registro'); }}
                  className="px-6 py-3 rounded-xl bg-azul-cabecera hover:bg-blue-700 text-white font-bold text-xs transition-premium w-fit shadow"
                >
                  Registrar mi Tienda / Comercio
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-950 mb-2">¿Quieres ganar dinero entregando comida?</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    Únete a nuestra flota de domiciliarios de ALIMOP en Bogotá. Reclama pedidos acumulados en tu zona y transpórtalos usando tu bicicleta, moto o vehículo. ¡Tú eliges tus horarios!
                  </p>
                </div>
                <button 
                  onClick={() => { setActiveTab('registro'); }}
                  className="px-6 py-3 rounded-xl bg-azul-cabecera hover:bg-blue-700 text-white font-bold text-xs transition-premium w-fit shadow"
                >
                  Registrarme como Repartidor
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VISTA: ¿QUÉ ES ALIMOP? */}
        {activeTab === 'que-es-alimop' && (
          <AboutSection />
        )}

        {/* VISTA: COMPRAS Y CATÁLOGO */}
        {activeTab === 'compras' && (
          <div className="space-y-8">
            
            {/* Encabezado del catálogo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Salvar excedentes</span>
                <h1 className="text-3xl font-black text-blue-950 mt-1">Catálogo de Alimentos Disponibles</h1>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Mostrando distancias desde: <strong className="text-blue-700">{gpsLocation.name.split(' - ')[1]}</strong></span>
              </div>
            </div>

            {/* Listado de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No se encontraron productos</p>
                <p className="text-xs text-slate-400 mt-1">Prueba buscando palabras como "pan", "yogurt", "manzana" o borra el término de búsqueda.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow hover:bg-blue-700"
                >
                  Limpiar Búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    userLocation={gpsLocation}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VISTA: REGISTRO Y LOGIN */}
        {activeTab === 'registro' && (
          <div>
            {user ? (
              <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-premium p-8 text-center space-y-6">
                <span className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </span>
                <div>
                  <h2 className="text-xl font-black text-blue-950">¡Sesión Activa!</h2>
                  <p className="text-xs text-slate-500 mt-1">Conectado como <strong className="text-slate-800">{user.nombre_completo}</strong></p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left border border-slate-100 space-y-2">
                  <p>• <strong>Rol del Usuario:</strong> {user.rol.toUpperCase()}</p>
                  <p>• <strong>Email corporativo:</strong> {user.email}</p>
                  {user.rol === 'cliente' && <p>• <strong>Puntos Fidelidad:</strong> 120 puntos (1 punto por cada $1000 COP)</p>}
                  {user.rol === 'proveedor' && <p>• <strong>Puntos Sostenibilidad:</strong> 350 puntos (+10 por excedente listado)</p>}
                </div>
                <button 
                  onClick={() => { setUser(null); alert("Sesión cerrada correctamente."); }}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-premium"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <AuthForm 
                onLoginSuccess={(userData) => { setUser(userData); setActiveTab('inicio'); }} 
                onRegisterSuccess={(regData) => { alert("Registro completado. Ahora puedes iniciar sesión con tus datos."); setIsLogin(true); }}
              />
            )}
          </div>
        )}

      </main>

      {/* Pie de Página Azul */}
      <Footer setActiveTab={setActiveTab} />

      {/* Cesta del Carrito Lateral */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

    </div>
  );
}
