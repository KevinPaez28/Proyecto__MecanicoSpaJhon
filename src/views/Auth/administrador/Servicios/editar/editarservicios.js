


import { get, put } from "../../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../../Helpers/alertas.js";

export default async (parametros = null) => {
  const id = localStorage.getItem("idServicioEditar");
  if (!id) return;
  const contentServicios = document.querySelector(".servicios-listado");
  if (!contentServicios) return;

  // Obtener datos del servicio desde el backend
  const respuesta = await get(`Servicios/${id}`);
  const servicio = respuesta?.data;
  if (!servicio) return;

  // Card editable
  const card = document.createElement("div");
  card.classList.add("listado__cardservicios");

  const body = document.createElement("div");
  body.classList.add("listado__bodyservicios");

  // Info
  const info = document.createElement("div");
  info.classList.add("listado__infoServicios");

  // Nombre
  const nombreGrupo = document.createElement("div");
  nombreGrupo.classList.add("listado__tituloServicios");
  const nombreLabel = document.createElement("div");
  nombreLabel.classList.add("listado__pnombre_servicios");
  nombreLabel.textContent = "Nombre del Servicio";
  nombreGrupo.appendChild(nombreLabel);
  const inputNombre = document.createElement("input");
  inputNombre.classList.add("listadoServicios__textinfo", "servicios-input", "Servicios__input");
  inputNombre.value = servicio.nombre_servicio || "";
  nombreGrupo.appendChild(inputNombre);

  // Descripción
  const descGrupo = document.createElement("div");
  descGrupo.classList.add("listado__tituloServicios");
  const descLabel = document.createElement("div");
  descLabel.classList.add("listado__pnombre_servicios");
  descLabel.textContent = "Descripción";
  descGrupo.appendChild(descLabel);
  const inputDesc = document.createElement("input");
  inputDesc.classList.add("listadoServicios__textinfo", "servicios-input", "Servicios__input");
  inputDesc.value = servicio.descripcion || "";
  descGrupo.appendChild(inputDesc);

  // Precio
  const precioGrupo = document.createElement("div");
  precioGrupo.classList.add("listado__tituloServicios");
  const precioLabel = document.createElement("div");
  precioLabel.classList.add("listado__pnombre_servicios");
  precioLabel.textContent = "Precio";
  precioGrupo.appendChild(precioLabel);
  const inputPrecio = document.createElement("input");
  inputPrecio.classList.add("listadoServicios__textinfo", "servicios-input", "Servicios__input");
  inputPrecio.type = "number";
  inputPrecio.value = parseInt(servicio.precio, 10);
  precioGrupo.appendChild(inputPrecio);

  // Añadir bloques al contenedor de info
  info.appendChild(nombreGrupo);
  info.appendChild(descGrupo);
  info.appendChild(precioGrupo);

  // Botón guardar
  const botones = document.createElement("div");
  botones.classList.add("listadoServicios__button");
  const btnGuardar = document.createElement("button");
  btnGuardar.classList.add("listadoServicios__buttones");
  btnGuardar.textContent = "Guardar";
  botones.appendChild(btnGuardar);

  btnGuardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nuevoServicio = {
      nombre_servicio: inputNombre.value.trim(),
      descripcion: inputDesc.value.trim(),
      precio: inputPrecio.value.trim()
    };
    try {
      const confirmacion = await confirm("¿Actualizar el servicio?");
      if (confirmacion.isConfirmed) {
        const respuesta = await put(`Servicios/${id}`, nuevoServicio);
        if (respuesta.ok) {
          const ok = await success({ message: "Servicio actualizado con éxito" });
          if (ok.isConfirmed)
            window.location.href = "#/Servicios";
        } else {
          await error("No se pudo actualizar el servicio");
        }
      }
    } catch (error) {
      console.error("Error al actualizar el servicio:", nuevoServicio);
      await error("Error inesperado al actualizar");
    }
  });

  // Armamos la tarjeta
  body.appendChild(info);
  body.appendChild(botones);
  card.appendChild(body);
  contentServicios.insertBefore(card, contentServicios.firstChild);
};
