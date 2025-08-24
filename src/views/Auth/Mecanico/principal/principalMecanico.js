import "../../../../Styles/Mecanico/MecanicoPrincipal.css"
import { get, post } from "../../../../Helpers/api";
import { confirmacion, success, error } from "../../../../Helpers/alertas";
import { MostrarselectsMecanicos, contarCamposFormulario, recogerDatos, MostrarReparaciones, validarFechaMinima, validarFormularioCompleto } from "../../../../Helpers/Modules/modules";

export default async () => {
  const form = document.querySelector("#dialogServicios")
  const doalogproductos = document.querySelector("#dialogProductos")
  const dialogfactura = document.querySelector("#dialogfacturas")
  const botonServicios = document.querySelector("#button_reparaciones")
  const botonproductos = document.querySelector("#button__Productos")
  const botonfacturas = document.querySelector("#button__factura")
  const close = document.querySelector(".close__servicios")
  const close__productos = document.querySelector(".close__productos")
  const close__facturas = document.querySelector(".close__factura")
  const cerrar_sesion = document.getElementById("btnCerrarSesion")
  let id = null;

  if (window.location.hash.includes("id=")) { // verifica si hay id en la url
    id = window.location.hash.split("id=")[1]; // toma el primer valor despues de "id="
  }

  if (id) { //guarda el id si existe
    localStorage.setItem("mecanico_id", id);
  } else {
    id = localStorage.getItem("mecanico_id"); // trae el id guardado en localStorage
  }

  if (!id) { //valida si existe un id 
    console.error("No se encontró un ID de usuario.");
    return;
  }


  MostrarReparaciones()

  cerrar_sesion.addEventListener("click", async () => {
    const confirmacionRespuesta = await confirmacion("¿Desea cerrar sesión?");
    if (confirmacionRespuesta.isConfirmed) {
      localStorage.clear();
      window.location.href = "#/Home";
    }
  });
  botonServicios.addEventListener("click", async => {
    MostrarselectsMecanicos()
    form.showModal()
  })
  close.addEventListener("click", async => {
    form.close()
  })
  //productos
  botonproductos.addEventListener("click", async => {
    MostrarselectsMecanicos()
    doalogproductos.showModal()
  })
  close__productos.addEventListener("click", async => {
    doalogproductos.close()
  })
  //facturas
  botonfacturas.addEventListener("click", async => {
    MostrarselectsMecanicos()
    dialogfactura.showModal()
  })
  close__facturas.addEventListener("click", async => {
    dialogfactura.close()
  })

  const formServicios = document.querySelector("#insertar__servicios")
  const formproductos = document.querySelector("#insertar__productos")
  const formfacturas = document.querySelector("#insertar__facturas")
  const fecha = document.getElementById('#fecha');

  const formCrearservicios = async (event) => {
    event.preventDefault();

    const datos = recogerDatos(formServicios);
    const contarcampos = contarCamposFormulario(formServicios);

    if (Object.keys(datos).length === contarcampos) {
      // Obtener el input de fecha para pasarlo a la validación
      const inputFecha = formServicios.querySelector('#fecha');

      // Validar fecha con el input (para mostrar mensajes)
      if (!validarFechaMinima(inputFecha)) {
        form.close();
        await error("La fecha no puede ser menor que hoy.", "");
        return;
      }

      // Obtener vehículo
      const vehiculo = await get(`Vehiculos/${datos['vehiculo_id']}`);
      if (!vehiculo) {
        await error("No se pudo obtener el vehículo", "");
        return;
      }
      const ids = localStorage.getItem("mecanico_id")
      const Usuarios= await get(`Usuarios/${ids}`)
      let nombre = Usuarios.nombre;
    
      // Preparar datos antes de enviar
      datos['servicio_id'] = Number(datos['servicio_id']);
      datos['vehiculo_id'] = Number(datos['vehiculo_id']);
      datos['estado_id'] = Number(datos['estado_id']);
      datos['fecha'] = datos['fecha'].trim();
      datos['observaciones'] = datos['observaciones'].trim();
      datos['nombre_mecanico'] = nombre;
      
      console.log(datos)

      try {
        const respuesta = await post('Reparaciones', datos);
        form.close();

        if (respuesta?.ok) {
          const confirm = await confirmacion("¿Desea Crear el servicio?");
          if (confirm.isConfirmed) {
            const okSuccess = await success({ message: "Servicio Registrado con éxito" });
            if (okSuccess.isConfirmed) {
              location.reload();
              formServicios.reset();
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
  formServicios.addEventListener('submit', formCrearservicios)


  const formcrearConsumibles = async (event) => {
    event.preventDefault();
    const productos = await get('Productos'); // Asumo que tienes esta función

const datos = recogerDatos(formproductos); // Asumo que la tienes definida
const contarcampos = contarCamposFormulario(formproductos); // También definida

if (Object.keys(datos).length === contarcampos) {

  datos['producto_id'] = Number(datos['producto_id']);
  datos['cantidad_usada'] = Number(datos['cantidad_usada']);

  const productoSeleccionado = productos.find(p => p.producto_id === datos['producto_id']);
  if (!productoSeleccionado) {
    await error("Producto no encontrado", "");
    return;
  }

  datos['precio_unitario'] = Number(productoSeleccionado.precio);
  datos['total'] = datos['cantidad_usada'] * datos['precio_unitario'];

  doalogproductos.close();

  const confirm = await confirmacion("¿Desea Crear el Consumible?");
  if (!confirm.isConfirmed) {
    return; // El usuario canceló
  }

  const respuesta = await post('DetalleServConsumible', datos);

  if (!respuesta) {
    await error("Error en la conexión al servidor");
    return;
  }

  if (respuesta.ok) {
    const data = respuesta.data; // Aquí ya está el JSON parseado
    await success({ message: data.mensaje || "Consumible Registrado con éxito" });
    location.reload();
    formServicios.reset();
  } else {
    // Aquí manejamos el error para mostrar el mensaje enviado por backend
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
  formproductos.addEventListener('submit', formcrearConsumibles)

  const crearFacturas = async (event) => {
    const detalleId = document.getElementById("detalle_idfactura").value;
    if (!detalleId) return await error("Seleccione un servicio válido");

    // 1. Obtener reparación
    const reparacion = await get(`Reparaciones/${detalleId}`);
    if (!reparacion) return await error("No se encontró la reparación");

    // 2. Obtener catálogo (para traer servicios y productos con sus precios)
    const datosFactura = await get("FormDataReparacion");
    const idServicio = Number(reparacion.servicio_id);

    // Buscar el servicio
    const servicioEncontrado = datosFactura.servicios.find(
      s => Number(s.servicio_id) === idServicio
    );
    if (!servicioEncontrado || servicioEncontrado.precio == null) {
      return await error("No se encontró el servicio ni su precio");
    }

    // 3. Calcular subtotal: precio del servicio + precio de productos (si hay)
    let subtotal = servicioEncontrado.precio;

    if (reparacion.producto_id) {
      const productoEncontrado = datosFactura.productos.find(
        p => Number(p.producto_id) === Number(reparacion.producto_id)
      );
      if (!productoEncontrado) return await error("No se encontró el producto en el catálogo");

      subtotal += (productoEncontrado.precio * reparacion.cantidad_usada);
    }

    // 4. Crear el objeto factura
    const nuevaFactura = {
      detalle_id: reparacion.detalle_id,
      usuario_id: reparacion.usuario_id,
      empresa_id: 1, // <-- Ajusta si la empresa cambia dinámicamente
      fecha_emision: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      subtotal: subtotal,
      total: subtotal // Aquí podrías agregar impuestos si quieres
    };

    // 5. Guardar la factura
    const respFactura = await post("facturas", nuevaFactura);
    if (!respFactura.ok) return await error("Error al crear la factura");

    // 6. Confirmar al usuario
    dialogfactura.close()
    await success({ message: "Factura creada correctamente" });
    location.reload();
  };
  formfacturas.addEventListener('submit', crearFacturas)
}