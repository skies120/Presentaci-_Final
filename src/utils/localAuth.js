// src/utils/localAuth.js

// Clave única para guardar en localStorage
const STORAGE_KEY = "usuarios_app";

// Leer usuarios guardados
export function getUsuarios() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar usuarios en localStorage
export function saveUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

// Registrar usuario
export function registrarUsuario(correo, clave) {
  let usuarios = getUsuarios();
  
  // Verificar si ya existe
  if (usuarios.some(u => u.correo === correo)) {
    return { success: false, message: "El correo ya está registrado" };
  }

  usuarios.push({ correo, clave });
  saveUsuarios(usuarios);
  return { success: true, message: "Registro exitoso" };
}

// Validar login
export function loginUsuario(correo, clave) {
  // Administrador predefinido
  if (correo === 'grupo04@admin.com' && clave === 'admin123456') {
    return { success: true, message: "Inicio de sesión exitoso (Admin)" };
  }

  let usuarios = getUsuarios();
  const usuario = usuarios.find(u => u.correo === correo && u.clave === clave);
  if (usuario) {
    return { success: true, message: "Inicio de sesión exitoso" };
  } else {
    return { success: false, message: "Correo o contraseña incorrectos" };
  }
}
// Cambiar contraseña
export function cambiarContraseña(correo, nuevaClave) {
  let usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.correo === correo);
  if (index !== -1) {
    usuarios[index].clave = nuevaClave;
    saveUsuarios(usuarios);
    return { success: true, message: "Contraseña actualizada" };
  } else {
    return { success: false, message: "El correo no está registrado" };
  }
}

// Guarda el usuario en localStorage
export function guardarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

// Recupera el usuario desde localStorage
export function obtenerUsuario() {
  return JSON.parse(localStorage.getItem('usuario'));
}

// Elimina el usuario (logout)
export function cerrarSesion() {
  localStorage.removeItem('usuario');
}
