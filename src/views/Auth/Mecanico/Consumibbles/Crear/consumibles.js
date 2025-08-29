import { get, post } from '../../../../../Helpers/api.js';
import { confirmacion, success, error } from '../../../../../Helpers/alertas.js';
import { recogerDatos, contarCamposFormulario } from '../../../../../Helpers/Modules/modules.js';

export default async () => {

    // Obtener referencias correctas a los formularios y dialogos

    const formproductos = document.querySelector('#insertar__productos');
    const reparacion = document.getElementById('detalle_id');
    const selectproducto = document.getElementById('producto_id');
    const servicios = await get('reparaciones');
    const productos = await get('Productos');

    // 🔹 Filtrar servicios únicos por detalle_id
    const reparacionesUnicas = servicios.data.filter(
        (servicio, index, self) =>
            index === self.findIndex(s => s.detalle_id === servicio.detalle_id)
    );

    // 🔹 Llenar el select de reparaciones
    reparacionesUnicas.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.detalle_id;
        option.textContent = `${servicio.detalle_id} - ${servicio.nombre_servicio} - ${servicio.placa}`;
        reparacion.appendChild(option);
    });

    // 🔹 Filtrar productos únicos por producto_id
    const productosUnicos = productos.data.filter(
        (producto, index, self) =>
            index === self.findIndex(p => p.producto_id === producto.producto_id)
    );

    // 🔹 Llenar el select de productos
    productosUnicos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.producto_id;
        option.textContent = `${producto.nombre}`;
        selectproducto.appendChild(option);
    });
    const formcrearConsumibles = async (event) => {
        event.preventDefault();
        const productos = await get('Productos');
        const datos = recogerDatos(formproductos);
        const contarcampos = contarCamposFormulario(formproductos);

        if (Object.keys(datos).length === contarcampos) {
            datos['producto_id'] = Number(datos['producto_id']);
            datos['cantidad_usada'] = Number(datos['cantidad_usada']);

            const productoSeleccionado = productos.data.find(p => p.producto_id === datos['producto_id']);
            if (!productoSeleccionado) {
                await error("Producto no encontrado", "");
                return;
            }

            datos['precio_unitario'] = Number(productoSeleccionado.precio);
            datos['total'] = datos['cantidad_usada'] * datos['precio_unitario'];


            const confirm = await confirmacion("¿Desea Crear el Consumible?");
            if (!confirm.isConfirmed) {
                return; // El usuario canceló
            }

            const respuesta = await post('ProductosConsumidos', datos);

            if (!respuesta) {
                await error("Error en la conexión al servidor", "");
                return;
            }
            console.log(datos);

            if (respuesta.ok) {
                const data = respuesta.data;
                await success({ message: data.mensaje || "Consumible Registrado con éxito" });
                window.history.back();
            } else {
                let errorMensaje = "Error desconocido";
                if (respuesta.data && respuesta.data.error) {
                    errorMensaje = respuesta.data.error;
                } else {
                    errorMensaje = "No se pudo leer el mensaje de error del servidor";
                }
                await error(errorMensaje);
            }
        } else {
            await error("Faltan campos válidos", "");
        }
    };
    formproductos.addEventListener('submit', formcrearConsumibles);
}