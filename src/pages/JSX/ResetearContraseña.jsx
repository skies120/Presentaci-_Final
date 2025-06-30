import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/estilo.css';
import { cambiarContraseña } from '../../utils/localAuth';


export default function ResetearContraseña() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleReset = () => {
  if (!correo) {
    setMensaje('Por favor ingresa tu correo electrónico');
    return;
  }

  // Para este ejemplo simple asignamos siempre '123456' como nueva contraseña
  const resultado = cambiarContraseña(correo, '123456');
  if (resultado.success) {
    setMensaje('Contraseña restablecida a "123456". Cambia al ingresar.');
    setTimeout(() => navigate('/'), 3000);
  } else {
    setMensaje(resultado.message);
  }
};

  return (
    <div className="contenedor">
      <div className="formulario">
        <h1>Recuperar Contraseña</h1>

        <label>Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        {mensaje && <p className="mensaje-verde">{mensaje}</p>}

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
