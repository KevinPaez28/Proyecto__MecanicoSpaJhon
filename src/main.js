import './style.css';
import { router } from './router/router';
import { cerrarSesionHandler } from './Components/cerrarSesion';

const main = document.querySelector('#app');
const sidebarContainer = document.querySelector('.sidebarContainer');
const body = document.querySelector('.bodyAdmin');

async function cargarSidebar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const role = usuario?.rol_id?.toString();
  let sidebarPath = '';
  let roleClass = '';

  if (role === '3') {
    sidebarPath = './src/Components/sidebarMecanico.html';
    roleClass = 'sidebar-mecanico';
    sidebarContainer.style.width = "25%";
    body.style.flexDirection = "row";
  } else if (role === '2') {
    sidebarContainer.style.height = "15%";
    sidebarContainer.style.width = "100%";
    body.style.flexDirection = "column";
    sidebarPath = './src/Components/headerUsuario.html';
    roleClass = 'sidebar-usuario';
  } else if (role === '1') {
    sidebarContainer.style.width = "20%";
    sidebarPath = './src/Components/Sidebar.html';
    roleClass = 'sidebar-admin';
    body.style.flexDirection = "row";
  }

  let sidebarHtml = '';
  if (sidebarPath) {
    try {
      const response = await fetch(sidebarPath);
      sidebarHtml = await response.text();
      sidebarHtml = `<div class="${roleClass}">${sidebarHtml}</div>`;
    } catch (e) {
      sidebarHtml = '';
    }
  }
  return sidebarHtml;
}

async function renderApp() {
  await router(main);
  const sidebarContainer = document.querySelector('.sidebarContainer');
  if (sidebarContainer) {
    const token = localStorage.getItem("token");
    const isHome = location.hash === "" || location.hash === "#/";

    if (!token || isHome) {
      sidebarContainer.style.display = "none";
      main.style.width = "100%";
    } else {
      const sidebarHtml = await cargarSidebar();
      
      if (sidebarHtml) {
        sidebarContainer.innerHTML = sidebarHtml;
        
        // ====== Lógica de Sidebar ======
        const sidebar = document.querySelector(".lateral, .panel_lateral"); // detecta cualquiera
        const toggleBtn = document.getElementById("sidebarToggle");

        if (sidebar && toggleBtn) {
          toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar--visible");
          });
        }
        
        // ====== Lógica del menú móvil ======
        const menuBtn = document.querySelector('.menu-toggle');
        const menu = document.querySelector('.headermenu');

        if (menuBtn && menu) {
          menuBtn.addEventListener('click', () => {
            menu.classList.toggle('menu--visible');
          });
        }
        
        // ====== Botón de cerrar sesión ======
        const cerrarSesion = document.getElementById("cerrar_sesion");
        if (cerrarSesion) {
          cerrarSesion.addEventListener("click", cerrarSesionHandler);
        }
        
        sidebarContainer.style.display = "block";
        main.style.width = "100%";
      } else {
        sidebarContainer.innerHTML = "";
        sidebarContainer.style.display = "none";
        main.style.width = "100%";
      }
    }
  }
}


window.addEventListener('hashchange', () => {
  renderApp();
});
window.addEventListener('DOMContentLoaded', renderApp);