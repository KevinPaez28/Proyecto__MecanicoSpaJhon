import { get, post } from "../../../../../Helpers/api";
import { contarCamposFormulario, validar, validarCorreo, validarMinimo, validarCedula, validarContrasenia, validarLetras, validarNumeros, validarMaximo, limpiar } from "../../../../../Helpers/Modules/modules";
import { confirmacion, success, error } from "../../../../../Helpers/alertas.js";
import "../../../../../Components/formularioUsuarios.css"
import "../../../../../Components/botonesadmin.css"
import "../../../../../Styles/Administrador/registerEmpleado.css"
export default async (parametros = null) => {
    const select = document.querySelector("select")
    const usuarios = await get('Usuarios');
    const roles = await get('Roles');
    roles.data.forEach(element => {
        console.log(element)
        const option = document.createElement('option');
        option.setAttribute('value', element.rol_id);
        option.textContent = element.nombre_rol;
        select.append(option);
    });

    const cedula = document.querySelector("#cedula")
    const nombre = document.querySelector("#nombre")
    const correo = document.querySelector("#correo")
    const telefono = document.querySelector("#telefono")
    const contraseña = document.querySelector("#contrasena")

    const nuevoUsuario = async (event) => {
        event.preventDefault();

        const datos = validar(event);

        if (Object.keys(datos).length === cantidadCampos) {
            datos['rol_id'] = Number(datos['rol']);
            delete datos['rol'];

            datos['cedula'] = datos['cedula'].trim();
            datos['telefono'] = datos['telefono'].trim();
            datos['nombre'] = datos['nombre'].trim();
            datos['correo'] = datos['correo'].trim();
            datos['usuario'] = datos['usuario'].trim();
            datos['contrasena'] = datos['contrasena'].trim();
            datos['id_estado'] = 1
            console.log(datos)
            const respuesta = await post('Usuarios', datos);
            const confirm = await confirmacion("¿Desea Crear el usuario?");
            if (confirm.isConfirmed) {
                if (respuesta.ok) {
                    if ((await success({ message: "Usuario Registrado con éxito" })).isConfirmed) {
                        formulario.reset();
                    }
                } else {
                    // Mostrar los errores de validación si existen
                    if (respuesta.errors.length > 0) {
                        let mensajes = respuesta.errors.map(e => `${e.campo}: ${e.message}`).join("\n");
                        await error("Errores de validación", mensajes);
                    } else {
                        await error("Error", respuesta.message || "No se pudo crear el usuario");
                    }
                }
            } else {
                await error("Faltan campos válidos", "");
            }
        };
    }

    const formulario = document.querySelector("#formUsuario");
    const cantidadCampos = contarCamposFormulario(formulario);



    formulario.addEventListener('submit', nuevoUsuario);

    nombre.addEventListener('keydown', validarLetras);
    nombre.addEventListener('keydown', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });
    nombre.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });

    telefono.addEventListener('keydown', validarNumeros);
    telefono.addEventListener('keydown', validarMaximo);
    telefono.addEventListener('keydown', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });
    telefono.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });

    cedula.addEventListener('keydown', validarNumeros);
    cedula.addEventListener('keydown', validarMaximo);
    cedula.addEventListener('keydown', (event) => {
        if (validarCedula(event.target)) limpiar(event.target);
    });
    cedula.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });

    correo.addEventListener('keydown', (event) => {
        if (validarCorreo(event.target)) limpiar(event.target);
    });
    correo.addEventListener('blur', (event) => {
        if (validarCorreo(event.target)) limpiar(event.target);
    });

    contraseña.addEventListener('keydown', (event) => {
        if (validarContrasenia(event.target)) limpiar(event.target);
    });
    contraseña.addEventListener('blur', (event) => {
        if (validarContrasenia(event.target)) limpiar(event.target);
    });

}