import { get, put } from "../../../../Helpers/api.js";
import { confirm, error, success, eliminar } from "../../../../Helpers/alertas.js";
import "../../../../Styles/Administrador/registerEmpleado.css";
import { tienePermiso } from "../../../../Helpers/Modules/modules.js";

export default async (parametros = null) => {

  const MostrarUsuarios = async () => {
    const tbody = document.querySelector(".tabla-usuarios tbody");
    if (!tbody) return; // Si no existe la tabla, salir
    tbody.innerHTML = ""; // Limpiar filas previas

    // Obtener datos
    const usuarios = await get("Usuarios");
    const Roles = await get("Roles");

    usuarios.data.forEach(usuario => {
      const tr = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.textContent = usuario.nombre;

      const tdCedula = document.createElement("td");
      tdCedula.textContent = usuario.cedula;

      const tdTelefono = document.createElement("td");
      tdTelefono.textContent = usuario.telefono;

      const tdUsuario = document.createElement("td");
      tdUsuario.textContent = usuario.usuario;

      const tdRol = document.createElement("td");
      const rolEncontrado = Roles.data.find(r => r.rol_id == usuario.rol_id);
      tdRol.textContent = rolEncontrado.nombre_rol;
      tdRol.dataset.rolId = usuario.rol_id;

      const tdEstado = document.createElement("td");
      tdEstado.textContent = usuario.id_estado === 1 ? "Activo" : "Inactivo";
      tdEstado.dataset.estadoId = usuario.id_estado;

      const tdAcciones = document.createElement("td");

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.classList.add("interfazvehiculos__buttones");

      btnEditar.dataset.id = usuario.usuario_id;
      if (tienePermiso("Usuarios_Actualizar")) {
        btnEditar.addEventListener("click", (e) => {
          e.preventDefault();
          const idEmpleado = usuario.usuario_id;
          localStorage.setItem("idEmpleadoEditar", idEmpleado);
          window.location.hash = "#/Empleados/editar";
        });
      }
      const btnEliminar = document.createElement("button");
      const div = document.createElement("div");
      div.classList.add("interfazVehiculos__title");
      ;
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("interfazvehiculos__buttones");
      if (tienePermiso("Usuarios_Eliminar")) {
        btnEliminar.addEventListener("click", () => {
          const idEmpleado = usuario.usuario_id;
          localStorage.setItem("idEmpleadoEditar", idEmpleado);
          eliminarUsuarioPorId();
        });
      }
      // Metemos los botones dentro del div
      div.append(btnEditar, btnEliminar);

      // Metemos el div dentro del tdAcciones
      tdAcciones.appendChild(div);

      // Finalmente agregamos todo al tr
      tr.append(tdNombre, tdCedula, tdTelefono, tdUsuario, tdRol, tdEstado, tdAcciones);
      tbody.appendChild(tr);
    });
  };
  const eliminarUsuarioPorId = async () => {
    const id = localStorage.getItem("idEmpleadoEditar");
    try {
      const confirm = await eliminar("¿Deseas desactivar el usuario?");
      if (confirm.isConfirmed) {
        const respuesta = await put(`Usuarios/desactivar/${id}`);

        if (respuesta.ok) {
          const ok = await success({ message: "Usuario desactivado con éxito" });
          if (ok.isConfirmed) {
            // Aquí puedes hacer algo si quieres, por ejemplo recargar la lista
            MostrarUsuarios();
          }
        } else {
          // Mostrar los errores si existen
          if (respuesta.errors.length > 0) {
            let mensajes = respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n");
            console.error("Errores al desactivar el usuario:", mensajes);
            await error("Errores al desactivar usuario", mensajes);
          } else {
            // Mensaje general
            console.error("Error al desactivar el usuario:", respuesta.message);
            await error("Error al desactivar usuario", respuesta.message || "No se pudo desactivar el usuario");
          }
        }
      }
    } catch (error) {
      console.error("Error inesperado al desactivar el usuario:", error);
      await error("Error inesperado al desactivar");
    }
  };
  if (!tienePermiso("Usuarios_Listar")) {
  }
  MostrarUsuarios();
};