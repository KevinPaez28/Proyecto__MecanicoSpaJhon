// src/Components/cerrarSesion.js
import { confirmacion } from "../Helpers/alertas.js";

// Exportamos la función de cierre de sesión para que pueda ser utilizada en otros módulos
export async function cerrarSesionHandler(e) {
  if (e) e.preventDefault();
  const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
  if (confirmacionCerrar.isConfirmed) {
    localStorage.clear();
    window.location.href = "#/Home";
  }
}

// Función principal que contiene toda la lógica de eventos y manipulación del DOM
// Se ejecuta solo cuando el documento HTML está completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // Lógica para el sidebar
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar--visible");
    });
  }

  // Lógica para el menú móvil del header
  const menuBtn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.headermenu');

  if (menuBtn && menu) {
    // Al hacer clic, se alterna la clase 'menu--visible'
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('menu--visible');
    });
  }

  // Lógica para el botón de cerrar sesión
  const cerrarSesionBtn = document.getElementById("cerrar_sesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", cerrarSesionHandler);
  }

  // Función para ocultar/mostrar el botón del menú en base al tamaño de la pantalla
  function handleMenuButtonDisplay() {
    // Es importante volver a buscar los elementos aquí si la estructura HTML cambia
    // aunque en este caso ya lo hicimos arriba
    const currentMenuBtn = document.querySelector('.menu-toggle');
    const currentMenu = document.querySelector('.headermenu');
    
    if (currentMenuBtn && currentMenu) {
      if (window.innerWidth <= 900) {
        currentMenuBtn.style.display = 'block';
      } else {
        currentMenuBtn.style.display = 'none';
        currentMenu.classList.remove('menu--visible'); // Cierra el menú en escritorio
      }
    }
  }

  // Ejecutamos la función al cargar la página y cuando la ventana cambie de tamaño
  handleMenuButtonDisplay();
  window.addEventListener('resize', handleMenuButtonDisplay);
});