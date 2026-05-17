import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, Calendar, Heart, FileText, Landmark, Truck } from 'lucide-react';

export default function AuthForm({ onLoginSuccess, onRegisterSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [rol, setRol] = useState('cliente');

  // Campos del Formulario
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    password: '',
    telefono: '',
    fecha_nacimiento: '',
    preferencias_alimentarias: '',
    nit: '',
    razon_social: '',
    nombre_establecimiento: '',
    tipo_establecimiento: 'Supermercado',
    vehiculo_tipo: 'Bicicleta',
    vehiculo_placa: ''
  });

  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setMessage({ text: 'Por favor complete todos los campos obligatorios', type: 'error' });
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ text: `¡Inicio de sesión exitoso! Bienvenido de nuevo.`, type: 'success' });
          // Guardar token JWT en localStorage para futuras peticiones (como compras)
          localStorage.setItem('alimop_token', data.token);
          setTimeout(() => {
            onLoginSuccess(data.usuario);
          }, 1000);
        } else {
          setMessage({ text: data.mensaje || 'Contraseña incorrecta o usuario no encontrado', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error conectando con PostgreSQL (¿Está encendido el Backend?)', type: 'error' });
      }

    } else {
      if (!formData.nombre_completo || !formData.email || !formData.password || !formData.telefono) {
        setMessage({ text: 'Por favor llene los campos obligatorios principales', type: 'error' });
        return;
      }

      try {
        // Enviar payload completo de registro, con datos atómicos 1:1 según el rol
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, rol: rol })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ text: `¡Registro transaccional exitoso en PostgreSQL! Tu perfil de ${rol.toUpperCase()} fue creado.`, type: 'success' });
          setTimeout(() => {
            onRegisterSuccess(data.usuario);
          }, 1500);
        } else {
          setMessage({ text: data.mensaje || 'Error en el registro (Puede que el email ya exista)', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error conectando con PostgreSQL', type: 'error' });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-premium p-8 transition-premium">
      
      {/* Botones de Cambio Login/Registro */}
      <div className="flex border-b border-slate-100 pb-4 mb-6">
        <button
          onClick={() => { setIsLogin(true); setMessage(null); }}
          className={`flex-1 text-center py-2 text-sm font-bold transition-premium ${
            isLogin ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => { setIsLogin(false); setMessage(null); }}
          className={`flex-1 text-center py-2 text-sm font-bold transition-premium ${
            !isLogin ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Mensajes de Alerta */}
      {message && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold mb-5 flex items-center space-x-2 border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
        }`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Título */}
      <h2 className="text-xl font-black text-blue-950 mb-4 flex items-center space-x-2">
        <ShieldCheck className="h-5.5 w-5.5 text-blue-600" />
        <span>{isLogin ? 'Acceso al Ecosistema ALIMOP' : 'Crear Cuenta Multiusuario'}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Selector de Rol al Registrarse */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider block">Tipo de Usuario:</label>
            <div className="grid grid-cols-3 gap-2">
              {['cliente', 'proveedor', 'domiciliario'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRol(role)}
                  className={`py-2 rounded-xl font-bold border transition-premium text-center capitalize ${
                    rol === role ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Campos comunes */}
        {!isLogin && (
          <div className="relative">
            <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre Completo:</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleInputChange}
              placeholder="Ej. Mateo Delgado"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <User className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
          </div>
        )}

        <div className="relative">
          <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={isLogin ? "juan.gomez@gmail.com" : "tuemail@gmail.com"}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <Mail className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="relative">
          <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <Lock className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
        </div>

        {!isLogin && (
          <div className="relative">
            <label className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ej. 3187654321"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <Phone className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
          </div>
        )}

        {/* CAMPOS ESPECÍFICOS SEGÚN EL ROL SELECCIONADO (1:1 JERARQUÍA) */}
        {!isLogin && rol === 'cliente' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Perfil de Comprador</span>
            
            <div className="relative">
              <label className="font-bold text-slate-500 block mb-1">Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
              <Calendar className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <label className="font-bold text-slate-500 block mb-1">Preferencias Alimentarias:</label>
              <input
                type="text"
                name="preferencias_alimentarias"
                value={formData.preferencias_alimentarias}
                onChange={handleInputChange}
                placeholder="Ej. Panadería, Vegetariano, Lácteos"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
              <Heart className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        )}

        {!isLogin && rol === 'proveedor' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">Perfil de Establecimiento</span>
            
            <div className="relative">
              <label className="font-bold text-slate-500 block mb-1">NIT Comercial:</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleInputChange}
                placeholder="Ej. 900.883.111-9"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
              <FileText className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <label className="font-bold text-slate-500 block mb-1">Razón Social:</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleInputChange}
                placeholder="Ej. Panes y Tortas del Trigal S.A.S."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
              <Landmark className="absolute left-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Establecimiento:</label>
                <input
                  type="text"
                  name="nombre_establecimiento"
                  value={formData.nombre_establecimiento}
                  onChange={handleInputChange}
                  placeholder="Ej. El Trigal Cedritos"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Tipo de Comercio:</label>
                <select
                  name="tipo_establecimiento"
                  value={formData.tipo_establecimiento}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 focus:outline-none bg-white font-semibold"
                >
                  <option value="Supermercado">Supermercado</option>
                  <option value="Panaderia">Panadería</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Fruver">Fruver</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!isLogin && rol === 'domiciliario' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Perfil de Domiciliario</span>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Tipo de Vehículo:</label>
                <select
                  name="vehiculo_tipo"
                  value={formData.vehiculo_tipo}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 focus:outline-none bg-white"
                >
                  <option value="Bicicleta">Bicicleta</option>
                  <option value="Moto">Motocicleta</option>
                  <option value="Carro">Bicicleta Eléctrica</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Placa Vehículo:</label>
                <input
                  type="text"
                  name="vehiculo_placa"
                  value={formData.vehiculo_placa}
                  onChange={handleInputChange}
                  placeholder="Ej. ABC-123 (opcional)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-azul-cabecera hover:bg-blue-700 text-white font-bold tracking-wide transition-premium shadow-md text-sm mt-3"
        >
          {isLogin ? 'Conectarme con mi Cuenta' : 'Guardar y Finalizar Registro'}
        </button>

      </form>

      {/* Información del login de prueba */}
      {isLogin && (
        <div className="mt-6 pt-5 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-1">
          <p className="font-semibold text-slate-500 uppercase tracking-wider">Cuentas Semilla de Prueba:</p>
          <p>• Comprador: <span className="font-bold text-blue-600">juan.gomez@gmail.com</span> (Clave: Leo1406)</p>
          <p>• Proveedor: <span className="font-bold text-orange-600">carulla@carulla.com</span> (Clave: Leo1406)</p>
          <p>• Repartidor: <span className="font-bold text-indigo-600">moto@moto.com</span> (Clave: Leo1406)</p>
          <p>• Admin: <span className="font-bold text-red-600">admin@alimop.com</span> (Clave: Leo1406)</p>
        </div>
      )}

    </div>
  );
}
