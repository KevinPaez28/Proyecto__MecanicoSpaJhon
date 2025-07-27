import "../../../../Styles/Clientes/usuarioPrincipal.css";
import { VehiculosPorId } from "../../../../Helpers/Modules/modules";
import { get } from "../../../../Helpers/api";

export default async(parametros = null) => {
    let id = null;

  if (window.location.hash.includes("id=")) { // verifica si hay id en la url
    id = window.location.hash.split("id=")[1]; // toma el primer valor despues de "id="
  }
  
  if (id) { //guarda el id si existe
    localStorage.setItem("usuarioid", id);
  } else {
    id = localStorage.getItem("usuarioid"); // trae el id guardado en localStorage
  }

  if (!id) { //valida si existe un id 
    console.error("No se encontró un ID de usuario.");
    return;
  }
  const usuarios = await get(`Usuarios`);
  const vehiculos = await get(`Vehiculos/usuarios?id_usuario=${id}`);

  VehiculosPorId(vehiculos, usuarios);
}