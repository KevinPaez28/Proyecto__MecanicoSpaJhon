import { get } from "../../../../Helpers/api";
import { ObtenerUsuariosNombreCedulaROl, TotalDeClientes, ObteneReparacionesadmin, fechaPlacaServicio, ProdcutosAgotados } from "../../../../Helpers/Modules/modules";
import { cerrarSesionHandler } from "../../../../Components/cerrarSesion.js";
import "../../../../Styles/Administrador/AdminPrincipal.css";


export default async (parametros = null) => {
  const Roles = await get('Roles');
  const Usuarios = await get('Usuarios')

  // const TotalUsuariosRegistrados = await get('Usuarios/buscar'); 
  ObtenerUsuariosNombreCedulaROl(Roles, Usuarios);
  ObteneReparacionesadmin()
  fechaPlacaServicio()
  ProdcutosAgotados()
  TotalDeClientes(Usuarios)
}