import { get, post } from '../../../../../Helpers/api';
import { success, error } from '../../../../../Helpers/alertas';

export default async () => {
    const formfacturas = document.querySelector("#insertar__facturas");
    const selectReparacion = document.getElementById("detalle_idfactura");
    const dialogfactura = document.querySelector("#dialogfacturas");

    // --- 1. Llenar el select apenas cargue ---
    const cargarReparaciones = async () => {
        if (!selectReparacion) {
            console.error("No existe el select con id detalle_idfactura");
            return;
        }

        const servicios = await get("reparaciones");

        const reparacionesUnicas = servicios.data.filter(
            (servicio, index, self) =>
                index === self.findIndex(s => s.detalle_id === servicio.detalle_id)
        );

        reparacionesUnicas.forEach(servicio => {
            const option = document.createElement("option");
            option.value = servicio.detalle_id;
            option.textContent = `${servicio.detalle_id} - ${servicio.nombre_servicio} - ${servicio.placa}`;
            selectReparacion.appendChild(option);
        });
    };

    await cargarReparaciones();

    // --- 2. Crear factura ---
    const crearFacturas = async (event) => {
        event.preventDefault();

        // Validar que se haya seleccionado algo
        const detalleId = selectReparacion.value;
        if (!detalleId) return await error("Seleccione un servicio válido");

        // Obtener reparación seleccionada
        const reparacionResp = await get(`Reparaciones/${detalleId}`);
        console.log(reparacionResp);
        
        const reparacion = reparacionResp.data;
        if (!reparacion) return await error("No se encontró la reparación");

        // Obtener catálogo de servicios y productos
        const serviciosCatalogo = await get("servicios");
        const productosCatalogo = await get("productos");

        // Buscar el servicio principal
        const listaServicios = Array.isArray(serviciosCatalogo.data) ? serviciosCatalogo.data : [];
        const servicioEncontrado = listaServicios.find(
            s => Number(s.servicio_id) === Number(reparacion.servicio_id)
        );
        if (!servicioEncontrado || !servicioEncontrado.precio) {
            return await error(`No se encontró el servicio con ID ${reparacion.servicio_id} o no tiene precio`);
        }

        // Calcular subtotal: precio del servicio + suma de todos los productos consumidos
        let subtotal = Number(servicioEncontrado.precio);

        // Buscar todos los productos consumidos por la reparación
        const productosConsumidos = Array.isArray(reparacion.productos_consumidos)
            ? reparacion.productos_consumidos
            : [{ producto_id: reparacion.producto_id, cantidad_usada: reparacion.cantidad_usada }];

        if (productosConsumidos && productosConsumidos.length > 0) {
            const listaProductos = Array.isArray(productosCatalogo.data) ? productosCatalogo.data : [];
            productosConsumidos.forEach(prod => {
                const productoEncontrado = listaProductos.find(
                    p => Number(p.producto_id) === Number(prod.producto_id)
                );
                if (productoEncontrado && productoEncontrado.precio) {
                    subtotal += Number(productoEncontrado.precio) * Number(prod.cantidad_usada);
                }
            });
        }

        // Calcular total (puedes agregar impuestos si lo deseas)
        const total = subtotal; // Modifica aquí si necesitas sumar impuestos

        // Crear factura
        const nuevaFactura = {
            detalle_id: reparacion.detalle_id,
            usuario_id: reparacion.usuario_id,
            empresa_id: 1,
            fecha_emision: new Date().toISOString().split("T")[0],
            subtotal: subtotal,
            total: total
        };

        const respFactura = await post("facturas", nuevaFactura);
        if (!respFactura.ok) return await error("Error al crear la factura");

        await success({ message: "Factura creada correctamente" });
        window.history.back();
    };

    formfacturas.addEventListener('submit', crearFacturas);
};
