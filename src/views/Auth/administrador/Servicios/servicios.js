import { get, post,del } from "../../../../Helpers/api";
import "../../../../Styles/Administrador/servicios.css";
import { error, confirmacion, success,eliminar } from "../../../../Helpers/alertas";
import { contarCamposFormulario, validarLetras, validarMinimo, limpiar, validarFormularioCompleto, tienePermiso } from "../../../../Helpers/Modules/modules";
import { cerrarSesionHandler } from "../../../../Components/cerrarSesion.js";

export default async (parametros = null) => {
  const MostrarServicios = async () => {
    const servicios = await get('Servicios');
    const contentServicios = document.querySelector(".servicios-listado")
    const header = document.querySelector(".interfazVehiculos__header")
    const content = document.querySelector(".interfaz-servicios")
    contentServicios.innerHTML = "";
    servicios.data.forEach(servicios => {
      const cards = document.createElement("div");
      cards.classList.add("listado__cardservicios");

      const body = document.createElement("div");
      body.classList.add("listado__bodyservicios");

      // Contenedor de la info
      const info = document.createElement("div");
      info.classList.add("listado__infoServicios");

      // ---- Nombre ----
      const Nombres = document.createElement("div");
      Nombres.classList.add("listado__tituloServicios");

      const pnombre_servicios = document.createElement("div");
      pnombre_servicios.classList.add("listado__pnombre_servicios");
      pnombre_servicios.textContent = "Nombre del Servicio";
      Nombres.appendChild(pnombre_servicios);

      const nombre = document.createElement("p");
      nombre.classList.add("listadoServicios__textinfo");
      nombre.textContent = servicios.nombre_servicio;
      Nombres.appendChild(nombre);

      // ---- Descripción ----
      const descripciongrupo = document.createElement("div");
      descripciongrupo.classList.add("listado__tituloServicios");

      const descripcion = document.createElement("div");
      descripcion.classList.add("listado__pnombre_servicios");
      descripcion.textContent = "Descripción";
      descripciongrupo.appendChild(descripcion);

      const descTexto = document.createElement("p");
      descTexto.classList.add("listadoServicios__textinfo");
      descTexto.textContent = servicios.descripcion;
      descripciongrupo.appendChild(descTexto);

      // ---- Precio ----
      const precios = document.createElement("div");
      precios.classList.add("listado__tituloServicios");

      const preciotitle = document.createElement("div");
      preciotitle.classList.add("listado__pnombre_servicios");
      preciotitle.textContent = "Precio";
      precios.appendChild(preciotitle);

      const precio = document.createElement("p");
      precio.classList.add("listadoServicios__textinfo");
      precio.textContent = parseInt(servicios.precio, 10);
      precios.appendChild(precio);

      // Añadimos bloques al contenedor de info
      info.appendChild(Nombres);
      info.appendChild(descripciongrupo);
      info.appendChild(precios);

      // ---- Botones ----
      const botones = document.createElement("div");
      botones.classList.add("interfazvehiculos__button");

      const btneditar = document.createElement("button");
      btneditar.classList.add("interfazvehiculos__buttones");
      btneditar.textContent = "Editar";
      botones.appendChild(btneditar);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("interfazvehiculos__buttones");
      btnEliminar.textContent = "Eliminar";
      botones.appendChild(btnEliminar);

      if (!tienePermiso("Servicios_Actualizar")) {
        botones.style.display = "none";        
        header.style.display = "none";
        content.style.height = "80vh";
      }
      

      btneditar.addEventListener("click", async => {
        localStorage.setItem("idServicioEditar", servicios.servicio_id);
        window.location.href = `#/Servicios/editar`;
      })
      btnEliminar.addEventListener("click", async => {
        eliminarServicio(btnEliminar, servicios.servicio_id);
      })
      // Armamos la tarjeta
      body.appendChild(info);
      body.appendChild(botones);
      cards.appendChild(body);
      contentServicios.appendChild(cards);
    });
  }
  if(tienePermiso("Servicios_Listar")){
    MostrarServicios()
  }


  const eliminarServicio = (btnEliminar, id) => {
    btnEliminar.addEventListener("click", async () => {
      try {
        const confirmacion = await eliminar("¿Desea eliminar este servicio?");
        if (confirmacion.isConfirmed) {
          const respuesta = await del(`Servicios/${id}`);
          if (respuesta.ok) {
            const ok = await success({ message: "Servicio eliminado con éxito" });
            if (ok.isConfirmed) MostrarServicios();
          } else {
            const mensajeError = respuesta?.data?.message || respuesta?.message || "No se pudo eliminar el servicio";
            await error(mensajeError);
          }
        }
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        await error("Error inesperado al eliminar");
      }
    });
  };

}