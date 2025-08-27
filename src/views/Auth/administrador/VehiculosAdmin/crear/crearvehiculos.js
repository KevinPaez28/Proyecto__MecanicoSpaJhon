import "../../../../../Styles/Administrador/VehiculosAdmin.css";
import { get, post } from "../../../../../Helpers/api";
import { contarCamposFormulario, limpiar, validarLetras, validarMinimo } from "../../../../../Helpers/Modules/modules";
import { confirmacion, success, error } from "../../../../../Helpers/alertas";

export default async (parametros = null) => {
    const usuarios = await get('Usuarios');
    const form = document.querySelector("#formVehiculo");
    const modelo = document.querySelector("#modelo");
    const marca = document.querySelector("#marca")
    const Usuario = document.querySelector("#usuario")


    const CrearVehiculos = async (event) => {
        event.preventDefault();
        // Limpiar errores visuales anteriores
        for (let i = 0; i < form.elements.length; i++) {
            limpiar(form.elements[i]);
        }

        const contarcampos = contarCamposFormulario(form);
        let completados = 0;
        let datos = {};

        for (let i = 0; i < form.elements.length; i++) {
            const campo = form.elements[i];
            if (campo.hasAttribute('required')) {
                if (validarMinimo(campo)) {
                    limpiar(campo);
                    datos[campo.id.toLowerCase()] = campo.value.trim();
                    completados++;
                }
            }
        }
        if (completados !== contarcampos) {
            await error("Por favor completa todos los campos requeridos.");
            return;
        }
        const confirm = await confirmacion("¿Desea Crear el Vehículo?");
        if (!confirm.isConfirmed) return;
        console.log(datos);

        const respuesta = await post('Vehiculos', datos);

        if (respuesta.ok) {
            if ((await success({ message: "Vehículo registrado con éxito" })).isConfirmed) {
                window.location.href = "#/administrador/Vehiculos";
            }
        } else {
            // Verificar si existen errores
            if (respuesta.errors.length > 0) {
                let mensajes = respuesta.errors.map(e => `${e.message}`).join("\n");
                await error("Errores de validación", mensajes);
            }
        }
    };

    // Escuchar submit del formulario
    modelo.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });
    Usuario.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });
    marca.addEventListener('keydown', validarLetras);
    marca.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    })
    form.addEventListener("submit", CrearVehiculos);
}

