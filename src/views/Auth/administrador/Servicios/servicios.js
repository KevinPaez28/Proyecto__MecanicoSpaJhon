import { get, post } from "../../../../Helpers/api";
import "../../../../Styles/Administrador/servicios.css";
import { error , confirmacion,success} from "../../../../Helpers/alertas";
import { contarCamposFormulario, MostrarServicios,validarLetras,validarMinimo,limpiar } from "../../../../Helpers/Modules/modules";

export default async (parametros = null) =>{
 const form = document.querySelector("#formularioServicios")
 const nombre = document.querySelector("#nombre_servicio")
 const descripcion = document.querySelector("#descripcion")
 const precio = document.querySelector("#precio")
 const servicios = await get ("Servicios");
 const cerrarSesion = document.getElementById("cerrar_sesion");
   cerrarSesion.addEventListener("click", async (e) => {
     e.preventDefault(); // Evita que redireccione inmediatamente
     const confirmacionCerrar = await confirmacion("¿Desea cerrar sesión?");
     if (confirmacionCerrar.isConfirmed) {
       // Si necesitas limpiar datos de sesión
       // localStorage.clear();
       window.location.href = "#/Home"; 
     }
   });
 MostrarServicios(servicios)

    const crearServicios = async (event) =>{
    event.preventDefault()

        const contar_campos = contarCamposFormulario(form)

        let completados = 0;
        let datos = {}
        for(let i = 0; i < form.elements.length; i++){
            const campos = form.elements[i]
            
            if(campos.hasAttribute('required')){
                if (validarMinimo(campos)) {
                    limpiar(campos);
                    datos[campos.id.toLowerCase()] = campos.value.trim();
                    completados++;
                }   
            }
            console.log(datos)
        }
        if (completados === contar_campos) {
        const confirm = await confirmacion("¿Desea Crear el servicio?")
        if(confirm.isConfirmed){
        const respuesta = await post('Servicios', datos);
        if((await success({ message: "Servicio Registrado con exito"})).isConfirmed){
            if (respuesta?.ok) {
            location.reload();  
            } else {
            await error("No se pudo crear el Servicio", "");
            }
        }
        }
        } else {
           await error("Por favor completa todos los campos requeridos.");
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