import { post } from "../../Helpers/api.js";
import {  contarCamposFormulario,validar,validarCorreo,validarMinimo,validarCedula,validarContrasenia,validarLetras,validarNumeros,validarMaximo,limpiar } from "../../Helpers/Modules/modules.js"
import "../../Styles/Signup.css";

export default (parametros = null) =>{

  const cedula= document.querySelector("#cedula")
  const nombre= document.querySelector("#nombre")
  const correo= document.querySelector("#correo")
  const telefono= document.querySelector("#telefono")
  const usuario= document.querySelector("#usuario")
  const contraseña= document.querySelector("#contrasena")
  const rol_id= document.querySelector("#rol")



  const formulario = document.querySelector("#formUsuario");
  const cantidadCampos = contarCamposFormulario(formulario);

  const nuevoUsuario = async (event) => {
    event.preventDefault();

    const datos = validar(event);
    console.log("Datos validados:", datos);
    if (Object.keys(datos).length === cantidadCampos) {
      datos['rol_id'] = 3;
      
      datos['cedula'] = datos['cedula'].trim();
      datos['telefono'] = datos['telefono'].trim();
      datos['nombre'] = datos['nombre'].trim();
      datos['correo'] = datos['correo'].trim();
      datos['usuario'] = datos['usuario'].trim();
      datos['contrasena'] = datos['contrasena'].trim();

      delete datos['documento'];
      
      console.log("Datos validados:", datos);

      const respuesta = await post('Usuarios', datos); 

      if (respuesta?.ok) {
        alert("Usuario creado correctamente");
        formulario.reset();
      } else {
        alert("No se pudo crear el usuario");
      }
    } else {
      alert("Faltan campos válidos");
    }
  };

  formulario.addEventListener('submit', nuevoUsuario);

  nombre.addEventListener('keydown', validarLetras);
  nombre.addEventListener('keydown', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  nombre.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  telefono.addEventListener('keydown', validarNumeros);
  telefono.addEventListener('keydown', validarMaximo);
  telefono.addEventListener('keydown', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });
  telefono.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  cedula.addEventListener('keydown', validarNumeros);
  cedula.addEventListener('keydown', validarMaximo);
  cedula.addEventListener('keydown', (event) => {
    if (validarCedula(event.target)) limpiar(event.target);
  });
  cedula.addEventListener('blur', (event) => {
    if (validarMinimo(event.target)) limpiar(event.target);
  });

  correo.addEventListener('keydown', (event) => {
    if (validarCorreo(event.target)) limpiar(event.target);
  });
  correo.addEventListener('blur', (event) => {
    if (validarCorreo(event.target)) limpiar(event.target);
  });

  contraseña.addEventListener('keydown', (event) => {
    if (validarContrasenia(event.target)) limpiar(event.target);
  });
  contraseña.addEventListener('blur', (event) => {
    if (validarContrasenia(event.target)) limpiar(event.target);
  });

}

