import "../../../../Styles/Mecanico/MecanicoPrincipal.css"
import { get ,post} from "../../../../Helpers/api";
import { confirmacion,success,error  } from "../../../../Helpers/alertas";
import { CrearReparaciones,contarCamposFormulario, recogerDatos,MostrarReparaciones } from "../../../../Helpers/Modules/modules";

export default async () =>{
    

  MostrarReparaciones()


 const form = document.querySelector("#dialogServicios")
 const doalogproductos = document.querySelector("#dialogProductos")
 const botonServicios = document.querySelector(".button_reparaciones")
 const botonproductos = document.querySelector(".button__Productos")
 const close = document.querySelector(".close__servicios")
 const close__productos = document.querySelector(".close__productos")
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
  CrearReparaciones()
  form.showModal()
 })
 close.addEventListener("click" , async =>{
  form.close()
 })

 botonproductos.addEventListener("click" , async =>{
    CrearReparaciones()
  doalogproductos.showModal()
 })
 close__productos.addEventListener("click" , async =>{
  doalogproductos.close()
 })

 const formServicios = document.querySelector("#insertar__servicios")
 const formproductos = document.querySelector("#insertar__productos")

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
    console.log(datos)
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
}