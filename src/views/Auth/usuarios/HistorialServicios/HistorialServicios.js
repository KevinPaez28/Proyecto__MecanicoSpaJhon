import { MostrarReparacionescliente } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Clientes/usuarioHistorial.css";
import { get } from "../../../../Helpers/api";

export default async () =>{
   let id = null;

  if (window.location.hash.includes("id=")) { 
    id = window.location.hash.split("id=")[1]; 
  }
  
  if (id) { 
    localStorage.setItem("usuarioid", id);
  } else {
    id = localStorage.getItem("usuarioid");
  }

  if (!id) { 
    console.error("No se encontró un ID de usuario.");
    return;
  }
  console.log(localStorage);
  
  const reparaciones = await get(`Reparaciones/usuario/${id}`);
  
  const facturas = await get(`facturas/completa/${id}`)
  MostrarReparacionescliente(reparaciones,facturas);  
   
}