import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AuthForm from './components/AuthForm';
import Analytics from './components/Analytics';
import LandingPage from './components/LandingPage';
import ProviderDashboard from './components/ProviderDashboard';
import CourierDashboard from './components/CourierDashboard';
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

  // Catálogo de productos desde la Base de Datos PostgreSQL
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Conexión real al Backend Node.js
        const API_URL = 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/products?lat=${gpsLocation.lat}&lng=${gpsLocation.lng}`);
        
        if (response.ok) {
          const result = await response.json();
          // Soporta products (API PostgreSQL), data, o array directo
          const prodList = result.products || result.data || result;
          
          // Formateo de tipos de datos provenientes de PostgreSQL (Numéricos suelen llegar como strings)
          const formatted = prodList.map(p => ({
            ...p,
            precio_original: parseFloat(p.precio_original) || 0,
            precio_descuento: parseFloat(p.precio_descuento) || 0,
            dias_vencimiento: parseInt(p.dias_vencimiento) || 0,
            distancia_base: parseFloat(p.distancia_km) || p.distancia_base || 1.0
          }));
          
          setProductos(formatted);
        } else {
          console.error("Error cargando el catálogo desde PostgreSQL");
        }
      } catch (error) {
        console.error("Error conectando al servidor Backend. Asegúrate de encenderlo en el puerto 5000.", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [gpsLocation]);

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
        
        {/* VISTA: INICIO / PANEL CONDICIONAL POR ROL */}
        {activeTab === 'inicio' && (
          !user || user.rol === 'cliente' || user.rol === 'administrador' ? (
            <LandingPage 
              productos={productos} 
              setActiveTab={setActiveTab} 
              setSearchQuery={setSearchQuery} 
              gpsLocation={gpsLocation} 
              onAddToCart={handleAddToCart} 
            />
          ) : user.rol === 'proveedor' ? (
            <ProviderDashboard user={user} />
          ) : (
            <CourierDashboard user={user} />
          )
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
