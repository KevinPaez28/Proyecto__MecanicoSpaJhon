import "../../../../Styles/Clientes/usuarioPrincipal.css";
import { post, get, del } from "../../../../Helpers/api";
import { confirmacion, success, error, eliminar } from "../../../../Helpers/alertas";
import { contarCamposFormulario, limpiar, validarMinimo } from "../../../../Helpers/Modules/modules";


export default async (parametros = null) => {
  // Recuperar el objeto que guardaste en localStorage
  const form = document.querySelector("#formVehiculo");
  const VehiculosPorId = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id = usuario.usuario_id;
    const usuarios = await get(`Usuarios`);
    const vehiculos = await get(`Vehiculos/usuarios/${id}`);
    const seccionInfo = document.querySelector(".interfazVehiculos__content");
    seccionInfo.innerHTML = "";

    vehiculos.data.forEach((element) => {
      const cards = document.createElement("div");
      cards.classList.add("interfazvehiculos__cards"); // ✅ Igual al admin

      const body = document.createElement("div");
      body.classList.add("interfazvehiculos__body");

      const infoWrapper = document.createElement("div");
      infoWrapper.classList.add("interfazvehiculos__info");

      const titulos = document.createElement("div");
      titulos.classList.add("interfazvehiculos__contentCards");

      const pMarca = document.createElement("p");
      pMarca.classList.add("interfazvehiculos__titulonombre");
      pMarca.textContent = "Marca:";
      titulos.appendChild(pMarca);

      const pPlaca = document.createElement("p");
      pPlaca.classList.add("interfazvehiculos__titulonombre");
      pPlaca.textContent = "Placa:";
      titulos.appendChild(pPlaca);

      const pModelo = document.createElement("p");
      pModelo.classList.add("interfazvehiculos__titulonombre");
      pModelo.textContent = "Modelo:";
      titulos.appendChild(pModelo);

      const pUsuario = document.createElement("p");
      pUsuario.classList.add("interfazvehiculos__titulonombre");
      pUsuario.textContent = "Usuario:";
      titulos.appendChild(pUsuario);

      const content = document.createElement("div");
      content.classList.add("interfazvehiculos__contentCard");

      const nombre = document.createElement("p");
      nombre.classList.add("interfazvehiculos__marca");
      nombre.textContent = element.marca;

      const placa = document.createElement("p");
      placa.classList.add("interfazvehiculos__placa");
      placa.textContent = element.placa;

      const modelo = document.createElement("p");
      modelo.classList.add("interfazvehiculos__modelo");
      modelo.textContent = element.modelo;

      const usuarioId = document.createElement("p");
      usuarioId.classList.add("interfazvehiculos__usuarioId");

      const usuariosFiltrados = usuarios.data.filter(
        (v) => v.usuario_id === element.usuario_id && v.rol_id === 2
      );

      usuarioId.textContent =
        usuariosFiltrados.length > 0
          ? usuariosFiltrados[0].nombre
          : "Sin usuario asignado";

      content.appendChild(nombre);
      content.appendChild(placa);
      content.appendChild(modelo);
      content.appendChild(usuarioId);

      // ✅ Usamos las mismas clases que en admin
      const botones = document.createElement("div");
      botones.classList.add("interfazvehiculos__button");

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("interfazvehiculos__buttones");
      btnEditar.textContent = "Editar";
      btnEditar.dataset.id = element.vehiculo_id;
      btnEditar.dataset.usuarioLogin =
        usuariosFiltrados.length > 0 ? usuariosFiltrados[0].usuario : "";

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("interfazvehiculos__buttones");
      btnEliminar.textContent = "Eliminar";

      botones.appendChild(btnEditar);
      botones.appendChild(btnEliminar);

      btnEliminar.addEventListener("click", () => {
        EliminarVehiculos(element.vehiculo_id)
      });

      btnEditar.addEventListener("click", () => {
        window.location.hash = "#/administrador/Vehiculos/editar";
      });

      infoWrapper.appendChild(titulos);
      infoWrapper.appendChild(content);
      body.appendChild(infoWrapper);
      body.appendChild(botones);
      cards.appendChild(body);
      seccionInfo.appendChild(cards);
    });

  };
  VehiculosPorId();

  const EliminarVehiculos = async (id) => {
    try {
      console.log(id);

      const confirm = await eliminar("¿Desea eliminar la información del Vehículo?");
      if (confirm.isConfirmed) {
        const respuesta = await del(`Vehiculos/${id}`);
        if (respuesta.ok) {
          const ok = await success({ message: "Vehiculo eliminado con éxito" });
          if (ok.isConfirmed) {
            // Aquí puedes hacer algo si quieres, por ejemplo recargar la lista
            VehiculosPorId();
          }
        } else {
          // Mostrar los errores si existen
          if (respuesta.errors.length > 0) {
            let mensajes = respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n");
            console.error("Errores al eliminar el vehiculo:", mensajes);
            await error("Errores al eliminar el vehiculo", mensajes);
          } else {
            // Mensaje general
            console.error("Error al eliminar el vehiculo:", respuesta.message);
            await error("Error al eliminar el vehiculo", respuesta.message || "No se pudo eliminar el vehiculo");
          }
        }
      }
    } catch (error) {
      console.error("Error inesperado al eliminar el vehículo:", error);
      await error("Error inesperado al eliminar");
    }
  };




}