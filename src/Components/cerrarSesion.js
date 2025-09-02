// src/Components/cerrarSesion.js
import { confirmacion } from "../Helpers/alertas.js";

// Función para manejar el cierre de sesión
export async function cerrarSesionHandler(e) {
  if (e) e.preventDefault();

  const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
  
  if (confirmacionCerrar.isConfirmed) {
    localStorage.clear();
    window.location.href = "#/Home";
  }
}

// Seleccionamos ambos botones correctamente
const botonCerrarDesktop = document.getElementById('cerrar_sesion');
const botonCerrarMobile = document.getElementById('cerrar_sesion_mobile');

// Asignamos el evento a ambos botones si existen
if (botonCerrarDesktop) {
  console.log("si da click");  
  botonCerrarDesktop.addEventListener('click', cerrarSesionHandler);
}

if (botonCerrarMobile) {
  console.log("si da click");  
  botonCerrarMobile.addEventListener('click', cerrarSesionHandler);
}
