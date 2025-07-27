import { get, post } from "../../../../Helpers/api";
import { contarCamposFormulario, limpiar, validarLetras, validarMinimo, Vehiculos } from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Administrador/VehiculosAdmin.css";
import { confirmacion,success,error  } from "../../../../Helpers/alertas";


export default async (parametros = null) =>{
  
// Cargar datos iniciales
  const vehiculos = await get('Vehiculos');
  const usuarios = await get('Usuarios');


  // Elementos del DOM
  const dialogo = document.getElementById("insertarvehiculos");
  const cerrar = document.getElementById("cerrarvehiculos");
  const btnRegistrar = document.getElementById("registrar_vehiculos");
  const form = document.querySelector("#formVehiculo");
  const modelo = document.querySelector("#modelo");
  const marca = document.querySelector("#marca")
  const Usuario = document.querySelector("#usuario_id")
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
  Vehiculos(vehiculos, usuarios);
  // Abrir y cerrar el diálogo
  btnRegistrar.addEventListener("click", () => {
    dialogo.showModal();
  });

  cerrar.addEventListener("click", () => {
    dialogo.close();
  });

  // Manejo del formulario
  const CrearVehiculos = async (event) => {
    event.preventDefault();
    
    const contarcampos = contarCamposFormulario(form);
    let completados = 0;
    let datos = {};

    for (let i = 0; i < form.elements.length; i++) {
      const campo = form.elements[i];

      if (campo.hasAttribute('required')) {
        if (validarMinimo(campo)) {
          limpiar(campo);
          datos[campo.id.toLowerCase()] = campo.value.trim();
          completados++;
        }
      }
    }
    const usuarioId = datos["usuario_id"];
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuarioId);
    
    if (usuarioEncontrado) {
    datos["usuario_id"] = usuarioEncontrado.usuario_id;
    } else {
        dialogo.close()
          await error(" El usuario no está registrado.");
    return; 
    }

    if (completados === contarcampos) {
      dialogo.close();
      const confirm = await confirmacion("¿Desea Crear el usuario?")
      if(confirm.isConfirmed){
        const respuesta = await post('Vehiculos', datos);
        if((await success({ message: "vehiculo Registrado con exito"})).isConfirmed){
          if (respuesta?.ok) {
          location.reload();  
          } else {
            await error("No se pudo crear el Vehiculo", "");
          }
        }
      }
    } else {
      error("Por favor completa todos los campos requeridos.");
    }
  };

  modelo.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
   Usuario.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  marca.addEventListener('keydown' ,validarLetras);
   marca.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  })
  form.addEventListener("submit", CrearVehiculos);
}