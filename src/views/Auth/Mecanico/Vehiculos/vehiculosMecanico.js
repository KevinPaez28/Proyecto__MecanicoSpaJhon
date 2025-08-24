import "../../../../Styles/Mecanico/vehiculosMecanico.css"
import { get ,post} from "../../../../Helpers/api";
import { confirmacion,success,error  } from "../../../../Helpers/alertas";
import { mostrarVehiculosMecanico } from "../../../../Helpers/Modules/modules";

export default async () =>{
     const vehiculos = await get('Vehiculos');
  const usuarios = await get('Usuarios');
    mostrarVehiculosMecanico(vehiculos,usuarios)
    const cerrar_sesion = document.getElementById("btnCerrarSesion")
  cerrar_sesion.addEventListener("click", async () => {
      const confirmacionRespuesta = await confirmacion("¿Desea cerrar sesión?");
      if (confirmacionRespuesta.isConfirmed) {
        localStorage.clear();
        window.location.href = "#/Home";
      }
    });
}