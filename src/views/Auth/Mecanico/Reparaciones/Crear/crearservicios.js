
import { get, post } from '../../../../../Helpers/api.js';
import { confirmacion, success, error } from '../../../../../Helpers/alertas.js';
import { recogerDatos, contarCamposFormulario, validarFechaMinima } from '../../../../../Helpers/Modules/modules';

export default async () => {
    // Referencias a los formularios y dialogos
    const formServicios = document.getElementById('formServicios');
    const form = document.querySelector('#dialogServicios');
    const select = document.getElementById('servicio_id');
    const selectvehiculo = document.getElementById('vehiculo_id');
    const selectestado = document.getElementById('estado_id');
    const servicios = await get('Servicios');
    const vehiculos = await get('Vehiculos');
    const estado = await get('EstadoServicios');
    let usuario = localStorage.getItem("usuario");
    let usuario_id = null;
    if (usuario) {
        try {
            usuario = JSON.parse(usuario);
            usuario_id = usuario.usuario_id;
        } catch (e) {
            // Si no es un objeto, puede ser solo el id guardado como string
            usuario_id = usuario;
        }
    } else {
        // Si no existe, intenta obtener el id de mecanico_id
        usuario_id = localStorage.getItem("mecanico_id");
    }
    if (!usuario_id) {
        console.error("No se encontró un usuario_id en localStorage.");
        return;
    }
    servicios.data.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.servicio_id;       // el id del servicio
        option.textContent = servicio.nombre_servicio; // el nombre para mostrar
        select.appendChild(option);
    });
    vehiculos.data.forEach(vehiculo => {
        const option = document.createElement('option');
        option.value = vehiculo.vehiculo_id;       // el id del vehiculo
        option.textContent = `${vehiculo.placa}`; // el nombre para mostrar
        selectvehiculo.appendChild(option);
    });
    estado.data.forEach(est => {
        const option = document.createElement('option');
        option.value = est.estado_id;       // el id del estado
        option.textContent = est.nombre_estado; // el nombre para mostrar
        selectestado.appendChild(option);
    });
    const formCrearservicios = async (event) => {
        event.preventDefault();

        const datos = recogerDatos(formServicios);
        const contarcampos = contarCamposFormulario(formServicios);

        if (Object.keys(datos).length === contarcampos) {
            // Obtener el input de fecha para pasarlo a la validación
            const inputFecha = formServicios.querySelector('#fecha');


            // Obtener vehículo
            const vehiculo = await get(`Vehiculos/${datos['vehiculo_id']}`);
            if (!vehiculo) {
                await error("No se pudo obtener el vehículo", "");
                return;
            }
            // Preparar datos antes de enviar
            datos['servicio_id'] = Number(datos['servicio_id']);
            datos['vehiculo_id'] = Number(datos['vehiculo_id']);
            datos['estado_id'] = Number(datos['estado_id']);
            datos['fecha'] = datos['fecha'].trim();
            datos['observaciones'] = datos['observaciones'].trim();
            datos['nombre_mecanico'] = usuario_id;

            console.log(datos)

            try {
                const respuesta = await post('Reparaciones', datos);
                if (respuesta?.ok) {
                    const confirm = await confirmacion("¿Desea Crear el servicio?");
                    if (confirm.isConfirmed) {
                        const okSuccess = await success({ message: "Servicio Registrado con éxito" });
                        if (okSuccess.isConfirmed) {
                            window.history.back();
                        }
                    }
                } else {
                    await error(respuesta?.data?.error || "No se pudo crear el servicio", "");
                }
            } catch (e) {
                console.error(e);
                await error("Error inesperado al crear el servicio", "");
            }
        } else {
            await error("Faltan campos válidos", "");
        }
    };
    formServicios.addEventListener('submit', formCrearservicios);
}