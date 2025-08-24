import { Clientesbyid } from "../../../../Helpers/Modules/modules";
import { confirmacion } from "../../../../Helpers/alertas";

export default async () => {
  Clientesbyid()

  const cerrar_sesion = document.getElementById("btnCerrarSesion")

  cerrar_sesion.addEventListener("click", async () => {
    console.log("Click en cerrar sesión"); // Para verificar que llega aquí
    const confirmacionRespuesta = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionRespuesta.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home";
    }
  });
}