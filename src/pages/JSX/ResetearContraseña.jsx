import React, { useState } from 'react';
// Importa React y el hook useState para manejar estados

import { useNavigate } from 'react-router-dom';
// Importa useNavigate para redireccionar a otras rutas

import '../CSS/estilo.css';
// Estilos generales para mantener la consistencia visual

import { cambiarContraseña } from '../../utils/localAuth';
// Función que definiste en localAuth para cambiar la contraseña en tu "base de datos" localStorage


export default function ResetearContraseña() {
  const navigate = useNavigate(); // Para redireccionar después del proceso

  // Estados locales
  const [correo, setCorreo] = useState(''); // Guarda el correo que el usuario escribe
  const [mensaje, setMensaje] = useState(''); // Mensajes informativos para el usuario

  // Función para manejar el clic en "Enviar enlace"
  const handleReset = () => {
    if (!correo) {
      setMensaje('Por favor ingresa tu correo electrónico');
      return;
    }

    // En este ejemplo simple, siempre resetea a '123456'
    const resultado = cambiarContraseña(correo, '123456');
    if (resultado.success) {
      setMensaje('Contraseña restablecida a "123456". Cambia al ingresar.');
      // Después de 3 segundos, vuelve a la pantalla de login
      setTimeout(() => navigate('/'), 3000);
    } else {
      setMensaje(resultado.message); // Si el usuario no existe
    }
  };

  return (
    <div className="contenedor">
      <div className="formulario">
        <h1>Recuperar Contraseña</h1>

        {/* Input para el correo */}
        <label>Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        {/* Mensaje informativo o de error */}
        {mensaje && <p className="mensaje-verde">{mensaje}</p>}

        {/* Botones de acción */}
        <div className="fila-botones">
          <button className="boton-principal" onClick={() => navigate('/')}>
            Regresar
          </button>
          <button className="boton-principal" onClick={handleReset}>
            Enviar enlace
          </button>
        </div>
      </div>
    </div>
  );
}
