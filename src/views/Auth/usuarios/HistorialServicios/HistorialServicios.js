import { MostrarReparacionescliente } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Clientes/usuarioHistorial.css";
import { get } from "../../../../Helpers/api";

export default async () =>{
   let id = null;

  if (window.location.hash.includes("id=")) { 
    id = window.location.hash.split("id=")[1]; 
  }
  
  if (id) { 
    localStorage.setItem("cliente_id", id);
  } else {
    id = localStorage.getItem("cliente_id");
  }

  if (!id) { 
    console.error("No se encontró un ID de usuario.");
    return;
  }
  
  const reparaciones = await get(`Reparaciones/usuario/${id}`);
  
  const facturas = await get(`facturas/completa?usuario_id=${id}`)
  MostrarReparacionescliente(reparaciones,facturas);  
   
}