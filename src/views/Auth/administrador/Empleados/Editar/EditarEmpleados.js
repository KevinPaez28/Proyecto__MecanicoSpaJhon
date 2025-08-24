// import { confirmacion, success, error } from "../../../../../Helpers/Modules/modules.js";
import { get, put } from "../../../../../Helpers/api.js";

export const EditarEmpleados = (tdNombre, tdCedula, tdTelefono, tdUsuario, tdRol, tdEstado, btnEditar, Roles) => {
  // Crear inputs dinámicos
  const inputNombre = document.createElement("input");
  inputNombre.classList.add("empleadosContent__input");
  inputNombre.value = tdNombre.textContent;

  const inputCedula = document.createElement("input");
  inputCedula.classList.add("empleadosContent__input");
  inputCedula.value = tdCedula.textContent;

  const inputTelefono = document.createElement("input");
  inputTelefono.classList.add("empleadosContent__input");
  inputTelefono.value = tdTelefono.textContent;

  const inputUsuario = document.createElement("input");
  inputUsuario.classList.add("empleadosContent__input");
  inputUsuario.value = tdUsuario.textContent;

  // Select Roles
  const selectRol = document.createElement("select");
  selectRol.classList.add("empleadosContent__input");
  Roles.forEach(r => {
    const option = document.createElement("option");
    option.value = r.rol_id;
    option.textContent = r.nombre;
    if (r.rol_id === parseInt(tdRol.dataset.rolId)) {
      option.selected = true;
    }
    selectRol.appendChild(option);
  });

  // Select Estado
  const selectEstado = document.createElement("select");
  selectEstado.classList.add("empleadosContent__input");

  const optionActivo = document.createElement("option");
  optionActivo.value = "1";
  optionActivo.textContent = "Activo";
  if (tdEstado.dataset.estadoId === "1") optionActivo.selected = true;

  const optionInactivo = document.createElement("option");
  optionInactivo.value = "0";
  optionInactivo.textContent = "Inactivo";
  if (tdEstado.dataset.estadoId === "0") optionInactivo.selected = true;

  selectEstado.appendChild(optionActivo);
  selectEstado.appendChild(optionInactivo);

  // Reemplazar contenido de la celda
  tdNombre.textContent = "";
  tdCedula.textContent = "";
  tdTelefono.textContent = "";
  tdUsuario.textContent = "";
  tdRol.textContent = "";
  tdEstado.textContent = "";

  tdNombre.appendChild(inputNombre);
  tdCedula.appendChild(inputCedula);
  tdTelefono.appendChild(inputTelefono);
  tdUsuario.appendChild(inputUsuario);
  tdRol.appendChild(selectRol);
  tdEstado.appendChild(selectEstado);

  // Cambiar botón a "Guardar"
  btnEditar.textContent = "Guardar";

  btnEditar.addEventListener("click", async () => {
    const nuevoUsuario = {
      nombre: inputNombre.value.trim(),
      cedula: inputCedula.value.trim(),
      telefono: inputTelefono.value.trim(),
      usuario: inputUsuario.value.trim(),
      rol_id: parseInt(selectRol.value),
      estado_usuario_id: parseInt(selectEstado.value),
    };

    try {
      const confirmacion = await confirm("¿Desea actualizar este usuario?");
      if (confirmacion.isConfirmed) {
        const respuesta = await put(`Usuarios/${btnEditar.dataset.id}`, nuevoUsuario);

        if (respuesta.ok) {
          if ((await success({ message: "Usuario actualizado con éxito" })).isConfirmed) {
            location.reload();
          }
        } else {
          await error(respuesta.data?.error || "Error al actualizar usuario");
          location.reload();
        }
      }
    } catch (err) {
      console.error("Error:", err);
      await error("Error inesperado al actualizar usuario");
    }
  });
};
