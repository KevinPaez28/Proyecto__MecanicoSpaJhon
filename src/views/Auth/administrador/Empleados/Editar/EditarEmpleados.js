import { get, put } from "../../../../../Helpers/api.js";
import { confirm, error, success } from "../../../../../Helpers/alertas.js";
import "../../../../../Styles/Administrador/registerEmpleado.css";
import { tienePermiso } from "../../../../../Helpers/Modules/modules.js";

export default async (parametros = null) => {
    const editarUsuario = async () => {
        const tbody = document.querySelector(".tabla-usuarios tbody");
        const id = localStorage.getItem("idEmpleadoEditar");
        if (!tbody) return; // Si no existe la tabla, salir
        // Obtener datos
        const usuarios = await get(`Usuarios/${id}`);
        console.log(usuarios.data.id_estado);
        const Roles = await get("Roles");
        const tr = document.createElement("tr");

        // Nombre
        const tdNombre = document.createElement("td");
        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.value = usuarios.data.nombre;
        tdNombre.appendChild(inputNombre);

        // Cédula
        const tdCedula = document.createElement("td");
        const inputCedula = document.createElement("input");
        inputCedula.type = "text";
        inputCedula.value = usuarios.data.cedula;
        tdCedula.appendChild(inputCedula);

        // Teléfono
        const tdTelefono = document.createElement("td");
        const inputTelefono = document.createElement("input");
        inputTelefono.type = "text";
        inputTelefono.value = usuarios.data.telefono;
        tdTelefono.appendChild(inputTelefono);

        // Usuario
        const tdUsuario = document.createElement("td");
        const inputUsuario = document.createElement("input");
        inputUsuario.type = "text";
        inputUsuario.value = usuarios.data.usuario;
        tdUsuario.appendChild(inputUsuario);

        // Rol
        const tdRol = document.createElement("td");
        const selectRol = document.createElement("select");
        Roles.data.forEach(r => {
            const option = document.createElement("option");
            option.value = r.rol_id;
            option.textContent = r.nombre_rol;
            if (r.rol_id === usuarios.data.rol_id) option.selected = true;
            selectRol.appendChild(option);
        });

        tdRol.appendChild(selectRol);
        tdRol.dataset.rolId = usuarios.data.rol_id;

        const tdEstado = document.createElement("td");
        const selectEstado = document.createElement("select");
        selectEstado.classList.add("empleadosContent__input");

        // Crear opciones para ambos estados
        const optionActivo = document.createElement("option");
        optionActivo.value = 1;
        optionActivo.textContent = "Activo";

        const optionInactivo = document.createElement("option");
        optionInactivo.value = 2;
        optionInactivo.textContent = "Inactivo";

        // Seleccionar según el estado actual
        if (usuarios.data.id_estado === 1) {
            optionActivo.selected = true;
        } else {
            optionInactivo.selected = true;
        }

        selectEstado.appendChild(optionActivo);
        selectEstado.appendChild(optionInactivo);
        tdEstado.appendChild(selectEstado);
        // Acciones
        const tdAcciones = document.createElement("td");
        const btnGuardar = document.createElement("button");
        btnGuardar.textContent = "Guardar";
        btnGuardar.classList.add("btn-modificar");
        btnGuardar.dataset.id = usuarios.data.usuario_id;

        // Aquí puedes agregar el evento de guardado
        btnGuardar.addEventListener("click", async () => {
            const id = localStorage.getItem("idEmpleadoEditar");
            // Ejemplo de lectura de valores
            const nuevoUsuario = {
                nombre: inputNombre.value,
                cedula: inputCedula.value,
                telefono: inputTelefono.value,
                usuario: inputUsuario.value,
                rol_id: parseInt(selectRol.value),
                id_estado: parseInt(selectEstado.value)
            };
            try {
                const confirmacion = await confirm("¿Desea actualizar este usuario?");
                if (confirmacion.isConfirmed) {
                    const respuesta = await put(`Usuarios/${id}`, nuevoUsuario);

                    if (respuesta.ok) {
                        if ((await success({ message: "Usuario actualizado con éxito" })).isConfirmed) {
                            window.location.href = "#/Empleados";
                        }
                    } else {
                        // Mostrar errores de validación si existen
                        if (respuesta.errors.length > 0) {
                            let mensajes = respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n");
                            await error("Errores de validación", mensajes);
                        } else {
                            await error("Error al actualizar usuario", respuesta.message || "Error desconocido");
                        }
                    }
                }
            } catch (err) {
                console.error("Error:", err);
            }
        });

        tdAcciones.appendChild(btnGuardar);

        tr.append(tdNombre, tdCedula, tdTelefono, tdUsuario, tdRol, tdEstado, tdAcciones);
        tbody.appendChild(tr);

    }

    editarUsuario()

};

