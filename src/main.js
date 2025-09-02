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
    sidebarContainer.style.width = "20%";
    body.style.flexDirection = "row";
    main.style.backgroundColor = "#f0f2f5";
  } else if (role === '2') {
    sidebarContainer.style.height = "15%";
    sidebarContainer.style.width = "100%";
    body.style.flexDirection = "column";
    sidebarPath = './src/Components/headerUsuario.html';
    roleClass = 'sidebar-usuario';
    main.style.backgroundColor = "#f0f2f5";
  } else if (role === '1') {
    sidebarContainer.style.width = "20%";
    sidebarPath = './src/Components/Sidebar.html';
    roleClass = 'sidebar-admin';
    body.style.flexDirection = "row";
    main.style.backgroundColor = "#f0f2f5";
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
        sidebarContainer.style.display = "block";
        main.style.width = "80%";

        const cerrarSesion = document.getElementById("cerrar_sesion");
        if (cerrarSesion) {
          cerrarSesion.addEventListener("click", cerrarSesionHandler);
        }

        sidebarContainer.style.display = "block";
        main.style.width = "100%";
        main.style.backgroundColor = "rgb(188, 203, 241)"
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