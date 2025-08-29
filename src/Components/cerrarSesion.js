// src/Components/cerrarSesion.js
import { confirmacion } from "../Helpers/alertas.js";

export async function cerrarSesionHandler(e) {
    
  if (e) e.preventDefault();
  const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
  if (confirmacionCerrar.isConfirmed) {
    localStorage.clear();
    window.location.href = "#/Home";
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");

    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar--visible");
        });
    }
});