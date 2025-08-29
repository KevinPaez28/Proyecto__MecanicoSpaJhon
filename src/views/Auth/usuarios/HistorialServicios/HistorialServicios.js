import { MostrarReparacionescliente } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Clientes/usuarioHistorial.css";
import { get } from "../../../../Helpers/api";

export default async () => {
  // Recuperar objeto completo
  const clienteGuardado = JSON.parse(localStorage.getItem("usuario"));
  let id = null;
  // Validar que exista
  if (clienteGuardado) {
    id = clienteGuardado.usuario_id;
    console.log("El ID es:", id);
  } else {
    console.log("No hay cliente en el localStorage");
  }


  const reparaciones = await get(`Reparaciones/usuario/${id}`);

  const facturas = await get(`facturas/usuarioid/${id}`)
  MostrarReparacionescliente(reparaciones, facturas);

}