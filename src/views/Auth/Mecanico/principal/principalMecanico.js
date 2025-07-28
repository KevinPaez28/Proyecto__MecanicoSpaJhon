import "../../../../Styles/Mecanico/MecanicoPrincipal.css"
import { get ,post} from "../../../../Helpers/api";
import { confirmacion,success,error  } from "../../../../Helpers/alertas";
import { MostrarselectsMecanicos,contarCamposFormulario, recogerDatos,MostrarReparaciones } from "../../../../Helpers/Modules/modules";

export default async () =>{
    

  MostrarReparaciones()


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
 cerrar_sesion.addEventListener("click", async () => {
  const confirm = await confirmacion("¿Desea cerrar sesión?");
  if (confirm.isConfirmed) {
  // Limpiar datos si aplica
  // localStorage.clear(); 
  window.location.href = "#/Home";
}
});
 botonServicios.addEventListener("click" , async =>{
  MostrarselectsMecanicos()
  form.showModal()
 })
 close.addEventListener("click" , async =>{
  form.close()
 })
 //productos
 botonproductos.addEventListener("click" , async =>{
    MostrarselectsMecanicos()
  doalogproductos.showModal()
 })
 close__productos.addEventListener("click" , async =>{
  doalogproductos.close()
 })
//facturas
 botonfacturas.addEventListener("click" , async =>{
  MostrarselectsMecanicos()
  dialogfactura.showModal()
})
  close__facturas.addEventListener("click" , async =>{
  dialogfactura.close()
})
  
 const formServicios = document.querySelector("#insertar__servicios")
 const formproductos = document.querySelector("#insertar__productos")
 const formfacturas = document.querySelector("#insertar__facturas")
  const formCrearservicios = async (event) =>{
  event.preventDefault();

    const datos =  recogerDatos(formServicios);
    const contarcampos = contarCamposFormulario(formServicios);

    //verificamsos que el numero de campo completados coincida con los ingresados
    if (Object.keys(datos).length === contarcampos){
 // Obtenemos el usuario automáticamente desde el vehículo
        const vehiculo = await get(`Vehiculos/${datos['vehiculo_id']}`);
        if (!vehiculo) {
            await error("No se pudo obtener el vehículo", "");
            return;
        }
        datos['servicio_id'] = Number(datos['servicio_id']);
        datos['vehiculo_id'] = Number(datos['vehiculo_id']);
        datos['usuario_id'] = Number(vehiculo.usuario_id);
        datos['estado_id'] = Number(datos['estado_id']);
        datos['fecha'] = datos['fecha'].trim();
        datos['observaciones'] = datos['observaciones'].trim();    
        console.log(datos);
        
        const respuesta = await post('Reparaciones', datos);
        form.close()
          const confirm = await confirmacion("¿Desea Crear el servicio?")
          if(confirm.isConfirmed){
            if((await success({ message: "servicio Registrado con exito"})).isConfirmed){
              if (respuesta?.ok) {
                location.reload()
                formServicios.reset();
              } else {
                await error("No se pudo crear el servicio", "");
              }
            }
          }
    } else {
        await error("Faltan campos válidos","");
    }
  }
  formServicios.addEventListener('submit',formCrearservicios )


  const formcrearConsumibles = async (event) =>{
  event.preventDefault();
    const datos =  recogerDatos(formproductos);
    const respuesta = await post('DetalleServConsumible', datos);
    doalogproductos.close()
    const confirm = await confirmacion("¿Desea Crear el Consumible?")
    if(confirm.isConfirmed){
        if((await success({ message: "Consumible Registrado con exito"})).isConfirmed){
            if (respuesta?.ok) {
            location.reload()
            formServicios.reset();
            } else {
            await error("No se pudo crear el Consumible", "");
            }
        }
    }
  }
  formproductos.addEventListener('submit', formcrearConsumibles)

  const crearFacturas = async(event) =>{
     const detalleId = document.getElementById("detalle_idfactura").value;
    if (!detalleId) return await error("Seleccione un servicio válido");

    // 1. Obtener reparación
    const reparacion = await get(`Reparaciones/${detalleId}`);
    if (!reparacion) return await error("No se encontró la reparación");

    console.log(detalleId);

    // 2. Obtener catálogo
    const datosFactura = await get("FormDataReparacion");
    console.log("Servicios disponibles:", datosFactura.servicios);

    const idServicio = Number(reparacion.servicio_id);

    // Buscar servicio exacto
    const servicioEncontrado = datosFactura.servicios.find(
        s => Number(s.servicio_id) === idServicio
    );

    console.log("Servicio buscado con ID:", idServicio);
    console.log("Servicio encontrado:", servicioEncontrado);

    if (!servicioEncontrado || servicioEncontrado.precio == null) {
        return await error("No se encontró el servicio ni su precio");
    }

    // 3. Buscar factura del usuario
    const facturas = await get("facturas");
    const factura = facturas.find(f => f.usuario_id === reparacion.usuario_id);
    if (!factura) return await error("El usuario no tiene factura generada");

    // 4. Armar detalles
    const detalles = [{
        factura_id: factura.factura_id,
        servicio_id: idServicio,
        producto_id: null,
        cantidad: 1,
        precio_unitario: servicioEncontrado.precio,
        total: servicioEncontrado.precio
    }];

    if (reparacion.producto_id) {
        const productoEncontrado = datosFactura.productos.find(
            p => Number(p.producto_id) === Number(reparacion.producto_id)
        );
        if (!productoEncontrado) return await error("No se encontró el producto en el catálogo");

        detalles.push({
            factura_id: factura.factura_id,
            servicio_id: null,
            producto_id: reparacion.producto_id,
            cantidad: reparacion.cantidad_usada,
            precio_unitario: productoEncontrado.precio,
            total: productoEncontrado.precio * reparacion.cantidad_usada
        });
    }

    console.log("Detalles a enviar:", detalles);

    // 5. Guardar cada detalle
    for (const d of detalles) {
        dialogfactura.close();
        const resp = await post("detallesfactura", d);
        if (!resp.ok) return await error("Error al agregar detalles a la factura");
    }

    await success({ message: "Detalle de factura generado correctamente" });
    location.reload();
};
  formfacturas.addEventListener('submit' , crearFacturas)
}