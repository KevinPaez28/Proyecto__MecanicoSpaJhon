import { get } from "../../../../Helpers/api";
import { ObtenerUsuariosNombreCedulaROl,TotalDeClientes,ObteneReparacionesadmin,fechaPlacaServicio, ProdcutosAgotados } from "../../../../Helpers/Modules/modules";
import { confirmacion } from "../../../../Helpers/alertas";
import "../../../../Styles/Administrador/AdminPrincipal.css";


export default async (parametros = null) =>{
  const Roles = await get('Roles'); 
  const Usuarios = await get('Usuarios')
  
  // const TotalUsuariosRegistrados = await get('Usuarios/buscar'); 
  ObtenerUsuariosNombreCedulaROl(Roles, Usuarios);
  ObteneReparacionesadmin()
  fechaPlacaServicio()
  ProdcutosAgotados()
  TotalDeClientes(Usuarios)

 const cerrarSesion = document.getElementById("cerrar_sesion");
  cerrarSesion.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita que redireccione inmediatamente
    const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionCerrar.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home"; 
    }
  });
}