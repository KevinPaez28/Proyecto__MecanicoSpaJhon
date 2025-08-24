import { get } from "../../../../Helpers/api.js";
// import "../../../../Styles/Administrador/registerEmpleado.css";
import EditarEmpleados from "./Editar/EditarEmpleados.js";
export default async () => {
  // const dialogo = document.getElementById("EliminarUsuario");
  // const btnEliminarUsuarios = document.getElementById("Eliminar");
  // const cerrar = document.getElementById("cerrarDialogo");

  // btnEliminarUsuarios.addEventListener("click", () => {
  //   ModificarUsuarios(usuarios, roles);
  //   dialogo.showModal();
  // });

  // cerrar.addEventListener("click", () => {
  //   dialogo.close();
  // });

  const MostrarUsuarios = async () => {
    const tbody = document.querySelector(".tabla-usuarios tbody");
    if (!tbody) return; // Si no existe la tabla, salir
    tbody.innerHTML = ""; // Limpiar filas previas

    // Obtener datos
    const usuarios = await get("Usuarios");
    const Roles = await get("Roles");

    usuarios.forEach(usuario => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.usuario}</td>
            <td>${Roles.find(r => r.rol_id === usuario.rol_id)?.nombre || "Desconocido"}</td>
            <td>${usuario.estado_usuario_id === 1 ? "Activo" : "Inactivo"}</td>
            <td>
                <button class="btn-modificar">Editar</button>
                <button class="btn-Eliminar">Eliminar</button>
            </td>
        `;

      // Eventos de botones
      tr.querySelector(".btn-Eliminar").addEventListener("click", () => {
        EditarEmpleados(tdNombre, tdCedula, tdTelefono, tdUsuario, tdRol, tdEstado, btnEditar, Roles); // tu función existente
      });

      tr.querySelector(".btn-modificar").addEventListener("click", () => {
        editarUsuarios(usuario); // tu función existente
      });

      tbody.appendChild(tr);
    });
  };
  MostrarUsuarios()
}