import { post, get } from '../../../../../Helpers/api';
import { contarCamposFormulario, limpiar, validarMinimo } from '../../../../../Helpers/Modules/modules';
import { confirmacion, success, error } from '../../../../../Helpers/alertas';

export default async (parametros = null) => {

    const formularioproductos = document.getElementById('productos');
    const select = document.getElementById('categoria_id');

    // Cargar categorías en el select
    const categoriasResponse = await get('Categorias');
    if (categoriasResponse?.data && select) {
        categoriasResponse.data.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.categoria_id;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });
    }
    const CrearProductos = async (event) => {
        event.preventDefault();

        const totalRequeridos = contarCamposFormulario(formularioproductos);
        let completados = 0;
        let datos = {};

        for (let i = 0; i < formularioproductos.elements.length; i++) {
            const campo = formularioproductos.elements[i];
            if (campo.hasAttribute('required')) {
                if (validarMinimo(campo)) {
                    limpiar(campo);
                    // Si es el select de categoría, guarda el id
                    if (campo.id === 'categoria_id') {
                        datos['categoria_id'] = campo.value;
                    } else {
                        datos[campo.id.toLowerCase()] = campo.value.trim();
                    }
                    completados++;
                }
            }
        }

        if (completados === totalRequeridos) {
            const confirm = await confirmacion("¿Desea Crear el Producto?");
            if (confirm.isConfirmed) {
                const respuesta = await post('Productos', datos);

                if (respuesta.ok) {
                    // Todo bien, producto creado
                    if ((await success({ message: "Producto registrado con éxito" })).isConfirmed) {
                        formularioproductos.reset();
                        window.location.href = "#/Categorias";
                    }
                } else {
                    // Leer error desde la respuesta JSON
                    let errorMsg = "No se pudo crear el producto";
                    try {
                        const errorData = await respuesta.json();
                        if (errorData.error) {
                            errorMsg = errorData.error;
                        }
                    } catch (e) {
                        // no hacer nada, mantener mensaje por defecto
                    }
                    await error(errorMsg, "");
                }
            }
        } else {
            await error("Por favor completa todos los campos requeridos.");
        }
    };
    if (formularioproductos) {
        formularioproductos.addEventListener('submit', CrearProductos);
    }
}