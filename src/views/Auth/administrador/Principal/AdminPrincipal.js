import { get } from "../../../../Helpers/api";
import { ObtenerUsuariosNombreCedulaROl,TotalDeClientes,ObteneReparacionesadmin,fechaPlacaServicio } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Administrador/AdminPrincipal.css";


export default async (parametros = null) =>{
  const Roles = await get('Roles'); 
  const Usuarios = await get('Usuarios')
  const TotalUsuariosRegistrados = await get('Usuarios/buscar'); 
  ObtenerUsuariosNombreCedulaROl(Roles, TotalUsuariosRegistrados);
  ObteneReparacionesadmin()
  fechaPlacaServicio()
  TotalDeClientes(Usuarios)

  const cerrarSesion = document.getElementById("cerrar_sesion");
   cerrarSesion.addEventListener("click", async (e) => {
     e.preventDefault(); // Evita que redireccione inmediatamente
     const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
     if (confirmacionCerrar.isConfirmed) {
       // Si necesitas limpiar datos de sesión
       // localStorage.clear();
       window.location.href = "#/Home"; 
     }
   });
}