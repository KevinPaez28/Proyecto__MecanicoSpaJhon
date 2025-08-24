import './style.css';
import { router } from './router/router';

const main = document.querySelector('#app');

async function cargarSidebar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const role = usuario?.rol_id?.toString();
  let sidebarPath = '';

  if (role === '4') {
    sidebarPath = './src/Components/sidebarMecanico.html';
  } else if (role === '2') {
    sidebarPath = './src/Components/headerUsuario.html';
  } else if (role === '1') {
    sidebarPath = './src/Components/Sidebar.html';
  }

  let sidebarHtml = '';
  if (sidebarPath) {
    try {
      const response = await fetch(sidebarPath);
      sidebarHtml = await response.text();
    } catch (e) {
      sidebarHtml = '';
    }
  }
  return sidebarHtml;
}

// async function Cargarform() {
//   const hash = location.hash;

//   const ruta = hash.slice(1).split('/')
//   let content = "";
//   console.log(ruta);

//   if (ruta[2] == "Empleados" || ruta[1] == "Signup") {
//     content = './src/Components/formularioUsuarios.html';
//   }
//   let formularioUsuario = "";
//   if (content) {
//     try {
//       const response = await fetch(content);
//       formularioUsuario = await response.text();
//     } catch (error) {
//       formularioUsuario = "";
//     }
//   }
//   return formularioUsuario;
// }

async function renderApp() {
  await router(main);
  const sidebarContainer = document.querySelector('.sidebarContainer');
  // const form = document.querySelector('.loginmecanico__login')
  // const formulario = await Cargarform();
  // if (form) {
  //   form.innerHTML = formulario;
  // }
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
