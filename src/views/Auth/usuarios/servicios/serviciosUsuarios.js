import "../../../../Styles/Clientes/serviciosUsuarios.css";
import { informacionServicios } from "../../../../Helpers/Modules/modules";
import { get } from "../../../../Helpers/api";

export default async(parametros = null) =>{
const servicios = await get ("Servicios");
 informacionServicios(servicios)
}