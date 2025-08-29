import { get, post } from "../../../../../Helpers/api.js";
import { limpiar, validarMinimo, validarLetras, validarFormularioCompleto } from "../../../../../Helpers/Modules/modules.js";
import { confirmacion, success, error } from "../../../../../Helpers/alertas.js";
export default async (parametros = null) => {

    const form = document.querySelector("#formularioServicios")
    const nombre = document.querySelector("#nombre_servicio")
    const descripcion = document.querySelector("#descripcion")
    const precio = document.querySelector("#precio")
    const servicios = await get("Servicios");
    const crearServicios = async (event) => {
        event.preventDefault()

        limpiar(form); // si tienes función para limpiar errores anteriores

        const formularioValido = validarFormularioCompleto(form);
        if (!formularioValido) {
            await error("Por favor completa todos los campos requeridos.");
            return;
        }

        let datos = {};
        for (let i = 0; i < form.elements.length; i++) {
            const campo = form.elements[i];

            if (campo.hasAttribute('required')) {
                limpiar(campo); // Borra errores visuales si los hay
                datos[campo.id.toLowerCase()] = campo.value.trim();
            }
        }

        const confirm = await confirmacion("¿Desea crear el servicio?");
        if (confirm.isConfirmed) {
            const respuesta = await post('Servicios', datos);

            if ((await success({ message: "Servicio registrado con éxito" })).isConfirmed) {
                if (respuesta?.ok) {
                    window.location.href = "#/Servicios";
                } else {
                    await error("No se pudo crear el servicio.");
                }
            }
        }
    }


    nombre.addEventListener('keydown', validarLetras);
    nombre.addEventListener('keydown', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });
    descripcion.addEventListener('blur', (event) => {
        if (validarMinimo(event.target)) limpiar(event.target);
    });



    form.addEventListener("submit", crearServicios);



}