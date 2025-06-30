import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/estilo.css';
import { registrarUsuario } from '../../utils/localAuth';


export default function Registro() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegistro = () => {
  setError('');

  if (!correo || !clave) {
    setError('Todos los campos son obligatorios');
    return;
  }

  if (!validarEmail(correo)) {
    setError('Correo inválido');
    return;
  }

  if (clave.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  const resultado = registrarUsuario(correo, clave);
  if (resultado.success) {
    alert(resultado.message);
    navigate('/');
  } else {
    setError(resultado.message);
  }
};


  return (
    <div className="contenedor">
      <div className="formulario">
        <h1>Registro</h1>

        <label>Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="boton-principal" onClick={handleRegistro}>
          Registrarse
        </button>

        <button className="boton-principal" onClick={() => navigate('/')}>
          Regresar
        </button>
      </div>
    </div>
  );
}
