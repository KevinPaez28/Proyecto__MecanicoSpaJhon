import { get, post, del } from "../../../../Helpers/api";
import { contarCamposFormulario, limpiar, validarFormularioCompleto, validarLetras, validarMinimo } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Administrador/VehiculosAdmin.css";
import { confirmacion, success, error, eliminar } from "../../../../Helpers/alertas";
import { tienePermiso } from "../../../../Helpers/Modules/modules";

export default async (parametros = null) => {

  // Cargar datos iniciales
  const vehiculos = await get('Vehiculos');
  const usuarios = await get('Usuarios');
  const Vehiculos = (vehiculos, Usuarios) => {
    const seccionInfo = document.querySelector(".interfazVehiculos__content");
    seccionInfo.innerHTML = "";
    vehiculos.data.forEach((element) => {
      const cards = document.createElement("div");
      cards.classList.add("interfazvehiculos__cards");

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
      pUsuario.textContent = "Propietario:";
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

      const usuariosFiltrados = Usuarios.data.filter((usuario) => {
        const mismoUsuario = Number(usuario.usuario_id) === Number(element.usuario_id);
        const esRolCliente = Number(usuario.rol_id) === 2;
        return mismoUsuario && esRolCliente;
      });

      if (usuariosFiltrados.length > 0) {
        usuarioId.textContent = usuariosFiltrados[0].nombre; // Mostrar nombre completo
      } else {
        usuarioId.textContent = "Sin usuario asignado";
      }

      content.appendChild(nombre);
      content.appendChild(placa);
      content.appendChild(modelo);
      content.appendChild(usuarioId);

      // Crear contenedor de botones y colocarlo FUERA del contentCard
      const botones = document.createElement("div");
      botones.classList.add("interfazvehiculos__button");
      if (!tienePermiso("Vehiculos_Actualizar")) {
        botones.style.display = "none"; 
      }
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("interfazvehiculos__buttones");
      btnEditar.textContent = "Editar";
      btnEditar.dataset.id = element.vehiculo_id;
      // PASAMOS EL NOMBRE DE USUARIO LOGIN para el backend
      btnEditar.dataset.usuarioLogin = usuariosFiltrados.length > 0 ? usuariosFiltrados[0].usuario : "";

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("interfazvehiculos__buttones");
      btnEliminar.textContent = "Eliminar";

      botones.appendChild(btnEditar);
      botones.appendChild(btnEliminar);

      btnEliminar.addEventListener("click", () => {
        EliminarVehiculos(element.vehiculo_id);
      });

      btnEditar.addEventListener("click", () => {
        const idVehiculo = element.vehiculo_id;
        localStorage.setItem("idvehiculo", idVehiculo);
        window.location.hash = "#/Vehiculos/editar";
      });

      // Estructura final del card
      infoWrapper.appendChild(titulos);
      infoWrapper.appendChild(content);
      body.appendChild(infoWrapper);
      body.appendChild(botones); // Se agregan fuera del info
      cards.appendChild(body);
      seccionInfo.appendChild(cards);
    });
  };
  if(!tienePermiso("Vehiculos_Crear")){
    const header = document.querySelector(".interfazVehiculos__header")
    header.style.display = "none";
  }
  Vehiculos(vehiculos, usuarios);
  const EliminarVehiculos = async (id) => {
    try {
      const confirm = await eliminar("¿Desea eliminar la información del Vehículo?");
      if (confirm.isConfirmed) {
        const respuesta = await del(`Vehiculos/${id}`);
        if (respuesta.ok) {
          const ok = await success({ message: "Vehiculo eliminado con éxito" });
          if (ok.isConfirmed) {
            // Aquí puedes hacer algo si quieres, por ejemplo recargar la lista
            MostrarUsuarios();
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