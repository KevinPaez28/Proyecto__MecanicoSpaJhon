import { post } from '../../../../../Helpers/api';
import { contarCamposFormulario, limpiar, validarMinimo } from '../../../../../Helpers/Modules/modules';
import { confirmacion, success, error } from '../../../../../Helpers/alertas';

export default async (parametros = null) => {

    const formularioCategoria = document.getElementById('categorias');
    const CrearCategorias = async (event) => {
        event.preventDefault();

        const totalRequeridos = contarCamposFormulario(formularioCategoria);
        let completados = 0;
        let datos = {};

        for (let i = 0; i < formularioCategoria.elements.length; i++) {
            const campo = formularioCategoria.elements[i];

            if (campo.hasAttribute('required')) {
                if (validarMinimo(campo)) {
                    limpiar(campo);
                    datos[campo.id.toLowerCase()] = campo.value.trim();
                    completados++;
                }
            }
        }

        if (completados === totalRequeridos) {
            const confirm = await confirmacion("¿Desea Crear la Categoría?");
            if (confirm.isConfirmed) {
                const respuesta = await post('Categorias', datos);
                if (respuesta.ok) {
                    if ((await success({ message: "Categoria registrada con éxito" })).isConfirmed) {
                        window.location.href = "#/Categorias";
                    }
                } else {
                    // Verificar si existen errores
                    if (respuesta.errors.length > 0) {
                        let mensajes = respuesta.errors.map(e => `${e.message}`).join("\n");
                        await error("Errores de validación", mensajes);
                    }
                }
            }

        } else {
            await error("Por favor completa todos los campos requeridos.");
        }
    };
    formularioCategoria.addEventListener('submit', CrearCategorias);

}