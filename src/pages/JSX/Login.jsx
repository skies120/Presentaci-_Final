import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase';
import '../CSS/estilo.css';
import googleLogo from '../../Imagenes/Google.png';
import githubLogo from '../../Imagenes/Github.png';
import logo from '../../Imagenes/Logo.png';
import { loginUsuario } from '../../utils/localAuth';


export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');


const handleLoginManual = () => {
  if (!correo || !clave) {
    setError('Todos los campos son obligatorios');
    return;
  }

  const resultado = loginUsuario(correo, clave);
  if (resultado.success) {
    alert(resultado.message);
    if (correo === 'grupo04@admin.com' && clave === 'admin123456') {
      navigate('/admin');
    } else {
      navigate('/menu');
    }
  } else {
    setError(resultado.message);
  }
};

const [verClave, setVerClave] = useState(false);

  const handleLoginRedSocial = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Bienvenido, ${user.displayName || user.email}`);
    
    if (user.email === 'grupo04@admin.com') {
      navigate('/adminpage');
    } else {
      navigate('/menu');
    }

  } catch (err) {
    console.error("Error en login social:", err);
    alert("Error al iniciar sesión");
  }
};



  return (
    
    <div className="contenedor">
      
      
      <div className="formulario">
        <img src={logo} alt="Logo" className="logo" />

        <h2>Iniciar Sesión</h2>

        <button className="boton-red" onClick={() => handleLoginRedSocial(googleProvider)}>
          <img src={googleLogo} alt="Google" className="icono-red" />
          Iniciar con Google
        </button>

        <button className="boton-red" onClick={() => handleLoginRedSocial(githubProvider)}>
          <img src={githubLogo} alt="GitHub" className="icono-red" />
          Iniciar con GitHub
        </button>

        <h3>O</h3>

        <label>Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type={verClave ? 'text' : 'password'}
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="input-clave"
        />
        <br/>
        <div className="icono-ojo-abajo" onClick={() => setVerClave(!verClave)}>
          <i className={verClave ? 'bx bx-low-vision' : 'bx bx-show'}></i>
        </div>



        {error && <p style={{ color: 'red' }}>{error}</p>}
        <br/>
        <br/>

        <button className="boton-principal" onClick={handleLoginManual}>
          Iniciar sesión
        </button>
        <button className="boton-principal" onClick={() => navigate('/registro')}>
          Registrarse
        </button>
        <br/>
        <p className="enlace" onClick={() => navigate('/resetear')}>
          ¿Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  );
}
